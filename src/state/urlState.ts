export interface TourLocation {
  readonly propertyId: string
  readonly roomId: string | null
}

/** Maps each property id to its room ids; the first key is the default property. */
export type KnownRooms = Readonly<Record<string, readonly string[]>>

export const parseTourUrl = (search: string, known: KnownRooms): TourLocation => {
  const params = new URLSearchParams(search)
  const requested = params.get('property') ?? ''
  // Own keys only: `in` would accept prototype names such as "constructor" from a crafted link.
  const propertyId = Object.hasOwn(known, requested) ? requested : Object.keys(known)[0]
  const room = params.get('room')
  const roomId = room && requested === propertyId && known[propertyId].includes(room) ? room : null
  return { propertyId, roomId }
}

export const tourSearch = (propertyId: string, roomId: string | null): string => {
  const params = new URLSearchParams({ property: propertyId })
  if (roomId) params.set('room', roomId)
  return `?${params.toString()}`
}
