import CryptoJS from 'crypto-js'

const SECRET_KEY = '0123456789abcdef0123456789abcdef' // Must be 32 bytes for AES-256
const IV_LENGTH = 16

// generate a random IV
function generateIV() {
  return CryptoJS.lib.WordArray.random(IV_LENGTH).toString(CryptoJS.enc.Hex)
}

// encrypt the data
export function encryptData(data: string): string {
  const iv = generateIV()
  const encrypted = CryptoJS.AES.encrypt(
    data,
    CryptoJS.enc.Utf8.parse(SECRET_KEY),
    {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  ).toString()

  return JSON.stringify({ iv, data: encrypted })
}

// Decrypt data
export function decryptData(encryptedData: string): string {
  const parsed = JSON.parse(encryptedData)
  const iv = CryptoJS.enc.Hex.parse(parsed.iv)
  const decrypted = CryptoJS.AES.decrypt(
    parsed.data,
    CryptoJS.enc.Utf8.parse(SECRET_KEY),
    {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  ).toString(CryptoJS.enc.Utf8)

  return decrypted
}
