let notesIndexPromise = null
let searchIndexPromise = null

async function loadJson(url) {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`index request failed: ${response.status}`)
  }

  return response.json()
}

async function loadSearchJsonWithFallback() {
  try {
    return await loadJson(`${import.meta.env.BASE_URL}search-index.json`)
  } catch (error) {
    return loadJson(`${import.meta.env.BASE_URL}notes-index.json`)
  }
}

function createCachedLoader(refName, path) {
  return async function loadCachedIndex() {
    if (refName.value) {
      return refName.value
    }

    if (!refName.promise) {
      refName.promise = loadJson(`${import.meta.env.BASE_URL}${path}`)
        .then((data) => {
          refName.value = data
          return data
        })
        .catch((error) => {
          refName.promise = null
          throw error
        })
    }

    return refName.promise
  }
}

const notesIndexState = {
  value: null,
  promise: notesIndexPromise
}

const searchIndexState = {
  value: null,
  promise: searchIndexPromise
}

export const loadNotesIndex = createCachedLoader(notesIndexState, 'notes-index.json')
export const loadSearchIndex = async function loadSearchIndex() {
  if (searchIndexState.value) {
    return searchIndexState.value
  }

  if (!searchIndexState.promise) {
    searchIndexState.promise = loadSearchJsonWithFallback()
      .then((data) => {
        searchIndexState.value = data
        return data
      })
      .catch((error) => {
        searchIndexState.promise = null
        throw error
      })
  }

  return searchIndexState.promise
}

export function preloadSearchIndex() {
  return loadSearchIndex().catch(() => null)
}
