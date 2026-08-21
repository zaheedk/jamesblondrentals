import { assertEquals } from 'https://deno.land/std@0.208.0/assert/mod.ts'
import { getAirwallexEnv, normaliseIntentStatus } from './airwallex.ts'

Deno.test('normaliseIntentStatus maps Airwallex statuses to app statuses', () => {
  assertEquals(normaliseIntentStatus('SUCCEEDED'), 'Approved')
  assertEquals(normaliseIntentStatus('CAPTURED'), 'Approved')
  assertEquals(normaliseIntentStatus('FAILED'), 'Failed')
  assertEquals(normaliseIntentStatus('CANCELLED'), 'Failed')
  assertEquals(normaliseIntentStatus('EXPIRED'), 'Failed')
  assertEquals(normaliseIntentStatus('PENDING'), 'Pending')
  assertEquals(normaliseIntentStatus('REQUIRES_ACTION'), 'Pending')
  assertEquals(normaliseIntentStatus(undefined), 'Unknown')
  assertEquals(normaliseIntentStatus('UNKNOWN_STATUS'), 'Unknown')
})

Deno.test('getAirwallexEnv defaults to demo when env is empty', () => {
  Deno.env.delete('AIRWALLEX_ENV')
  const env = getAirwallexEnv()
  assertEquals(env.isDemo, true)
  assertEquals(env.apiBase, 'https://api-demo.airwallex.com')
  assertEquals(env.checkoutBase, 'https://checkout-demo.airwallex.com')
})

Deno.test('getAirwallexEnv uses live endpoints when set to live', () => {
  Deno.env.set('AIRWALLEX_ENV', 'live')
  const env = getAirwallexEnv()
  assertEquals(env.isDemo, false)
  assertEquals(env.apiBase, 'https://api.airwallex.com')
  assertEquals(env.checkoutBase, 'https://checkout.airwallex.com')
  Deno.env.delete('AIRWALLEX_ENV')
})
