const ICONS_CODES = {
  RELOAD: String.fromCodePoint('10227'),
  SYNC: String.fromCharCode('8645'),
  ACT: String.fromCharCode('9889'),
  SEARCH: String.fromCharCode('8981'),
  SUCCESS_FUN: String.fromCodePoint('128526'),
  MONOCLE: String.fromCodePoint('129488'),
  INFO: String.fromCharCode('8505'),
}

const PAGE_STATUS = {
  READY: {
    name: 'ready',
    description: 'Ready',
    icon: ICONS_CODES.SUCCESS_FUN,
    classes: '',
  },
  SEARCHING: {
    name: 'searching',
    description: 'Searching',
    icon: ICONS_CODES.MONOCLE,
    classes: '',
  },
  LOADING: {
    name: 'loading',
    description: 'Carregando',
    icon: ICONS_CODES.RELOAD,
    classes: 'rotate highlight',
  },
}

const ACT_STATUS = {
  NONE: 0,
  RUNNING: 1,
  FINISHED: 2,
}

const CELL_STATUS = {
  NONE: 0,
  SELECTED: 1,
  DISABLED: 2,
}

export {
  ICONS_CODES,
  PAGE_STATUS,
  ACT_STATUS,
  CELL_STATUS,
}
