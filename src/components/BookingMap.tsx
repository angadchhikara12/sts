"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

const GOLDEN_GATE = { lat: 37.8199, lng: -122.4783 }

function makeGoldPinIcon(n: number) {
  return new L.DivIcon({
    className: "",
    html: `<div style="width:30px;height:30px;background:linear-gradient(135deg,#f9e18b,#ddba5e);border:3px solid #fff;border-radius:50%;box-shadow:0 2px 10px rgba(221,186,94,0.6);display:flex;align-items:center;justify-content:center;font-family:Inter,sans-serif;font-size:13px;font-weight:700;color:#0D0D0D">${n}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -32],
  })
}

const greenIcon = new L.DivIcon({
  className: "",
  html: `<div style="width:28px;height:28px;background:linear-gradient(135deg,#22c55e,#16a34a);border:3px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center"><div style="width:8px;height:8px;background:#fff;border-radius:50%"></div></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -30],
})

const redIcon = new L.DivIcon({
  className: "",
  html: `<div style="width:28px;height:28px;background:linear-gradient(135deg,#ef4444,#dc2626);border:3px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center"><div style="width:8px;height:8px;background:#fff;border-radius:50%"></div></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -30],
})

interface Suggestion {
  display_name: string
  lat: string
  lon: string
  short_name?: string
}

export interface Stop {
  id: number
  address: string
  lat: number
  lng: number
}

interface BookingMapProps {
  pickupLocation: string
  dropoffLocation: string
  onPickupSelect: (address: string, lat: number, lng: number) => void
  onDropoffSelect: (address: string, lat: number, lng: number) => void
  sameDropoff: boolean
  onToggleSameDropoff: () => void
  stops: Stop[]
  onAddStop: () => void
  onRemoveStop: (id: number) => void
  onStopSelect: (id: number, address: string, lat: number, lng: number) => void
  onRouteInfo?: (distanceMeters: number, durationSeconds: number) => void
}

function useDebounce(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value])
  return debounced
}

async function geocodeAddress(query: string): Promise<Suggestion[]> {
  if (!query || query.length < 3) return []
  const params = new URLSearchParams({
    q: query + ", California, USA",
    format: "json",
    countrycodes: "us",
    limit: "6",
    addressdetails: "1",
  })
  const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
    headers: { "User-Agent": "SANTransport/1.0" },
  })
  if (!res.ok) return []
  const data = await res.json()
  return data.filter((r: Suggestion) =>
    r.display_name.toLowerCase().includes("california") || r.display_name.toLowerCase().includes(", ca,")
  )
}

function AddressInput({
  label,
  value,
  onSelect,
  iconColor,
  placeholder,
  required,
  removable,
  onRemove,
  stopNumber,
}: {
  label: string
  value: string
  onSelect: (address: string, lat: number, lng: number) => void
  iconColor: string
  placeholder: string
  required?: boolean
  removable?: boolean
  onRemove?: () => void
  stopNumber?: number
}) {
  const [input, setInput] = useState(value)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const debounced = useDebounce(input, 350)

  useEffect(() => { setInput(value) }, [value])

  useEffect(() => {
    if (debounced.length < 3) { setSuggestions([]); return }
    let cancelled = false
    setLoading(true)
    geocodeAddress(debounced).then((r) => { if (!cancelled) { setSuggestions(r); setLoading(false) } })
    return () => { cancelled = true }
  }, [debounced])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  function handleSelect(s: Suggestion) {
    const name = s.display_name.split(",").slice(0, 3).join(",").trim()
    setInput(name)
    onSelect(name, parseFloat(s.lat), parseFloat(s.lon))
    setOpen(false)
    setSuggestions([])
  }

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block mb-0 font-semibold text-[var(--gold-accent)] text-[0.85rem] uppercase tracking-[1.5px]">
        {label} {required && "*"}
      </label>
      <div className="relative mt-2">
        {stopNumber !== undefined ? (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gradient-to-br from-[var(--gold-accent)] to-[var(--gold-dark)] flex items-center justify-center text-[11px] font-bold text-[#0D0D0D]">
            {stopNumber}
          </div>
        ) : (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full" style={{ background: iconColor }} />
        )}
        <input
          type="text"
          required={required}
          value={input}
          onChange={(e) => { setInput(e.target.value); setOpen(true) }}
          onFocus={() => { if (suggestions.length) setOpen(true) }}
          placeholder={placeholder}
          className="w-full py-3 pl-10 pr-10 bg-[rgba(13,13,13,0.8)] border-2 border-[rgba(221,186,94,0.3)] rounded-xl text-white text-[0.95rem] font-[Inter,sans-serif] transition-all duration-300 placeholder:text-white/40 placeholder:italic focus:border-[var(--gold-accent)] focus:shadow-[0_0_0_4px_rgba(221,186,94,0.2)] focus:-translate-y-[2px] focus:outline-none"
        />
        {loading && <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-[var(--gold-accent)] border-t-transparent rounded-full animate-spin" />}
        {!loading && removable && onRemove && (
          <button type="button" onClick={onRemove} className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[rgba(239,68,68,0.15)] border border-[rgba(239,68,68,0.3)] flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-[rgba(239,68,68,0.3)] hover:border-[rgba(239,68,68,0.6)]">
            <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </div>
      {open && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-br from-[rgba(26,26,26,0.98)] to-[rgba(13,13,13,0.98)] border-2 border-[var(--gold-accent)] rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] max-h-[220px] overflow-y-auto z-[1000] p-2">
          {suggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSelect(s)}
              className="w-full text-left px-4 py-3 text-white/90 text-[0.85rem] cursor-pointer transition-all duration-200 rounded-lg hover:bg-[rgba(221,186,94,0.12)] hover:text-[var(--gold-accent)] border-l-3 border-l-transparent hover:border-l-[var(--gold-accent)]"
            >
              {s.display_name.split(",").slice(0, 3).join(",").trim()}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function MapController({
  pickupCoords,
  dropoffCoords,
  stopCoords,
  routeCoords,
}: {
  pickupCoords: { lat: number; lng: number } | null
  dropoffCoords: { lat: number; lng: number } | null
  stopCoords: { lat: number; lng: number }[]
  routeCoords: [number, number][]
}) {
  const map = useMap()

  useEffect(() => {
    const allPts: L.LatLngExpression[] = []
    if (pickupCoords) allPts.push(pickupCoords)
    stopCoords.forEach((c) => allPts.push(c))
    if (dropoffCoords) allPts.push(dropoffCoords)
    if (allPts.length >= 2) {
      if (routeCoords.length > 0) {
        routeCoords.forEach((c) => allPts.push(c))
      }
      const bounds = L.latLngBounds(allPts)
      map.fitBounds(bounds, { padding: [4, 4], duration: 1.2, animate: true })
    } else if (pickupCoords) {
      map.flyTo(pickupCoords, 15, { duration: 1 })
    }
  }, [pickupCoords, dropoffCoords, stopCoords, routeCoords, map])

  useEffect(() => {
    if (routeCoords.length > 0) {
      const polyline = L.polyline(routeCoords, {
        color: "#ddba5e",
        weight: 5,
        opacity: 0.9,
      })
      polyline.addTo(map)
      return () => { map.removeLayer(polyline) }
    }
  }, [routeCoords, map])

  return null
}

export default function BookingMap({
  pickupLocation,
  dropoffLocation,
  onPickupSelect,
  onDropoffSelect,
  sameDropoff,
  onToggleSameDropoff,
  stops,
  onAddStop,
  onRemoveStop,
  onStopSelect,
  onRouteInfo,
}: BookingMapProps) {
  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [dropoffCoords, setDropoffCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [stopCoordsMap, setStopCoordsMap] = useState<Map<number, { lat: number; lng: number }>>(new Map())
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([])

  const stopCoords = stops.map((s) => stopCoordsMap.get(s.id)).filter(Boolean) as { lat: number; lng: number }[]

  const onRouteInfoRef = useRef(onRouteInfo)
  useEffect(() => { onRouteInfoRef.current = onRouteInfo }, [onRouteInfo])

  const fetchRoute = useCallback(async (waypoints: { lat: number; lng: number }[]) => {
    if (waypoints.length < 2) { setRouteCoords([]); onRouteInfoRef.current?.(0, 0); return }
    try {
      const coords = waypoints.map((w) => `${w.lng},${w.lat}`).join(";")
      const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`
      const res = await fetch(url)
      if (!res.ok) return
      const data = await res.json()
      if (data.routes?.length) {
        const path = data.routes[0].geometry.coordinates.map((c: [number, number]) => [c[1], c[0]] as [number, number])
        setRouteCoords(path)
        onRouteInfoRef.current?.(data.routes[0].distance, data.routes[0].duration)
      }
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    const waypoints: { lat: number; lng: number }[] = []
    if (pickupCoords) waypoints.push(pickupCoords)
    stops.forEach((s) => {
      const coords = stopCoordsMap.get(s.id)
      if (coords) waypoints.push(coords)
    })
    if (dropoffCoords) waypoints.push(dropoffCoords)

    if (waypoints.length >= 2) {
      fetchRoute(waypoints)
    } else {
      setRouteCoords([])
      onRouteInfoRef.current?.(0, 0)
    }
  }, [pickupCoords, dropoffCoords, stops, stopCoordsMap, fetchRoute])

  function handlePickupSelect(address: string, lat: number, lng: number) {
    setPickupCoords({ lat, lng })
    onPickupSelect(address, lat, lng)
  }

  function handleDropoffSelect(address: string, lat: number, lng: number) {
    setDropoffCoords({ lat, lng })
    onDropoffSelect(address, lat, lng)
  }

  function handleStopSelect(id: number, address: string, lat: number, lng: number) {
    setStopCoordsMap((prev) => {
      const next = new Map(prev)
      next.set(id, { lat, lng })
      return next
    })
    onStopSelect(id, address, lat, lng)
  }

  function handleRemoveStop(id: number) {
    setStopCoordsMap((prev) => {
      const next = new Map(prev)
      next.delete(id)
      return next
    })
    onRemoveStop(id)
  }

  return (
    <div className="w-full rounded-[15px] overflow-hidden border-2 border-[rgba(221,186,94,0.3)] bg-[rgba(13,13,13,0.8)]">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] min-h-[400px]">
        {/* Map */}
        <div className="h-[300px] lg:h-[420px] relative">
          <MapContainer
            center={[GOLDEN_GATE.lat, GOLDEN_GATE.lng]}
            zoom={12}
            scrollWheelZoom={false}
            className="h-full w-full z-0"
            style={{ background: "#0D0D0D" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapController pickupCoords={pickupCoords} dropoffCoords={dropoffCoords} stopCoords={stopCoords} routeCoords={routeCoords} />
            {pickupCoords && (
              <Marker position={pickupCoords} icon={greenIcon}>
                <Popup className="font-[Inter,sans-serif]">Pickup</Popup>
              </Marker>
            )}
            {stops.map((s, i) => {
              const coords = stopCoordsMap.get(s.id)
              if (!coords) return null
              return (
                <Marker key={s.id} position={coords} icon={makeGoldPinIcon(i + 1)}>
                  <Popup className="font-[Inter,sans-serif]">Stop {i + 1}</Popup>
                </Marker>
              )
            })}
            {dropoffCoords && (
              <Marker position={dropoffCoords} icon={redIcon}>
                <Popup className="font-[Inter,sans-serif]">Drop-off</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>

        {/* Address inputs */}
        <div className="p-5 flex flex-col gap-4 border-t lg:border-t-0 lg:border-l border-[rgba(221,186,94,0.3)] max-h-[500px] overflow-y-auto">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-[var(--gold-accent)]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            <span className="text-white text-[0.9rem] font-medium">Route Details</span>
          </div>

          <AddressInput
            label="Pickup Location"
            value={pickupLocation}
            onSelect={handlePickupSelect}
            iconColor="#22c55e"
            placeholder="Enter pickup address"
            required
          />

          {/* Add stop button — between pickup and toggle */}
          <button
            type="button"
            onClick={onAddStop}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border-2 border-dashed border-[rgba(221,186,94,0.3)] bg-transparent cursor-pointer transition-all duration-300 hover:border-[var(--gold-accent)] hover:bg-[rgba(221,186,94,0.05)] group"
          >
            <div className="w-5 h-5 rounded-full border-2 border-[rgba(221,186,94,0.5)] flex items-center justify-center group-hover:border-[var(--gold-accent)] transition-colors">
              <svg className="w-3 h-3 text-[rgba(221,186,94,0.5)] group-hover:text-[var(--gold-accent)] transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" d="M12 5v14M5 12h14" /></svg>
            </div>
            <span className="text-[0.85rem] text-white/50 group-hover:text-white transition-colors">Add Stop</span>
          </button>

          {/* Different dropoff toggle — always visible */}
          <button
            type="button"
            onClick={onToggleSameDropoff}
            className="flex items-center gap-3 w-full py-3 px-4 rounded-xl border-2 border-dashed border-[rgba(221,186,94,0.25)] bg-transparent cursor-pointer transition-all duration-300 hover:border-[var(--gold-accent)] hover:bg-[rgba(221,186,94,0.05)] group"
          >
            <div className={`w-5 h-5 rounded-[6px] border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${!sameDropoff ? "bg-[var(--gold-accent)] border-[var(--gold-accent)]" : "border-[rgba(221,186,94,0.4)] bg-transparent"}`}>
              {!sameDropoff && (
                <svg className="w-3 h-3 text-[#0D0D0D]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              )}
            </div>
            <span className="text-[0.85rem] text-white/70 group-hover:text-white transition-colors">Different dropoff location?</span>
          </button>

          {!sameDropoff && (
            <AddressInput
              label="Drop-off Location"
              value={dropoffLocation}
              onSelect={handleDropoffSelect}
              iconColor="#ef4444"
              placeholder="Enter destination address"
              required
            />
          )}

          {/* Stop inputs */}
          {stops.map((stop, i) => (
            <div key={stop.id} className="relative">
              <AddressInput
                label={`Stop ${i + 1}`}
                value={stop.address}
                onSelect={(addr, lat, lng) => handleStopSelect(stop.id, addr, lat, lng)}
                iconColor="#ddba5e"
                placeholder="Enter stop address"
                stopNumber={i + 1}
                removable
                onRemove={() => handleRemoveStop(stop.id)}
              />
            </div>
          ))}

          {pickupCoords && dropoffCoords && routeCoords.length > 0 && (
            <div className="bg-[rgba(221,186,94,0.08)] border border-[rgba(221,186,94,0.2)] rounded-xl p-3 mt-auto">
              <div className="flex items-center gap-2 text-[var(--gold-accent)] text-[0.85rem] font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                Route mapped
                {stops.length > 0 && <span className="text-white/50">({stops.length} stop{stops.length !== 1 ? "s" : ""})</span>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
