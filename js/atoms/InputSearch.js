import { h, Fragment } from 'preact'

const onSearchCreateRef = (ref) => {
  if (ref) {
    setTimeout(() => {
      ref.focus()
    }, 10)
  }
}

const InputSearch = ({ onInputSearch, componentListOptions }) => (
  <Fragment>
    <input
      type="text"
      onInput={onInputSearch}
      class="mapInputSearch"
      list="componentsOptions"
      ref={(r) => { r && onSearchCreateRef(r) }}
    />
    <datalist class="search-datalist" id="componentsOptions">
      {componentListOptions &&
        componentListOptions.map(name => <option key={name} value={name} />)}
    </datalist>
  </Fragment>
)

export default InputSearch
