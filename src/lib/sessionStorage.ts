import { asyncStorageSave, asyncStorageLoad } from './asyncStorage'
import { IWalletConnectSession } from '@walletconnect/types'

const asyncStorageId: string = 'walletConnect'

interface IWalletConnectSessionDict {
  [peerId: string]: IWalletConnectSession
}

export async function saveSession(session: IWalletConnectSession) {
  let sessions: IWalletConnectSessionDict = {}
  const prevSessions = await asyncStorageLoad(asyncStorageId)
  if (prevSessions) {
    sessions = { ...prevSessions }
  }
  sessions[session.peerId] = session
  await asyncStorageSave(asyncStorageId, sessions)
  return true
}

export async function loadSessions() {
  const sessions: IWalletConnectSessionDict = await asyncStorageLoad(
    asyncStorageId,
  )
  return sessions
}

export async function deleteSession(session: IWalletConnectSession) {
  const sessions = await asyncStorageLoad(asyncStorageId)
  if (sessions) {
    if (sessions[session.peerId]) {
      delete sessions[session.peerId]
    }
  }
  await asyncStorageSave(asyncStorageId, sessions)
  return true
}
