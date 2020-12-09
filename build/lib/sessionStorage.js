var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
import { asyncStorageSave, asyncStorageLoad } from './asyncStorage'
const asyncStorageId = 'walletConnect'
export function saveSession(session) {
  return __awaiter(this, void 0, void 0, function* () {
    let sessions = {}
    const prevSessions = yield asyncStorageLoad(asyncStorageId)
    if (prevSessions) {
      sessions = Object.assign({}, prevSessions)
    }
    sessions[session.peerId] = session
    yield asyncStorageSave(asyncStorageId, sessions)
    return true
  })
}
export function loadSessions() {
  return __awaiter(this, void 0, void 0, function* () {
    const sessions = yield asyncStorageLoad(asyncStorageId)
    return sessions
  })
}
export function deleteSession(session) {
  return __awaiter(this, void 0, void 0, function* () {
    const sessions = yield asyncStorageLoad(asyncStorageId)
    if (sessions) {
      if (sessions[session.peerId]) {
        delete sessions[session.peerId]
      }
    }
    yield asyncStorageSave(asyncStorageId, sessions)
    return true
  })
}
//# sourceMappingURL=sessionStorage.js.map
