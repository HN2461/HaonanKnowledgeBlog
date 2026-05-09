let bookmarksIndexState = {
  value: null,
  promise: null
}

async function loadJson(url) {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`bookmark index request failed: ${response.status}`)
  }

  return response.json()
}

export async function loadBookmarksIndex() {
  if (bookmarksIndexState.value) {
    return bookmarksIndexState.value
  }

  if (!bookmarksIndexState.promise) {
    bookmarksIndexState.promise = loadJson(`${import.meta.env.BASE_URL}bookmarks-index.json`)
      .then((data) => {
        bookmarksIndexState.value = data
        return data
      })
      .catch((error) => {
        bookmarksIndexState.promise = null
        throw error
      })
  }

  return bookmarksIndexState.promise
}
