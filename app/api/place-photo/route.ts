import { NextRequest, NextResponse } from 'next/server'
import { resolvePropertyPhotoFromGoogle } from '@/lib/google-place-photo'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const lat = Number(searchParams.get('lat'))
  const lng = Number(searchParams.get('lng'))
  const address = searchParams.get('address') ?? ''

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json(
      { url: null, source: null, error: 'lat and lng are required' },
      { status: 400 }
    )
  }

  const result = await resolvePropertyPhotoFromGoogle(lat, lng, address)
  return NextResponse.json(result)
}
