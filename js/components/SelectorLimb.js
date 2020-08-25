import { h, Fragment } from 'preact'
import { Map, Cell } from './Map'

const ConnectSelector = (ComposedComponent, options) => (
  (props) => {
    const { label, propToCheck, items } = options
    const { onSelect } = props
    console.log('===[selector]', props, options)


    const renderSelector = () => {
      
      const onClickCell = (cell, state) => {
        if (cell.name && onSelect) {
          onSelect(cell.name)
        }
        return null
      }

      return (
        <Map direction='horizontal'>
          <Cell name={label} level="1" onClick={(state) => onClickCell({ label, level: 1 }, state)}> 
            {items && items.map(item => (
              <Cell elemId={item.name} 
                name={item.label} level={2} 
                onClick={(state) => onClickCell({ name: item.name, label: item.label, level: 2 }, state)}
              />))}
          </Cell>
        </Map>
      )
    }
    
    const renderComposed = () => (<ComposedComponent {...props}/>)

    let propRequired = props[propToCheck]

    const renderFunc = !!propRequired ? renderComposed : renderSelector

    return (
      <Fragment>{renderFunc()}</Fragment>
    )
  }
)

export default ConnectSelector