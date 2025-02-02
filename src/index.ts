import { saveToStorage, loadFromStorage } from './storage.js'

export type Middleware<T> = (state: T, next: (newState: T) => void) => void

export class Store<T> {
  private state: T
  private subscribers: Set<(state: T) => void> = new Set()
  private middlewares: Middleware<T>[] = []
  private storageKey?: string

  constructor(
    initialState: T,
    storageKey?: string,
    middlewares: Middleware<T>[] = []
  ) {
    this.storageKey = storageKey
    this.middlewares = middlewares
    this.state = initialState

    if (storageKey) {
      this.restoreState()
    }
  }

  get(): T {
    return this.state
  }

  async set(newState: T): Promise<void> {
    const applyMiddleware = (index: number, updatedState: T) => {
      if (index < this.middlewares.length) {
        this.middlewares[index](updatedState, (nextState) =>
          applyMiddleware(index + 1, nextState)
        )
      } else {
        this.finalizeStateUpdate(updatedState)
      }
    }

    applyMiddleware(0, newState)
  }

  async update(updater: (state: T) => T): Promise<void> {
    await this.set(updater(this.state))
  }

  subscribe(subscriber: (state: T) => void): () => void {
    this.subscribers.add(subscriber)
    subscriber(this.state)
    return () => {
      this.subscribers.delete(subscriber)
    }
  }

  use(middleware: Middleware<T>): void {
    this.middlewares.push(middleware)
  }

  private async finalizeStateUpdate(newState: T): Promise<void> {
    this.state = newState
    this.notify()
    if (this.storageKey) {
      await saveToStorage(this.storageKey, JSON.stringify(newState))
    }
  }

  private notify(): void {
    this.subscribers.forEach((subscriber) => subscriber(this.state))
  }

  private async restoreState(): Promise<void> {
    if (this.storageKey) {
      const savedData = await loadFromStorage<string>(this.storageKey)
      if (savedData) {
        this.state = JSON.parse(savedData)
        this.notify()
      }
    }
  }
}

export function createStore<T>(
  initialState: T,
  storageKey?: string,
  middlewares: Middleware<T>[] = []
): Store<T> {
  return new Store(initialState, storageKey, middlewares)
}
