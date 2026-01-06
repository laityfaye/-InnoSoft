/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_GOOGLE_MAPS_API_KEY: string
  // Ajoutez d'autres variables d'environnement ici si nécessaire
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Déclarations pour Google Maps
declare global {
  interface Window {
    google: typeof google
  }
  
  // API Permissions pour vérifier le statut de la géolocalisation
  interface Navigator {
    permissions?: {
      query(permissionDesc: { name: PermissionName }): Promise<PermissionStatus>
    }
  }
  
  interface PermissionStatus extends EventTarget {
    state: 'granted' | 'denied' | 'prompt'
    onchange: ((this: PermissionStatus, ev: Event) => any) | null
  }
  
  type PermissionName = 'geolocation' | 'camera' | 'microphone' | 'notifications' | 'persistent-storage' | 'push' | 'screen-wake-lock'
}

declare namespace google {
  namespace maps {
    class Map {
      constructor(element: HTMLElement, options?: MapOptions)
      setCenter(latlng: LatLng | LatLngLiteral): void
      setZoom(zoom: number): void
      fitBounds(bounds: LatLngBounds): void
    }

    class Marker {
      constructor(options?: MarkerOptions)
      setMap(map: Map | null): void
      setPosition(position: LatLng | LatLngLiteral): void
    }

    class Polyline {
      constructor(options?: PolylineOptions)
      setMap(map: Map | null): void
    }

    class LatLngBounds {
      extend(latlng: LatLng | LatLngLiteral): void
    }

    interface MapOptions {
      center?: LatLng | LatLngLiteral
      zoom?: number
      styles?: MapTypeStyle[]
    }

    interface MarkerOptions {
      position?: LatLng | LatLngLiteral
      map?: Map | null
      title?: string
      icon?: string | Icon | Symbol
    }

    interface PolylineOptions {
      path?: LatLng[] | LatLngLiteral[] | LatLngSequence
      geodesic?: boolean
      strokeColor?: string
      strokeOpacity?: number
      strokeWeight?: number
      map?: Map | null
    }

    interface LatLng {
      lat(): number
      lng(): number
    }

    interface LatLngLiteral {
      lat: number
      lng: number
    }

    type LatLngSequence = LatLng[] | LatLngLiteral[]

    interface Icon {
      url: string
      scaledSize?: Size
      anchor?: Point
    }

    interface Symbol {
      path?: SymbolPath | string
      scale?: number
      strokeColor?: string
      fillColor?: string
    }

    interface Size {
      width: number
      height: number
    }

    interface Point {
      x: number
      y: number
    }

    type SymbolPath = 'CIRCLE' | 'BACKWARD_CLOSED_ARROW' | 'FORWARD_CLOSED_ARROW'

    interface MapTypeStyle {
      elementType?: string
      stylers?: Array<{ [key: string]: any }>
    }

    namespace geometry {
      class spherical {
        static computeDistanceBetween(from: LatLng | LatLngLiteral, to: LatLng | LatLngLiteral): number
      }
    }

    class Geocoder {
      geocode(request: GeocoderRequest, callback: (results: GeocoderResult[] | null, status: GeocoderStatus) => void): void
    }

    interface GeocoderRequest {
      address?: string
      location?: LatLng | LatLngLiteral
    }

    interface GeocoderResult {
      geometry: {
        location: LatLng
        location_type: string
        viewport: LatLngBounds
      }
      formatted_address: string
    }

    type GeocoderStatus = 'OK' | 'ZERO_RESULTS' | 'OVER_QUERY_LIMIT' | 'REQUEST_DENIED' | 'INVALID_REQUEST' | 'UNKNOWN_ERROR'
  }
}

export {}

