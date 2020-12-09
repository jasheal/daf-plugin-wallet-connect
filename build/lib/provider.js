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
import React, { useState, createContext, useEffect, useContext } from 'react'
import WalletConnect from '@walletconnect/client'
import { loadSessions, deleteSession } from './sessionStorage'
import EventHub from './emitter'
import EVENTS from './events'
export const WalletConnectContext = createContext({})
export const WalletConnectProvider = (props) => {
  const [connectors, updateConnectors] = useState([])
  const [pending, updatePending] = useState([])
  const [requests, updateRequests] = useState([])
  const [peerId, updatePeerId] = useState()
  const [subscribed, updateSubscribed] = useState([])
  const agent = props.agent
  const getOptions = agent.context.walletConnect.getOptions
  useEffect(() => {
    walletConnectInit()
  }, [])
  useEffect(() => {
    if (connectors.length > 0) {
      connectors.forEach((connector) => {
        if (!subscribed.includes(connector.peerId)) {
          // debug(`Subscribing to events for peerId ${connector.peerId}`)
          walletConnectSubscribeToEvents(connector.peerId)
        } else {
          // debug(`Already subscribed to events from peerId ${connector.peerId}`)
        }
      })
    }
  }, [connectors])
  const walletConnectInit = () =>
    __awaiter(void 0, void 0, void 0, function* () {
      try {
        const sessions = yield loadSessions()
        const _connectors = yield Promise.all(
          Object.values(sessions).map((session) =>
            __awaiter(void 0, void 0, void 0, function* () {
              const options = yield getOptions()
              return new WalletConnect({
                session,
                clientMeta: options.clientMeta,
              })
            }),
          ),
        )
        updateConnectors(_connectors)
      } catch (error) {
        // console.error()
      }
    })
  const walletConnectOnSessionRequest = (uri) =>
    __awaiter(void 0, void 0, void 0, function* () {
      // debug('onSessionRequest')
      const nativeOptions = yield getOptions()
      const connector = new WalletConnect({ uri }, nativeOptions)
      connector.on(EVENTS.SESSION_REQUEST, (error, payload) => {
        // debug('Session requested')
        if (error) {
          // debug(error)
          throw error
        }
        const { peerId, peerMeta } = payload.params[0]
        const updatedPending = pending.concat([connector])
        updatePending(updatedPending)
        // Send everything to agent handler
        EventHub.emit(EVENTS.SESSION_REQUEST_AGENT, {
          peerId,
          peerMeta,
          payload,
        })
      })
    })
  const walletConnectSubscribeToEvents = (peerId) =>
    __awaiter(void 0, void 0, void 0, function* () {
      const connector = connectors.filter(
        (connector) => connector.peerId === peerId,
      )[0]
      connector.on(EVENTS.CALL_REQUEST, (error, payload) => {
        if (error) {
          throw error
        }
        const updatedconnector = connectors.filter(
          (connector) => connector.peerId === peerId,
        )[0]
        let updatedRequests = requests.concat([
          {
            connector: updatedconnector,
            payload: payload,
          },
        ])
        updateRequests(updatedRequests)
        EventHub.emit(EVENTS.CALL_REQUEST_AGENT, {
          peerId,
          payload,
          peerMeta: connector.peerMeta,
        })
      })
      connector.on(EVENTS.DISCONNECT, (error) => {
        if (error) {
          throw error
        }
        const updatedConnectors = connectors.filter((connector) => {
          if (connector.peerId === peerId) {
            deleteSession(connector.session)
            return false
          }
          return true
        })
        updateConnectors(updatedConnectors)
        EventHub.emit(EVENTS.DISCONNECT_AGENT)
      })
      const _subscribed = [...subscribed]
      _subscribed.push(peerId)
      console.log('Updating subscribed...')
      updateSubscribed(_subscribed)
      updatePeerId(null)
    })
  const walletConnectApproveCallRequest = (peerId, response) =>
    __awaiter(void 0, void 0, void 0, function* () {
      const connector = connectors.filter(
        (connector) => connector.peerId === peerId,
      )[0]
      yield connector.approveRequest(response)
      const updatedRequests = requests.filter(
        (request) => request.payload.id !== response.id,
      )
      updateRequests(updatedRequests)
    })
  const walletConnectRejectCallRequest = (peerId, response) =>
    __awaiter(void 0, void 0, void 0, function* () {
      const request = requests.filter(
        (request) => request.connector.peerId === peerId,
      )[0]
      yield request.connector.rejectRequest(response)
      const updatedRequests = requests.filter((request) => {
        return request.payload.id !== response.id
      })
      updateRequests(updatedRequests)
    })
  const state = {
    connectors,
    requests,
    pending,
  }
  return (
    <WalletConnectContext.Provider
      value={{
        state,
        walletConnectOnSessionRequest,
        walletConnectApproveCallRequest,
        walletConnectRejectCallRequest,
      }}
    >
      {props.children}
    </WalletConnectContext.Provider>
  )
}
export const useWalletConnect = () => useContext(WalletConnectContext)
// // Move to props so this can be configured
// const getOptions = async () => {
//   // Wait for push token
//   const options = {
//     clientMeta: {
//       description: 'WalletConnect Demo App',
//       url: 'https://walletconnect.org',
//       icons: ['https://walletconnect.org/walletconnect-logo.png'],
//       name: 'WalletConnect',
//       ssl: true,
//     },
//     // push: {
//     //   url: 'https://push.walletconnect.org',
//     //   type: 'fcm',
//     //   token: '',
//     //   peerMeta: true,
//     // },
//   }
//   return options
// }
//# sourceMappingURL=provider.js.map
