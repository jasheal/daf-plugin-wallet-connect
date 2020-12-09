import { Agent, IAgentPlugin } from 'daf-core'
import {
  IMyAgentPlugin,
  IMyAgentPluginFooArgs,
  IContext,
} from '../types/IMyAgentPlugin'
import { schema } from '../index'
import EventHub from '../lib/emitter'
import EVENTS from '../lib/events'

/**
 * {@inheritDoc IMyAgentPlugin}
 * @beta
 */
export class MyAgentPlugin implements IAgentPlugin {
  readonly schema = schema.IMyAgentPlugin

  readonly eventTypes = ['validatedMessage']

  readonly methods: IMyAgentPlugin = {
    walletConnect: this.walletConnect.bind(this),
    // onWalletConnectInit: this.onWalletConnectInit.bind(this)

    /**
    
    onWalletConnectConnect

    **/
  }

  public async onEvent(event: { type: string; data: any }, context: IContext) {
    console.log(event.data)
  }

  // private onWalletConnectInit(callback:(peerId:string, peerMeta:any, payload:any) => any) {
  //   EventHub.addListener(EVENTS.SESSION_REQUEST_AGENT, ({peerId, peerMeta, payload}) => {
  //     callback(peerId, peerMeta, payload)
  //   })
  // }

  /** {@inheritDoc IMyAgentPlugin.myPluginFoo} */
  private async walletConnect(
    args: IMyAgentPluginFooArgs,
    context: IContext,
  ): Promise<string> {
    const didDoc = await context.agent.resolveDid({ didUrl: args.did })
    console.log(didDoc)
    return args.bar
  }
}
