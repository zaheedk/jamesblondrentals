import { assertEquals } from 'jsr:@std/assert@1'
import { toE164NZ } from './phone.ts'

Deno.test('local NZ mobile becomes +64', () => assertEquals(toE164NZ('0221693531'), '+64221693531'))
Deno.test('already international kept', () => assertEquals(toE164NZ('+64 21 251 5546'), '+64212515546'))
Deno.test('landline rejected for text', () => assertEquals(toE164NZ('098281234'), null))
Deno.test('empty rejected', () => assertEquals(toE164NZ(''), null))
