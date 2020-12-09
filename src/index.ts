/**
 * @public
 */
const schema = require('../plugin.schema.json')
export { schema }
export { MyAgentPlugin } from './agent/daf-plugin-walletconnect'
export * from './types/IMyAgentPlugin'
export { WalletConnectProvider, useWalletConnect } from '../src/lib/provider'
