import { h } from 'preact'

// import Teste from 'teste'
// console.log('========= Teste', Teste)
// Teste()


const buildStatusClass = (base, status, style = [], extraClasses =[], leaf = false, firstCell) => {
  const baseClass = base
  const statusClass = status ? `${baseClass}--${status}` : ''
  const styleClasses = style.map(sClass => `mnm--${sClass}`)

  return `${baseClass} ${statusClass} ${styleClasses.join(' ')} ${extraClasses.join(' ')} ${leaf ? 'mnm-tooltip' : ''} ${firstCell ? 'mnm--firstcell' : ''}`
}

const CELL_STATUS = {
  HIGHLIGHT: 'high',
  ALERT: 'alert',
  WARNING: 'warning',
  DEFAULT: 'default',
}

const Elem = (props) => {
  const { elemId, children, classBase, status, style, extraClasses, leaf, tooltip, firstCell } = props

  const elemClasses = buildStatusClass(classBase, status, style, extraClasses, leaf, firstCell)

  const renderContent = () => {
    if (leaf) {
      return (<div class="mnm-table__elem-content">{children}</div>)
    }
    return (children)
  }

  return (
    <div class={elemClasses}>
      {renderContent()}
      {(tooltip && leaf) && <span class="mnm-tooltiptext">{tooltip}</span>}
    </div>
  )
}

const Cell = (props) => (<Elem classBase="mnm-table__cell" {...props} leaf />)

const Row = (props) => {
  const { elemId, style } = props

  const styleList = (elemId % 2 !== 0) ? ['odd'] : []

  return (<Elem classBase="mnm-table__row" {...props} style={styleList.concat(style)} />)
}

const Table = (props) => {
  const { title, children, button } = props

  return (
    <div class="mnm-table">
      <div class="mnm-table__title">{title}{button && <div class="mnm-table__btn" onClick={button.callback}>{button.icon}</div>}</div>
      <div class="mnm-table__grid">
        {children}
      </div>
    </div>
  )
}

export { Table, Row, Cell, CELL_STATUS }