import { IAgentPlugin } from 'daf-core'
import { IWalletConnectPlugin, IContext } from '../types/IMyAgentPlugin'
/**
 * {@inheritDoc IMyAgentPlugin}
 * @beta
 */
export declare class WalletConnector implements IAgentPlugin {
  readonly schema: any
  readonly eventTypes: string[]
  readonly methods: IWalletConnectPlugin
  onEvent(
    event: {
      type: string
      data: any
    },
    context: IContext,
  ): Promise<void>
  private onWalletConnectSessionInit
}
//# sourceMappingURL=daf-plugin-walletconnect.d.ts.map
