/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { h } from 'preact'
import { useState } from 'preact/hooks'

import IconStatus from '../atoms/IconStatus'
import Menu from './Menu'
// import MenuOptions from '../atoms/MenuOptions'

const ToolbarMenu = (props) => (
  <div>
    
  </div>
)

const ToolbarButton = ({
  btnId, name, classes, callback, icon, onHover, buttonType, disabled, menuOptions,
}) => (
  <div
    class={`mnm-header-toolbar__button ${classes || ''} ${disabled ? 'disabled' : ''}`}
    onClick={() => (disabled ? '' : callback(btnId))}
    onMouseEnter={() => onHover(true, name)}
    onMouseLeave={() => onHover(false, name)}
    role="button"
  >
    {icon}
    {buttonType === 'menu' && (
      <ToolbarMenu />
    )}
  </div>
)

const ToolBar = ({ buttons, onHover }) => (
  <div class="mnm-header-toolbar">
    {buttons && buttons.map((button) => (
      <ToolbarButton
        {...button}
        onHover={(active, btnLabel) => onHover(active, btnLabel)}
      />
    ))}
  </div>
)

const HeaderInfo = (props) => {
  const [infoTitle, setInfoTitle] = useState('')
  const { toolbar, status, secondaryField } = props

  const onButtonHover = (active, btnLabel) => {
    const label = active ? btnLabel : ''
    setInfoTitle(label)
  }

  const showSecField = () => secondaryField && !secondaryField.hidden

  return (
    <div class="mnm-header__info">
      <div class="mnm-header__info-secondary-field">
        {!showSecField() && <div class="mnm-header__info-title">{infoTitle}</div>}
        {showSecField() && (
          <div class="mnm-header__info-input">
            {secondaryField.component()}
          </div>
        )}
      </div>
      <ToolBar {...toolbar} onHover={onButtonHover} />
      <IconStatus {...status} />
    </div>
  )
}

// TODO toolbar substituiu subMenu, mantendo por compatibilidade
export default ({
  menuItems, title, subMenu, toolbar, status, secondaryField,
}) => (
  <div class="mnm-header">
    {menuItems && <Menu>{menuItems}</Menu>}
    <div class="mnm-header__title">{title}</div>
    {(subMenu || toolbar || status) && <HeaderInfo toolbar={subMenu || toolbar} status={status} secondaryField={secondaryField}/>}
  </div>
)
