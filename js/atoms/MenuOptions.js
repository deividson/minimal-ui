import { h } from 'preact'

export default ({ children, open }) => (
  <nav class={`mnm-menu-options ${open ? 'opened' : ''}`}>
    {children}
  </nav>
)
