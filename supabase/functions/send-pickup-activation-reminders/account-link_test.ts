import { assertEquals, assertRejects } from 'jsr:@std/assert@1'
import { LOGIN_URL, pickupAccountLink } from './account-link.ts'
import { pickupSms } from './tnz.ts'

Deno.test('unactivated customer receives generated activation link reused for email and SMS', async () => {
  let generated = 0
  const resolve = pickupAccountLink(false, async () => {
    generated++
    return 'https://auth.example.test/verify?token=test-only&type=recovery'
  })
  assertEquals(await resolve(), 'https://auth.example.test/verify?token=test-only&type=recovery')
  const smsUrl = pickupSms('Zaheed', '09:00', await resolve()).match(/https:\/\/\S+/)?.[0]
  assertEquals(smsUrl, 'https://auth.example.test/verify?token=test-only&type=recovery')
  assertEquals(await resolve(), 'https://auth.example.test/verify?token=test-only&type=recovery')
  assertEquals(generated, 1)
})

Deno.test('activated customer receives login URL without generating activation credentials', async () => {
  let generated = 0
  const resolve = pickupAccountLink(true, async () => { generated++; return 'wrong-link' })
  assertEquals(await resolve(), LOGIN_URL)
  assertEquals(LOGIN_URL, 'https://www.jamesblond.co.nz/login')
  assertEquals(generated, 0)
})

Deno.test('failed activation generation does not silently send an unactivated customer to login', async () => {
  const resolve = pickupAccountLink(false, async () => undefined)
  await assertRejects(resolve, Error, 'Could not create account activation link')
})