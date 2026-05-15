const getApiKey = () =>
  process.env.GOOGLE_MAPS_API_KEY ??
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ??
  ''

export type PropertyPhotoSource = 'places' | 'streetview' | 'staticmap' | null

export type PropertyPhotoResult = {
  url: string | null
  source: PropertyPhotoSource
}

function placePhotoUrl(photoReference: string, maxWidth = 800): string {
  const key = getApiKey()
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${encodeURIComponent(photoReference)}&key=${key}`
}

function streetViewUrl(lat: number, lng: number): string {
  const key = getApiKey()
  return `https://maps.googleapis.com/maps/api/streetview?size=800x600&location=${lat},${lng}&fov=80&key=${key}`
}

function staticMapUrl(lat: number, lng: number): string {
  const key = getApiKey()
  return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=17&size=800x600&maptype=satellite&markers=color:red%7C${lat},${lng}&key=${key}`
}

async function findPlacePhotoReference(
  lat: number,
  lng: number,
  address: string
): Promise<string | null> {
  const key = getApiKey()
  if (!key || !address.trim()) return null

  const params = new URLSearchParams({
    input: address.trim(),
    inputtype: 'textquery',
    fields: 'photos',
    locationbias: `point:${lat},${lng}`,
    key,
  })

  const res = await fetch(
    `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?${params}`
  )
  if (!res.ok) return null

  const data = (await res.json()) as {
    status?: string
    candidates?: { photos?: { photo_reference: string }[] }[]
  }

  if (data.status !== 'OK' || !data.candidates?.[0]?.photos?.[0]) {
    return null
  }

  return data.candidates[0].photos[0].photo_reference
}

async function hasStreetView(lat: number, lng: number): Promise<boolean> {
  const key = getApiKey()
  if (!key) return false

  const res = await fetch(
    `https://maps.googleapis.com/maps/api/streetview/metadata?location=${lat},${lng}&key=${key}`
  )
  if (!res.ok) return false

  const data = (await res.json()) as { status?: string }
  return data.status === 'OK'
}

/** Resolve a property image from Google when the user did not upload one. */
export async function resolvePropertyPhotoFromGoogle(
  lat: number,
  lng: number,
  address: string
): Promise<PropertyPhotoResult> {
  if (!getApiKey()) {
    return { url: null, source: null }
  }

  try {
    const photoRef = await findPlacePhotoReference(lat, lng, address)
    if (photoRef) {
      return { url: placePhotoUrl(photoRef), source: 'places' }
    }

    if (await hasStreetView(lat, lng)) {
      return { url: streetViewUrl(lat, lng), source: 'streetview' }
    }

    return { url: staticMapUrl(lat, lng), source: 'staticmap' }
  } catch {
    return { url: null, source: null }
  }
}

/** Client-side helper to fetch a photo URL from our API route. */
export async function fetchPropertyPhotoUrl(
  lat: number,
  lng: number,
  address: string
): Promise<string | null> {
  const params = new URLSearchParams({
    lat: String(lat),
    lng: String(lng),
    address,
  })
  const res = await fetch(`/api/place-photo?${params}`)
  if (!res.ok) return null
  const data = (await res.json()) as PropertyPhotoResult
  return data.url
}
