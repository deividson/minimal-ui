/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { h } from 'preact'
import { useState } from 'preact/hooks'

import IconStatus from '../atoms/IconStatus'
import Menu from './Menu'
import MenuOptions from '../atoms/MenuOptions'

const ToolbarMenu = ({ btnId, options, callback }) => (
  <MenuOptions>
    {/* <div class="menu-container"> */}
      {options && options.map((menuOption) => (
        <div
          onClick={() => (callback(btnId, menuOption.optionId))}
          role="button"
          aria-label={menuOption.label}
        >
          {menuOption.label}
        </div>
      ))}
    {/* </div> */}
  </MenuOptions>
)

const ToolbarButton = ({
  btnId, name, classes, callback, icon, onHover, isMenu, disabled, isActive, menuOptions,
}) => (
  <div
    class={`mnm-header-toolbar__button ${classes || ''} ${disabled ? 'disabled' : ''} ${isMenu ? 'mnm-menu' : ''}`}
    onClick={() => (disabled || isMenu ? '' : callback(btnId))}
    onMouseEnter={() => onHover(true, name, btnId)}
    onMouseLeave={() => onHover(false, name, btnId)}
    role="button"
  >
    {icon}
    {isMenu && isActive && !disabled && (
      <ToolbarMenu btnId={btnId} options={menuOptions} callback={callback} />
    )}
  </div>
)

const Toolbar = ({ buttons, onHover, buttonActiveId, buttonActiveStatus }) => (
  <div class="mnm-header-toolbar">
    {buttons && buttons.map((button) => (
      <ToolbarButton
        {...button}
        isActive={buttonActiveId === button.btnId && buttonActiveStatus}
        isMenu={button.buttonType === 'menu'}
        onHover={(active, btnLabel, btnId) => onHover(active, btnLabel, btnId)}
      />
    ))}
  </div>
)

const initialState = {
  infoTitle: '',
  buttonActiveId: '',
  buttonActiveStatus: false,
}

const HeaderInfo = (props) => {
  const { toolbar, status, secondaryField } = props
  const [headerState, setHeaderState] = useState(initialState)

  const { infoTitle, buttonActiveId, buttonActiveStatus } = headerState

  const onButtonHover = (active, btnLabel, btnId) => {
    setHeaderState({
      infoTitle: active ? btnLabel : '',
      buttonActiveId: btnId,
      buttonActiveStatus: active,
    })
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
      <Toolbar
        {...toolbar}
        onHover={onButtonHover}
        buttonActiveId={buttonActiveId}
        buttonActiveStatus={buttonActiveStatus}
      />
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
