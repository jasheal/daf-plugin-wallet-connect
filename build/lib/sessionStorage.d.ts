import { IWalletConnectSession } from '@walletconnect/types'
interface IWalletConnectSessionDict {
  [peerId: string]: IWalletConnectSession
}
export declare function saveSession(
  session: IWalletConnectSession,
): Promise<boolean>
export declare function loadSessions(): Promise<IWalletConnectSessionDict>
export declare function deleteSession(
  session: IWalletConnectSession,
): Promise<boolean>
export {}
//# sourceMappingURL=sessionStorage.d.ts.map
