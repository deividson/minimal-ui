import actions from '../actions/cellListActions'

const getCell = (cells, elemId) => cells.find((cell) => cell.elemId === elemId)

const applyStatusToAll = (cells, isSelected) => (
  cells.map(cll => ({
    ...cll,
    isSelected,
  }))
)

const createCell = (elemId, isSelected) => ({
  elemId,
  isSelected,
})

export default (state, action) => {
  const { elemId } = action.payload

  let { cell, cells, general, resultGeneral, resultCell, cellOriginalStatus } = {}

  if (elemId) {
    cell = getCell(state.cellsSelection, elemId)
    cells = []
    general = state.cellGeneral

    resultGeneral = general.isSelected
    cellOriginalStatus = cell ? cell.isSelected : general.isSelected
  }

  const actionInfo = {
    action: action.type,
  }

  switch (action.type) {
    case actions.CLICK_CELL:
      resultCell = true
      resultGeneral = cellOriginalStatus ? !resultGeneral : false

      // aplicando resultados
      general.isSelected = resultGeneral
      cells = applyStatusToAll(state.cellsSelection, resultGeneral)
      if (!cell) {
        cells.push(createCell(elemId, resultCell))
      } else {
        const ncell = getCell(cells, elemId)
        ncell.isSelected = resultCell
      }

      return {
        ...state,
        ...actionInfo,
        cellGeneral: general,
        cellsSelection: cells,
      }
    case actions.CLICK_ADITIONAL_CELL:
      resultCell = !cellOriginalStatus
      cells = state.cellsSelection.map((cll) => cll)
      if (!cell) {
        cells.push(createCell(elemId, resultCell))
      } else {
        const ncell = getCell(cells, elemId)
        ncell.isSelected = resultCell
      }

      return {
        ...state,
        ...actionInfo,
        cellsSelection: cells,
      }
    default:
      return state
  }
}
