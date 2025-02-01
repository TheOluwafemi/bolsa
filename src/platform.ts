export const isReactNative = (): boolean => {
  return (
    typeof global !== 'undefined' &&
    (global as any).navigator &&
    !(global as any).window && // Web has `window`, but React Native doesn't
    (global as any).__BUNDLE__ !== undefined // Exists in React Native
  )
}
