import { h } from 'preact'

const IconStatus = (props) => (
  <div class="mnm-icon-status">
    <div class={`mnm-icon-status__icon ${props.classes}`}>{props.icon}</div>
  </div>
)

export default IconStatus
