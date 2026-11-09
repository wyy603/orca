import { describe, expect, it } from 'vitest'
import { acpLaunchSpecFor } from '../acp/launch/acp-launch-registry'
import { acpLaunchPermissionModes } from '../acp/launch/acp-launch-permission-modes'
import { agentChatPermissionModes } from '../../shared/agent-launch/permissions/agent-chat-permission-support'
import { DSH_LAUNCH_SPEC } from './dsh-acp-launch-spec'

describe('DeepSeek Harness ACP chat', () => {
  it('registers the ACP profile as the dsh chat server', () => {
    expect(acpLaunchSpecFor('dsh')).toBe(DSH_LAUNCH_SPEC)
    expect(DSH_LAUNCH_SPEC.command).toBe('dsh')
    expect(DSH_LAUNCH_SPEC.args({ fullAccess: false, pluginDir: null })).toEqual([
      '--profile',
      'acp'
    ])
    expect(DSH_LAUNCH_SPEC.args({ fullAccess: true, pluginDir: null })).toEqual([
      '--profile',
      'acp'
    ])
  })

  it('binds the chat to DSH_HOME and launches no managed runtime', () => {
    expect(DSH_LAUNCH_SPEC.account.pin).toEqual({ accountHomeVariable: 'DSH_HOME' })
    expect(DSH_LAUNCH_SPEC.managedRuntime).toBeUndefined()
    expect(DSH_LAUNCH_SPEC.hostBackend).toBeUndefined()
  })

  it('offers the ACP permission modes without mapping agent modes it does not have', () => {
    expect(agentChatPermissionModes('dsh')).toEqual({ modes: ['ask', 'full-access'] })
    expect(acpLaunchPermissionModes(DSH_LAUNCH_SPEC, false)).toBeUndefined()
  })
})
