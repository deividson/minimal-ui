import {
  openDB, deleteDB, wrap, unwrap,
} from 'idb'

const DB_CONFIG = {}

DB_CONFIG.STORE = {
  PAGES: 'pages',
}

DB_CONFIG.KEYS = {
  [DB_CONFIG.STORE.PAGES]: 'page',
}

DB_CONFIG.STORE_INDEXES = {
  [DB_CONFIG.STORE.PAGES]: [],
}

const MODES = {
  READ_ONLY: 'readonly',
  READ_WRITE: 'readwrite',
}

let dbPromise
let db

const dbOnError = (event) => {
  console.log('[IDB::ERROR]', event)
}

const initDB = (name = 'database', level = 1, configs = {}) => {
  Object.keys(configs).forEach((config) => {
    DB_CONFIG[config] = {
      ...DB_CONFIG[config],
      ...configs[config],
    }
  })

  dbPromise = openDB(name, level, {
    upgrade: (upgradeDb, oldV, newV) => {
      console.log(`[IDB::UPGRADE] ${name} ${level}`)

      Object.keys(DB_CONFIG.STORE).forEach((sKey) => {
        const storeName = DB_CONFIG.STORE[sKey]

        if (!upgradeDb.objectStoreNames.contains(storeName)) {
          const appsStore = upgradeDb.createObjectStore(storeName, { keyPath: DB_CONFIG.KEYS[storeName] })
          DB_CONFIG.STORE_INDEXES[storeName].forEach((keyName) => {
            appsStore.createIndex(keyName, keyName, { unique: false })
          })
        }
      })
    },
  })
  return dbPromise.then((_db) => (db = _db))
}

const getObjectStore = (name, mode, _db = db) => {
  if (!_db) {
    return null
  }
  const tx = _db.transaction(name, mode)
  return tx.objectStore(name)
}

const updateOrAddObject = (objStore, key, data) => new Promise(async (resolve) => {
  const obj = await objStore.get(key)
  if (obj) {
    objStore.put(data)
  } else {
    objStore.add(data)
  }
  resolve(true)
})

const waitDB = async () => dbPromise

const update = (storeName, name, state) => new Promise(async (resolve) => {
  if (!name || !state) {
    resolve({})
    return
  }
  await dbPromise

  const store = getObjectStore(storeName, MODES.READ_WRITE)
  updateOrAddObject(store, name, state)
})

const get = async (storeName, name) => dbPromise.then(async (db) => {
  const store = getObjectStore(storeName, MODES.READ_ONLY)
  return await store.get(name)
})

const getPageData = (name) => get(DB_CONFIG.STORE.PAGES, name)

const updatePageData = (name, state) => update(DB_CONFIG.STORE.PAGES, name, {
  ...state,
  page: name,
})

export {
  initDB,
  waitDB,
  MODES,
  getObjectStore,
  updateOrAddObject,
  getPageData,
  updatePageData,
  get,
  update,
}
