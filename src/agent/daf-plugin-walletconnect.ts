import { Agent, IAgentPlugin } from 'daf-core'
import {
  IWalletConnectPlugin,
  IWalletConnectOnSessionInit,
  IContext,
} from '../types/IMyAgentPlugin'
import { schema } from '../index'
import EventHub from '../lib/emitter'
import EVENTS from '../lib/events'

/**
 * {@inheritDoc IMyAgentPlugin}
 * @beta
 */
export class WalletConnector implements IAgentPlugin {
  readonly schema = schema.IMyAgentPlugin

  readonly eventTypes = ['validatedMessage']

  readonly methods: IWalletConnectPlugin = {
    onWalletConnectSessionInit: this.onWalletConnectSessionInit.bind(this),
  }

  public async onEvent(event: { type: string; data: any }, context: IContext) {
    console.log(event.data)
  }

  private async onWalletConnectSessionInit(
    args: IWalletConnectOnSessionInit,
    context: IContext,
  ): Promise<void> {
    EventHub.addListener(EVENTS.SESSION_REQUEST_AGENT, args.callback)
    console.log(context)
  }
}
