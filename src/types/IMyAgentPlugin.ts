import {
  IPluginMethodMap,
  IAgentContext,
  IIdentityManager,
  IResolver,
} from 'daf-core'

/**
 * Plugin context
 * @beta
 */
export type IContext = IAgentContext<IResolver & IIdentityManager>

/**
 * Arguments needed for myPluginFoo
 * @beta
 */
export interface IWalletConnectOnSessionInit {
  callback: (event: any) => void
}

/**
 * My Agent Plugin description
 * @beta
 */
export interface IWalletConnectPlugin extends IPluginMethodMap {
  /**
   * Method description
   *
   * @param args - Input parameters
   * @param context - Context
   */
  onWalletConnectSessionInit(
    args: IWalletConnectOnSessionInit,
    context: IContext,
  ): Promise<void>
}
