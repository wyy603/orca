import { join } from 'node:path'
import type { AcpLaunchSpec } from '../acp/launch/acp-launch-contract'
import { GENERIC_ACP_DIALECT } from '../acp/acp-dialects/acp-dialect'
import { directoryAccountBinding } from '../acp/launch/acp-account-binding'
import { agentSessionSignInFor } from '../../shared/agent-session/lifecycle/agent-session-sign-in'

// DeepSeek Harness serves the published ACP v1 surface from `dsh --profile acp`; it adds no
// private method or transport field. Its own `DSH_HOME` owns sessions, settings and credentials.
export const DSH_LAUNCH_SPEC: AcpLaunchSpec = {
  agent: 'dsh',
  command: 'dsh',
  args: () => ['--profile', 'acp'],
  env: {},
  dialect: GENERIC_ACP_DIALECT,
  loginCommand: agentSessionSignInFor('dsh')?.loginCommand ?? [],
  account: directoryAccountBinding('DSH_HOME', (homePath) => join(homePath, '.dsh')),
  installDirectories: ({ homePath }) => [join(homePath, '.local', 'bin')],
  // The ACP profile lists its models in a chat session's config options, not before one opens.
  modelDiscovery: {
    kind: 'unavailable',
    reason: 'DeepSeek Harness lists its models only inside a chat session'
  },
  transcriptImport: null,
  // Orca's Session History does not index DSH sessions yet, so a chat cannot adopt one.
  sessionHistory: {
    rowAgents: [],
    rowSessionId: (link) => link.handle.nativeId,
    parseResumeArgs: () => null
  }
}
