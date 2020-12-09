import React, { useState, createContext, useEffect, useContext } from 'react'
import WalletConnect from '@walletconnect/client'
import {
  IWalletConnectProviderState,
  IWalletConnectRequest,
} from '../types/IWalletConnect'
import { loadSessions, saveSession, deleteSession } from './sessionStorage'
import EventHub from './emitter'
import EVENTS from './events'

export const WalletConnectContext = createContext<
  IWalletConnectProviderState | any
>({})

export const WalletConnectProvider = (props: any) => {
  const [connectors, updateConnectors] = useState<WalletConnect[]>([])
  const [pending, updatePending] = useState<WalletConnect[]>([])
  const [requests, updateRequests] = useState<IWalletConnectRequest[]>([])
  const [peerId, updatePeerId] = useState<string | null>()
  const [subscribed, updateSubscribed] = useState<string[]>([])

  const agent = props.agent
  const getOptions = agent.context.walletConnect.getOptions

  useEffect(() => {
    walletConnectInit()
  }, [])

  useEffect(() => {
    if (connectors.length > 0) {
      connectors.forEach((connector: any) => {
        if (!subscribed.includes(connector.peerId)) {
          // debug(`Subscribing to events for peerId ${connector.peerId}`)
          walletConnectSubscribeToEvents(connector.peerId)
        } else {
          // debug(`Already subscribed to events from peerId ${connector.peerId}`)
        }
      })
    }
  }, [connectors])

  const walletConnectInit = async () => {
    try {
      const sessions = await loadSessions()
      const _connectors = await Promise.all(
        Object.values(sessions).map(async (session) => {
          const options = await getOptions()
          return new WalletConnect({
            session,
            clientMeta: options.clientMeta,
          })
        }),
      )

      updateConnectors(_connectors)
    } catch (error) {
      // console.error()
    }
  }

  const walletConnectOnSessionRequest = async (uri: string) => {
    // debug('onSessionRequest')
    const nativeOptions = await getOptions()
    const connector = new WalletConnect({ uri }, nativeOptions)

    connector.on(EVENTS.SESSION_REQUEST, (error: any, payload: any) => {
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
  }

  const walletConnectSubscribeToEvents = async (peerId: string) => {
    const connector = connectors.filter(
      (connector: WalletConnect) => connector.peerId === peerId,
    )[0]

    connector.on(EVENTS.CALL_REQUEST, (error: any, payload: any) => {
      if (error) {
        throw error
      }

      const updatedconnector = connectors.filter(
        (connector: WalletConnect) => connector.peerId === peerId,
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

    connector.on(EVENTS.DISCONNECT, (error: any) => {
      if (error) {
        throw error
      }
      const updatedConnectors = connectors.filter(
        (connector: WalletConnect) => {
          if (connector.peerId === peerId) {
            deleteSession(connector.session)
            return false
          }
          return true
        },
      )

      updateConnectors(updatedConnectors)

      EventHub.emit(EVENTS.DISCONNECT_AGENT)
    })

    const _subscribed = [...subscribed]
    _subscribed.push(peerId)

    console.log('Updating subscribed...')
    updateSubscribed(_subscribed)

    updatePeerId(null)
  }

  const walletConnectApproveCallRequest = async (
    peerId: string,
    response: { id: number; result: any },
  ) => {
    const connector = connectors.filter(
      (connector: WalletConnect) => connector.peerId === peerId,
    )[0]

    await connector.approveRequest(response)

    const updatedRequests = requests.filter(
      (request: IWalletConnectRequest) => request.payload.id !== response.id,
    )

    updateRequests(updatedRequests)
  }

  const walletConnectRejectCallRequest = async (
    peerId: string,
    response: { id: number; error: { message: string } },
  ) => {
    const request = requests.filter(
      (request: IWalletConnectRequest) => request.connector.peerId === peerId,
    )[0]

    await request.connector.rejectRequest(response)

    const updatedRequests = requests.filter(
      (request: IWalletConnectRequest) => {
        return request.payload.id !== response.id
      },
    )

    updateRequests(updatedRequests)
  }

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
