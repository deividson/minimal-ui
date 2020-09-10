import {
  openDB, deleteDB, wrap, unwrap,
} from 'idb'

// import PROJECTS from './projects'

const PROJECTS = {}

const STORE = {
  APPLICATION_COMPONENTS: 'applicationComponents',
  APPLICATIONS: 'applications',
  PROJECTS: 'projects',
  PAGES: 'pages',
}

const KEYS = {
  [STORE.APPLICATIONS]: 'url_slug',
  [STORE.APPLICATION_COMPONENTS]: 'app_slug',
  [STORE.PROJECTS]: 'name',
  [STORE.PAGES]: 'page',
}

const STORE_INDEXES = {
  [STORE.APPLICATIONS]: ['project', 'env_id', 'tenant'],
  [STORE.APPLICATION_COMPONENTS]: [],
  [STORE.PROJECTS]: [],
  [STORE.PAGES]: [],
}

const MODES = {
  READ_ONLY: 'readonly',
  READ_WRITE: 'readwrite',
}

let dbPromise
let db

const dbOnError = () => {
  console.log('[db::error]', event)
}

const initDB = () => {
  dbPromise = openDB('fwksdevtools', 3, {
    upgrade: (upgradeDb, oldV, newV) => {
      console.log('fwks devtools upgrade')

      Object.keys(STORE).forEach((sKey) => {
        const storeName = STORE[sKey]

        if (!upgradeDb.objectStoreNames.contains(storeName)) {
          const appsStore = upgradeDb.createObjectStore(storeName, { keyPath: KEYS[storeName] })
          STORE_INDEXES[storeName].forEach((keyName) => {
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
    return
  }
  const tx = _db.transaction(name, mode)
  return tx.objectStore(name)
}

// ============
const getProjectNameByUrlSlug = (slug) => (PROJECTS.find((proj) => slug.startsWith(proj.prefixApp)) || {}).name

const updateOrAddObject = (objStore, key, data) => new Promise(async (resolve) => {
  const obj = await objStore.get(key)
  if (obj) {
    objStore.put(data)
  } else {
    objStore.add(data)
  }
  resolve(true)
})

const updateApplicationComponent = (applicationAndComponents) => new Promise(async (resolve) => {
  // console.log('updateApplicationComponent inicio', applicationAndComponents)

  if (!applicationAndComponents) {
    resolve({})
    return
  }
  await dbPromise

  const app = applicationAndComponents.application

  const application = {
    ...app,
    project: getProjectNameByUrlSlug(app.url_slug),
  }
  // console.log('updateApplicationComponent traduziu projeto', application)

  const componentsObject = {
    app_slug: app.url_slug,
    components: applicationAndComponents.components,
  }

  const appStore = getObjectStore(STORE.APPLICATIONS, MODES.READ_WRITE)
  updateOrAddObject(appStore, application.url_slug, application)

  const componentsStore = getObjectStore(STORE.APPLICATION_COMPONENTS, MODES.READ_WRITE)
  updateOrAddObject(componentsStore, application.url_slug, componentsObject)
})

const getApplicationComponent = async (appSlug) => dbPromise.then(async (db) => {
  // console.log('[DB::getApplicationComponent]', db)

  const appStore = getObjectStore(STORE.APPLICATIONS, MODES.READ_ONLY)
  const app = await appStore.get(appSlug)

  const componentsStore = getObjectStore(STORE.APPLICATION_COMPONENTS, MODES.READ_ONLY)
  const comps = await componentsStore.get(appSlug)

  const appComps = {
    application: app,
    components: (comps || {}).components,
  }
  return appComps
})

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

const getPageData = (name) => get(STORE.PAGES, name)
const getProject = (name) => get(STORE.PROJECTS, name)

const updatePageData = (name, state) => update(STORE.PAGES, name, {
  ...state,
  page: name,
})
const updateProject = (name, state) => update(STORE.PROJECTS, name, state)

const funciona = () => {console.log('dsadsadasdsadsadsa'); window.utilsTeste = 'funciona';}


export {
  initDB,
  getApplicationComponent,
  updateApplicationComponent,
  getProject,
  updateProject,
  getPageData,
  updatePageData,
  funciona,
}
