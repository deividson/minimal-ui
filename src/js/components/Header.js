/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { h } from 'preact'
import { useState } from 'preact/hooks'

import IconStatus from '../atoms/IconStatus'
import Menu from './Menu'

import { ICONS_CODES, PAGE_STATUS } from '../data/status'

const SubMenuButton = ({ btnId, name, classes, callback, icon, onHover, disabled }) => (
  <div
    class={`mnm-header-submenu__button ${classes || ''} ${disabled ? 'disabled' : ''}`}
    onClick={() => (disabled ? '' : callback(btnId))}
    onMouseEnter={() => onHover(true, name)}
    onMouseLeave={() => onHover(false, name)}
    role="button"
  >
    {icon}
  </div>
)

const SubMenu = (props) => (
  <div class="mnm-header-submenu">
    {props.buttons && props.buttons.map((button) => (
      <SubMenuButton
        {...button}
        onHover={(active, btnLabel) => props.onHover(active, btnLabel)}
      />
    ))}
  </div>
)

const HeaderInfo = (props) => {
  const [infoTitle, setInfoTitle] = useState('')
  const { menu, status, secondaryField } = props

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
      <SubMenu {...menu} onHover={onButtonHover} />
      <IconStatus {...status} />
    </div>
  )
}

export default ({
  menuItems, title, subMenu, status, secondaryField,
}) => (
  <div class="mnm-header">
    {menuItems && <Menu>{menuItems}</Menu>}
    <div class="mnm-header__title">{title}</div>
    {(subMenu || status) && <HeaderInfo menu={subMenu} status={status} secondaryField={secondaryField}/>}
  </div>
)
