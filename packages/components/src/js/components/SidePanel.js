import { h } from 'preact'

const renderBlock = (block) => {
  const isArray = Array.isArray(block)
  let content = block

  if (isArray) {
    content = block.map((bl) => (<div class="mnm-sidepanel__block-line">{bl}</div>))
  }

  return (
    <div class="mnm-sidepanel__block">
      {content}
    </div>
  )
}

const renderContents = (children = []) => (
  <div class="mnm-sidepanel__body">
    {children && children.filter((ch) => !!ch).map(renderBlock)}
  </div>
)

export default ({ title, children, opened }) => (
  <div class={`mnm-sidepanel ${opened ? 'opened' : ''}`}>
    <div class="mnm-sidepanel__content">
      <div class="mnm-sidepanel__title">{title}</div>
      {renderContents(children)}
    </div>
  </div>
)
