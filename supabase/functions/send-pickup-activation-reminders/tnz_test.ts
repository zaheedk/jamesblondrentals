import { assert, assertEquals, assertRejects } from 'jsr:@std/assert@1'
import { pickupSms, sendTnzSms } from './tnz.ts'

Deno.test('pick-up text leads with the brand on its own line and offers assistance', () => {
  const message = pickupSms('Zaheed', '09:00')
  assertEquals(message.split('\n')[0], 'James Blond Rentals')
  assert(message.startsWith('James Blond Rentals\nHi Zaheed,'))
  assert(message.includes('if you need assistance'))
  assert(!message.includes('if you need help'))
  assert(!message.includes('('), 'message must not contain the date')
})

Deno.test('TNZ sends to NZ mobile using assigned short code and records MessageID', async () => {
  const fetcher: typeof fetch = async (input, init) => {
    assertEquals(input, 'https://api.tnz.co.nz/api/v3.00/sms')
    const requestInit = init as { method?: string; body?: unknown } | undefined
    assertEquals(requestInit?.method, 'POST')
    const payload = JSON.parse(String(requestInit?.body))
    assertEquals(payload.Destination, '+64275353037')
    assertEquals(payload.FromNumber, undefined)
    return new Response(JSON.stringify({ MessageID: 'message-123' }), { status: 200 })
  }
  assertEquals(await sendTnzSms('test-only', '+64275353037', 'reminder', fetcher), 'message-123')
})

Deno.test('TNZ rejects landlines without sending', async () => {
  let calls = 0
  const fetcher: typeof fetch = async () => { calls++; return new Response('{}') }
  await assertRejects(() => sendTnzSms('test-only', '+6498281234', 'reminder', fetcher))
  assertEquals(calls, 0)
})

Deno.test('TNZ failed submissions do not count as sent', async () => {
  const fetcher: typeof fetch = async () => new Response(JSON.stringify({ Result: 'Failed' }), { status: 200 })
  await assertRejects(() => sendTnzSms('test-only', '+64275353037', 'reminder', fetcher))
})

Deno.test('TNZ HTTP rejection does not expose provider body', async () => {
  const fetcher: typeof fetch = async () => new Response('sensitive provider data', { status: 401 })
  await assertRejects(() => sendTnzSms('test-only', '+64275353037', 'reminder', fetcher), Error,
    'TNZ text submission failed [401]; check TNZ account settings')
})