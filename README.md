# 🔐 Tinystate: A Lightweight State Management Library with Persistence & Middleware

**Tinystate** is a lightweight state management library written in TypeScript, offering:

✅ **Global State Management**
✅ **Automatic Persistence** (IndexedDB for Web, AsyncStorage for React Native)
✅ **AES-256 Encryption** using `crypto-js`
✅ **Middleware Support** for logging, validation, and more
✅ **Minimal Dependencies** & Blazing Fast Performance

---

## 🚀 Installation

```sh
npm install tinystate
```

or

```sh
yarn add tinystate
```

---

## 🛠️ Usage

### **1️⃣ Create a Simple Store**
```typescript
import { createStore } from "tinystate";

const counter = createStore(0, "counter-key");

counter.subscribe(value => console.log("Counter Updated:", value));

counter.set(5);  // Updates state & persists it
counter.update(n => n + 1); // Increments state
```

---

### **2️⃣ Persistent User Store (Encrypted)**
```typescript
const userStore = createStore({ name: "Alice", age: 25 }, "user-store");

userStore.subscribe(user => console.log("User State:", user));

userStore.set({ name: "Bob", age: 30 }); // Stores encrypted user data
```

---

## 🔐 Middleware Support
Middleware functions allow you to **modify, log, or validate state changes** before they are applied.

### **Adding Middleware**
```typescript
import { createStore, Middleware } from "tinystate";

const logger: Middleware<number> = (state, next) => {
  console.log("Previous State:", state);
  next(state);
  console.log("New State:", state);
};

const preventNegative: Middleware<number> = (state, next) => {
  if (state < 0) {
    console.warn("Negative values not allowed!");
    return;
  }
  next(state);
};

const counter = createStore(0, "counter-key", [logger, preventNegative]);
```

---

## 🔒 Encryption & Persistence
This library **encrypts** state before saving it using **AES-256-CBC** with `crypto-js`.

- **Web:** Uses IndexedDB for persistence.
- **React Native:** Uses AsyncStorage.

### **How it Works**
1. **State updates** trigger `encryptData()` before saving.
2. **Data is stored in IndexedDB (Web) or AsyncStorage (React Native).**
3. **When restoring, `decryptData()` decrypts the stored value.**

---

## 📜 API Reference

### `createStore<T>(initialState: T, storageKey?: string, middlewares?: Middleware<T>[])`
Creates a new store with optional persistence and middleware support.

#### Parameters:
- `initialState: T` - The initial state of the store.
- `storageKey?: string` - Optional key for persistence.
- `middlewares?: Middleware<T>[]` - Optional array of middleware functions.

#### Methods:
- **`get(): T`** - Returns the current state.
- **`set(newState: T): Promise<void>`** - Updates the state.
- **`update(updater: (state: T) => T): Promise<void>`** - Updates the state using a function.
- **`subscribe(callback: (state: T) => void): () => void`** - Subscribes to state changes.
- **`use(middleware: Middleware<T>): void`** - Adds a middleware function.

---

## 📌 Why Use EncryptedStore?
✅ **Fast & Lightweight** (Minimal dependencies)
✅ **Cross-Platform** (Works on Web & React Native)
✅ **Automatic Persistence** (IndexedDB / AsyncStorage)
✅ **AES-256 Encryption** for secure data storage
✅ **Middleware Support** for enhanced control
✅ **Simple API** for ease of use

---

## 📜 License
This project is licensed under the **MIT License**.

---

## 🙌 Contributing
We welcome contributions! Feel free to open an issue or submit a pull request.

---

## ⭐ Support
If you like this project, give it a ⭐ on GitHub!

