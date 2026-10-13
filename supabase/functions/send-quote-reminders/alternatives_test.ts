import { assertEquals } from 'jsr:@std/assert@1'
import { pickAlternatives, findQuotedCar } from './alternatives.ts'

const car = (id: number, name: string, p: number, available = 1, type = 12) =>
  ({ vehiclecategoryid: id, vehiclecategorytypeid: type, vehiclecategory: name, totalrateafterdiscount: p, available })

const trucks = [
  car(1, '2 Ton Box', 300),
  car(2, '3 Ton Box 16m3', 400, 0),
  car(3, '3 Ton Box 20m3', 450),
  car(4, '4 Ton Box', 500),
]
const quoted = { typeId: '12', vehicleId: '2', vehicleName: '3 Ton Box 16m3', referencePrice: 400 }

Deno.test('bigger vehicles are offered first, nearest size up', () => {
  assertEquals(pickAlternatives(trucks, quoted).map((c) => c.vehiclecategoryid), [3, 4])
})
Deno.test('smaller vehicle offered only when no bigger one is available', () => {
  const t = [car(1, '2 Ton Box', 300), car(2, '3 Ton Box 16m3', 400, 0), car(4, '4 Ton Box', 500, 0)]
  assertEquals(pickAlternatives(t, quoted).map((c) => c.vehiclecategoryid), [1])
})
Deno.test('unavailable vehicles and other vehicle types are never offered', () => {
  const t = [car(2, '3 Ton Box 16m3', 400, 0), car(9, 'Premium SUV', 450, 1, 1)]
  assertEquals(pickAlternatives(t, quoted), [])
})
Deno.test('cargo vans and large vans are offered for each other', () => {
  const t = [car(37, 'Standard Cargo Van', 200, 0, 11), car(50, 'Jumbo Van', 260, 1, 24)]
  const q = { typeId: '11', vehicleId: '37', vehicleName: 'Standard Cargo Van', referencePrice: 200 }
  assertEquals(pickAlternatives(t, q).map((c) => c.vehiclecategoryid), [50])
})
Deno.test('quoted vehicle found by name when id differs', () => {
  assertEquals(findQuotedCar(trucks, '999', '3 ton box  16m3')?.vehiclecategoryid, 2)
})
