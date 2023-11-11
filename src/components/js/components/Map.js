/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { h } from 'preact'
import { useState, useEffect } from 'preact/hooks'

import { behaviorToFeatureClass } from '../business/mapCell'
import MenuOptions from '../atoms/MenuOptions'

const levelToClass = level => `level-${level || 2}`

const CellNode = (props) => {
  const { menu, classes, onNodeMouseEnter, onNodeMouseLeave } = props

  const [menuOpen, setMenuOpen] = useState(false)

  const onMouseEnter = (ev) => {
    if (onNodeMouseEnter) { onNodeMouseEnter(ev) }

    if (menu && (!menu.showCallback || menu.showCallback(ev))) {
      setMenuOpen(true)
    }
  }

  const onMouseLeave = () => {
    if (onNodeMouseLeave) { onNodeMouseLeave() }
    setMenuOpen(false)
  }

  return (
    <div
      class={classes.BOX}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div class="mnm-map__cell-container-content" onClick={props.onClick}>
        <div class={`${classes.CONTENT}`}>{props.children}</div>
      </div>
      {
        menu && (
          <MenuOptions open={menuOpen}>
            {/* <div class="menu-container"> */}
              {menu.options.map((op) => (<div onClick={op.callback}>{op.label}</div>))}
            {/* </div> */}
          </MenuOptions>
        )
      }
    </div>
  )
}

const Cell = (props) => {
  const {
    elemId, name, children, level, onClick, collapsed,
    cellBehaviours = [], menu,
    labelInfo,
    onNodeMouseEnter, onNodeMouseLeave,
  } = props

  const initialState = {
    collapsed,
  }

  const [cellState, setCellState] = useState(initialState)

  const onClickCell = (ev) => {
    if (onClick) {
      const resultState = onClick(ev, cellState)
      if (!!resultState && JSON.stringify(cellState) !== JSON.stringify(resultState)) {
        setCellState(resultState)
      }
    }
  }

  const levelN = Number(level)
  const levelClass = levelToClass(levelN)

  const collapsedClass = cellState.collapsed ? 'collapsed' : ''
  const classesNodes = `mnm-map__cell-nodes ${levelClass} ${collapsedClass}`

  const classesArrays = {
    CELL: ['mnm-map__cell', levelClass, collapsedClass],
    ICON: ['mnm-map__cell-icon'],
    BOX: ['mnm-map__cell-box', levelClass],
    CONTENT: ['mnm-map__cell-content'],
  }

  behaviorToFeatureClass(classesArrays, cellBehaviours)

  const classes = {}
  Object.keys(classesArrays).forEach((key) => {
    classes[key] = classesArrays[key].join(' ')
  })

  useEffect(() => {
    if (cellState.collapsed !== collapsed) {
      setCellState({
        ...cellState,
        collapsed,
      })
    }
  }, [collapsed])

  return (
    <div class={classes.CELL}>
      <CellNode
        level={level}
        onClick={onClickCell}
        classes={classes}
        menu={menu}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
      >
        {name}
      </CellNode>
      {(!levelN || levelN === 2) && (
        <div class="mnm-map__cell-lineH">
          <div class={classes.ICON} />
        </div>
      )}
      <div class={classesNodes}>
        {levelN === 1 && <div class="mnm-map__cell-lineV" />}
        {children}
      </div>
    </div>
  )
}

const Map = ({ children }) => (
  <div class="mnm-map">
    <div class="mnm-map__grid">
      {children}
    </div>
  </div>
)

export { Map, Cell }
