import { describe, expect, test } from 'vitest'
import { parseTourUrl, tourSearch } from './urlState'

const known = { 'villa-serena': ['living', 'kitchen'], 'skyline-12b': ['lounge'] }

describe('parseTourUrl', () => {
  test('reads a property and room from the query string', () => {
    expect(parseTourUrl('?property=villa-serena&room=kitchen', known)).toEqual({
      propertyId: 'villa-serena',
      roomId: 'kitchen',
    })
  })

  test('falls back to the first property when the id is unknown', () => {
    expect(parseTourUrl('?property=castle&room=kitchen', known)).toEqual({ propertyId: 'villa-serena', roomId: null })
  })

  test.each(['constructor', 'toString', '__proto__', 'hasOwnProperty'])('ignores the prototype key "%s"', (key) => {
    expect(parseTourUrl(`?property=${key}&room=x`, known)).toEqual({ propertyId: 'villa-serena', roomId: null })
  })

  test('drops a room that does not belong to the property', () => {
    expect(parseTourUrl('?property=skyline-12b&room=kitchen', known)).toEqual({ propertyId: 'skyline-12b', roomId: null })
  })
})

describe('tourSearch', () => {
  test('serialises property and room', () => {
    expect(tourSearch('villa-serena', 'kitchen')).toBe('?property=villa-serena&room=kitchen')
  })

  test('omits the room in overview', () => {
    expect(tourSearch('villa-serena', null)).toBe('?property=villa-serena')
  })
})
