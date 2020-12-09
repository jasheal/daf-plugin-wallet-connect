import WalletConnect from '@walletconnect/client'
import { IJsonRpcRequest } from '@walletconnect/types'

export interface IWalletConnectRequest {
  connector: WalletConnect
  payload: IJsonRpcRequest
}

export interface IWalletConnectProviderState {
  loading: boolean
  connectors: WalletConnect[]
  pending: WalletConnect[]
  requests: IWalletConnectRequest[]
}
