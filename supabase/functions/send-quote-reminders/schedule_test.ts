import { assertEquals } from 'jsr:@std/assert@1'
import { reminderDue } from './schedule.ts'

Deno.test('first reminder when pickup is more than 3 days away', () => {
  assertEquals(reminderDue('2026-10-13', '2026-10-20', new Set()), 'first')
})
Deno.test('first reminder is never resent', () => {
  assertEquals(reminderDue('2026-10-14', '2026-10-20', new Set(['first'])), null)
})
Deno.test('final reminder exactly 3 days before pickup', () => {
  assertEquals(reminderDue('2026-10-17', '2026-10-20', new Set(['first'])), 'final')
})
Deno.test('first contact within 3 days uses final template', () => {
  assertEquals(reminderDue('2026-10-18', '2026-10-20', new Set()), 'final')
})
Deno.test('final reminder is never resent', () => {
  assertEquals(reminderDue('2026-10-18', '2026-10-20', new Set(['first', 'final'])), null)
})
Deno.test('no reminder after pickup date', () => {
  assertEquals(reminderDue('2026-10-21', '2026-10-20', new Set()), null)
})
