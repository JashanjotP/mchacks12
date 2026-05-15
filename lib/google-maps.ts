/** Shared Google Maps config — keep libraries array reference stable for useLoadScript. */
export const GOOGLE_MAPS_LIBRARIES: ('places')[] = ['places']

export const GUELPH_BIAS_BOUNDS: google.maps.LatLngBoundsLiteral = {
  north: 43.66,
  south: 43.42,
  east: -80.02,
  west: -80.48,
}

export const GUELPH_ADDRESS_OPTIONS: google.maps.places.AutocompleteOptions = {
  types: ['address'],
  componentRestrictions: { country: 'ca' },
  bounds: GUELPH_BIAS_BOUNDS,
  strictBounds: false,
  fields: ['formatted_address', 'geometry', 'photos', 'place_id'],
}
