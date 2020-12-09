import AsyncStorage from '@react-native-community/async-storage'

export async function asyncStorageSave(key: string, value: any) {
  const jsonValue = JSON.stringify(value)
  try {
    await AsyncStorage.setItem(key, jsonValue)
    console.log(`AsyncStorage: saved value for key: ${key}`)
  } catch (err) {
    console.log(
      `AsyncStorage: failed to save value for key: ${key} error: ${err}`,
    )
  }
}

export async function asyncStorageLoad(key: string) {
  try {
    const data = await AsyncStorage.getItem(key)
    if (data) {
      console.log(`AsyncStorage: loaded value for key: ${key}`)
      const jsonValue = JSON.parse(data)
      return jsonValue
    }
    console.log(`AsyncStorage: value does not exist for key: ${key}`)
  } catch (err) {
    console.log(
      `AsyncStorage: failed to load value for key: ${key} error: ${err}`,
    )
  }
  return null
}

export async function asyncStorageDelete(key: string) {
  try {
    await AsyncStorage.removeItem(key)
    console.log(`AsyncStorage: removed value for key: ${key}`)
  } catch (err) {
    console.log(
      `AsyncStorage: failed to remove value for key: ${key} error: ${err}`,
    )
  }
}
