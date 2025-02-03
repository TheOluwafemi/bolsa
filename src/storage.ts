const DB_NAME = 'bolsa_db'
const STORE_NAME = 'state_store'

// Native Storage (AsyncStorage)
let AsyncStorage: any

export const getPlatform = (): string => {
  try {
    // Dynamically require react-native only if available
    const Platform = require('react-native').Platform
    return Platform.OS
  } catch (error) {
    return typeof window !== 'undefined' ? 'web' : 'node'
  }
}
  
;(() => {
  const platform = getPlatform()
  if (platform === 'android' || platform === 'ios') {
    AsyncStorage = require('@react-native-async-storage/async-storage').default
  }
})()

// open indexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)

    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME)
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

// save to storage depending on platform
export async function saveToStorage<T>(key: string, value: T): Promise<void> {
  const data = JSON.stringify(value)
  const platform = getPlatform()

  if (platform === 'web') {
    const db = await openDB()
    const transaction = db.transaction(STORE_NAME, 'readwrite')
    transaction.objectStore(STORE_NAME).put(value, key)
  } else {
    AsyncStorage.setItem(key, data)
  }
}

// load from storage depending on platform
export async function loadFromStorage<T>(key: string): Promise<T | null> {
  const platform = getPlatform()

  if (platform === 'web') {
    const db = await openDB()
    const transaction = db.transaction(STORE_NAME, 'readonly')
    const request = transaction.objectStore(STORE_NAME).get(key)

    return new Promise(async (resolve, reject) => {
      request.onsuccess = () =>
        resolve(request.result ? request.result : null)
      request.onerror = () => reject(request.error)
    })
  } else {
    const data = await AsyncStorage.getItem(key)
    return data ? JSON.parse(data) : null
  }
}
