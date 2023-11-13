import { h } from 'preact'
import MenuIcon from '../atoms/MenuIcon'
import MenuOptions from '../atoms/MenuOptions'

const Menu = ({ children }) => (
  <div class="mnm-menu mnm-menu--main">
    <MenuIcon />
    <MenuOptions>
      {children}
    </MenuOptions>
  </div>
)

export default Menu
