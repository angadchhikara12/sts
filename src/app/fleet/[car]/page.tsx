"use client"

import { Suspense, useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Users, Luggage, ArrowLeft, Fuel, DollarSign, Hash, Box, Gauge, Star, MapPin } from "lucide-react"
import { supabase } from "@/lib/supabase"
import Footer from "@/components/Footer"

interface Car {
  id: number
  name: string
  image: string
  passenger_cap: number
  luggage_cap: number
  description: string
  category: string
  isAvailable: boolean
  fuel_surcharge: string
  vehicle_rate: string
  vin_number: string | null
  standard_gratuity: string
}

interface VehicleSpecs {
  frontLegroom: string
  rearLegroom: string
  thirdRowLegroom: string | null
  frontHeadroom: string
  rearHeadroom: string
  thirdRowHeadroom: string | null
  cargoBehindThirdRow: string | null
  maxCargo: string | null
  frontTrunk: string | null
  engine: string
  horsepower: string
  length: string
  amenities: string[]
  recommendedFor: string[]
}

const vehicleSpecs: Record<string, VehicleSpecs> = {
  "lincoln-navigator-l": {
    frontLegroom: '43"',
    rearLegroom: '42"',
    thirdRowLegroom: '40"',
    frontHeadroom: '39"',
    rearHeadroom: '37"',
    thirdRowHeadroom: '37"',
    cargoBehindThirdRow: "37.3 cu ft",
    maxCargo: "120.2 cu ft",
    frontTrunk: null,
    engine: "3.5L Twin-Turbo V6",
    horsepower: "440 hp",
    length: '221.9"',
    amenities: ["Captain's chairs available", "Panoramic roof", "10\" touchscreen", "Reclining 2nd row", "Premium leather seating"],
    recommendedFor: ["Family Outings", "Airport Transfers", "Group Travel", "Corporate Events"],
  },
  "bmw-7-series": {
    frontLegroom: '41.2"',
    rearLegroom: '43.3"',
    thirdRowLegroom: null,
    frontHeadroom: '39.8"',
    rearHeadroom: '38.6"',
    thirdRowHeadroom: null,
    cargoBehindThirdRow: null,
    maxCargo: "19.1 cu ft",
    frontTrunk: null,
    engine: "3.0L Turbo I-6 / 4.4L Twin-Turbo V8",
    horsepower: "375–536 hp",
    length: '212.2"',
    amenities: ["Executive rear seating", "Sky Lounge LED roof", "Rear entertainment screens", "Bowers & Wilkins sound", "Heated/ventilated seats"],
    recommendedFor: ["Business Travel", "Corporate Events", "Date Nights", "VIP Transfers"],
  },
  "cadillac-escalade": {
    frontLegroom: '44.5"',
    rearLegroom: '41.7"',
    thirdRowLegroom: '34.9"',
    frontHeadroom: '42.3"',
    rearHeadroom: '38.9"',
    thirdRowHeadroom: '38.2"',
    cargoBehindThirdRow: "25.5 cu ft",
    maxCargo: "120.5 cu ft",
    frontTrunk: null,
    engine: "6.2L V8",
    horsepower: "420 hp",
    length: '211.9"',
    amenities: ["38\" curved OLED display", "AKG 36-speaker audio", "Super Cruise hands-free driving", "Night vision", "Power-retractable running boards"],
    recommendedFor: ["Weddings", "VIP & Executive", "Airport Transfers", "Special Events"],
  },
  "jeep-wagoneer-l": {
    frontLegroom: '40.9"',
    rearLegroom: '42.7"',
    thirdRowLegroom: '36.6"',
    frontHeadroom: '41.3"',
    rearHeadroom: '40.0"',
    thirdRowHeadroom: '39.1"',
    cargoBehindThirdRow: "42.1 cu ft",
    maxCargo: "116.7 cu ft",
    frontTrunk: null,
    engine: "3.0L Twin-Turbo I6",
    horsepower: "420 hp",
    length: '226"',
    amenities: ["Best-in-class 3rd row legroom", "McIntosh audio system", "Dual panoramic sunroofs", "10.25\" passenger screen", "24\" wheels"],
    recommendedFor: ["Family Trips", "Airport (Heavy Luggage)", "Group Travel", "Road Trips"],
  },
  "rivian-r1s": {
    frontLegroom: '41.4"',
    rearLegroom: '36.6"',
    thirdRowLegroom: '32.8"',
    frontHeadroom: '41.1"',
    rearHeadroom: '39.7"',
    thirdRowHeadroom: '38.6"',
    cargoBehindThirdRow: "17.7 cu ft",
    maxCargo: "104.7 cu ft",
    frontTrunk: "11.1 cu ft",
    engine: "Tri-Motor Electric",
    horsepower: "850+ hp",
    length: '200.8"',
    amenities: ["All-electric, 0 emissions", "Camp Kitchen compatible", "15\" center touchscreen", "Bluetooth speakers built-in", "OTA software updates"],
    recommendedFor: ["Eco-Friendly Rides", "Scenic Tours", "Corporate Sustainability", "Tech Events"],
  },
  "mercedes-s-class": {
    frontLegroom: '41.4"',
    rearLegroom: '43.8"',
    thirdRowLegroom: null,
    frontHeadroom: '42.1"',
    rearHeadroom: '39.4"',
    thirdRowHeadroom: null,
    cargoBehindThirdRow: null,
    maxCargo: "12.8 cu ft",
    frontTrunk: null,
    engine: "3.0L Turbo I6 / 4.0L Twin-Turbo V8",
    horsepower: "442–496 hp",
    length: '208.2"',
    amenities: ["Burmester 4D surround sound", "Rear executive seats", "MBUX Hyperscreen available", "E-Active body control", "64-color ambient lighting"],
    recommendedFor: ["Weddings", "Red Carpet Events", "Executive Travel", "Date Nights"],
  },
}

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

function getSpecs(name: string): VehicleSpecs | null {
  return vehicleSpecs[toSlug(name)] ?? null
}

function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b border-[rgba(212,175,55,0.1)]">
      <span className="text-[var(--soft-gray)] text-[0.9rem]">{label}</span>
      <span className="text-white font-medium text-[0.9rem]">{value}</span>
    </div>
  )
}

function CarDetailContent() {
  const params = useParams<{ car: string }>()
  const [car, setCar] = useState<Car | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCar() {
      const slug = Array.isArray(params.car) ? params.car[0] : params.car
      if (!slug) return
      const { data } = await supabase
        .from("cars")
        .select("*")
      if (data) {
        const match = data.find((c: Car) => toSlug(c.name) === slug)
        setCar(match || null)
      }
      setLoading(false)
    }
    fetchCar()
  }, [params.car])

  if (loading) {
    return (
      <div className="bg-[#0D0D0D] min-h-screen flex items-center justify-center">
        <p className="text-[var(--gold-accent)] text-xl">Loading...</p>
      </div>
    )
  }

  if (!car) {
    return (
      <div className="bg-[#0D0D0D] min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-white text-xl">Vehicle not found.</p>
        <Link href="/fleet">
          <span className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-[var(--gold-accent)] to-[var(--gold-dark)] text-[#0D0D0D] rounded-lg font-semibold no-underline">Back to Fleet</span>
        </Link>
      </div>
    )
  }

  const specs = getSpecs(car.name)

  return (
    <div className="bg-[#0D0D0D] min-h-screen">
      <div className="max-w-6xl mx-auto py-10 px-5">
        <Link href="/fleet" className="inline-flex items-center gap-2 text-[var(--gold-accent)] hover:underline mb-8 text-[0.95rem] no-underline">
          <ArrowLeft className="w-4 h-4" /> Back to Fleet
        </Link>

        {/* Hero */}
        <div className="flex flex-col md:flex-row gap-10 items-center">
          <div className="w-100 h-100 rounded-[20px] overflow-hidden border border-[rgba(212,175,55,0.2)] mx-auto md:mx-0 shrink-0 relative">
            <Image
              src={car.image}
              alt={car.name}
              fill
              className={`object-cover${car.name.toLowerCase().includes("bmw") ? " object-[center_75%]" : car.name.toLowerCase().includes("escalade") ? " object-[center_40%]" : car.name.toLowerCase().includes("wagoneer") || car.name.toLowerCase().includes("rivian") ? " object-top" : " object-center"}`}
            />
          </div>

          <div className="w-full md:w-1/2 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <h1 className="text-white text-4xl font-bold font-[family-name:var(--font-playfair)]">{car.name}</h1>
              <span className="text-[0.8rem] text-[var(--gold-accent)] border border-[var(--gold-accent)] rounded-25px px-3 py-1">{car.category}</span>
            </div>

            <p className="text-[var(--soft-gray)] text-lg leading-relaxed">{car.description}</p>

            <div className="flex gap-8 text-[var(--soft-gray)]">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[var(--gold-accent)]" />
                <span>{car.passenger_cap} Passengers</span>
              </div>
              <div className="flex items-center gap-2">
                <Luggage className="w-5 h-5 text-[var(--gold-accent)]" />
                <span>{car.luggage_cap} Bags</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className={`text-[0.9rem] px-3 py-1 rounded-full ${car.isAvailable ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                {car.isAvailable ? "Available Now" : "Currently Unavailable"}
              </span>
            </div>

            <div className="bg-[rgba(26,26,26,0.9)] backdrop-blur-[20px] rounded-[20px] p-5 border border-[rgba(212,175,55,0.2)] mt-2">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[var(--soft-gray)]">
                    <DollarSign className="w-4 h-4 text-[var(--gold-accent)]" />
                    <span>Vehicle Rate</span>
                  </div>
                  <span className="text-white font-bold">${car.vehicle_rate}/mile</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[var(--soft-gray)]">
                    <Fuel className="w-4 h-4 text-[var(--gold-accent)]" />
                    <span>Fuel Surcharge</span>
                  </div>
                  <span className="text-white font-bold">${car.fuel_surcharge}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[var(--soft-gray)]">
                    <DollarSign className="w-4 h-4 text-[var(--gold-accent)]" />
                    <span>Standard Gratuity</span>
                  </div>
                  <span className="text-white font-bold">{car.standard_gratuity}%</span>
                </div>
                {car.vin_number && (
                  <div className="flex items-center justify-between pt-2 border-t border-[rgba(212,175,55,0.3)]">
                    <div className="flex items-center gap-2 text-[var(--soft-gray)]">
                      <Hash className="w-4 h-4 text-[var(--gold-accent)]" />
                      <span>VIN</span>
                    </div>
                    <span className="text-[var(--soft-gray)] text-[0.9rem]">{car.vin_number}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Specs */}
        {specs && (
          <div className="mt-16">
            <h2 className="text-white text-3xl font-bold font-[family-name:var(--font-playfair)] mb-8">
              Vehicle <span className="text-[var(--gold-accent)]">Specifications</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Passenger Space */}
              <div className="bg-[rgba(26,26,26,0.9)] backdrop-blur-[20px] rounded-[15px] border border-[rgba(212,175,55,0.2)] overflow-hidden">
                <div className="py-5 px-6 flex flex-col gap-1">
                  <h3 className="text-[0.95rem] font-bold text-[var(--gold-accent)] mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4" /> Passenger Space
                  </h3>
                  <SpecItem label="Front Legroom" value={specs.frontLegroom} />
                  <SpecItem label="Rear Legroom" value={specs.rearLegroom} />
                  {specs.thirdRowLegroom && <SpecItem label="3rd Row Legroom" value={specs.thirdRowLegroom} />}
                  <SpecItem label="Front Headroom" value={specs.frontHeadroom} />
                  <SpecItem label="Rear Headroom" value={specs.rearHeadroom} />
                  {specs.thirdRowHeadroom && <SpecItem label="3rd Row Headroom" value={specs.thirdRowHeadroom} />}
                </div>
              </div>

              {/* Cargo & Dimensions */}
              <div className="bg-[rgba(26,26,26,0.9)] backdrop-blur-[20px] rounded-[15px] border border-[rgba(212,175,55,0.2)] overflow-hidden">
                <div className="py-5 px-6 flex flex-col gap-1">
                  <h3 className="text-[0.95rem] font-bold text-[var(--gold-accent)] mb-2 flex items-center gap-2">
                    <Box className="w-4 h-4" /> Cargo & Dimensions
                  </h3>
                  {specs.cargoBehindThirdRow && <SpecItem label="Cargo (Behind 3rd Row)" value={specs.cargoBehindThirdRow} />}
                  <SpecItem label="Max Cargo" value={specs.maxCargo ?? "—"} />
                  {specs.frontTrunk && <SpecItem label="Front Trunk (Frunk)" value={specs.frontTrunk} />}
                  <SpecItem label="Vehicle Length" value={specs.length} />
                  <SpecItem label="Luggage Capacity" value={`${car.luggage_cap} bags`} />
                </div>
              </div>

              {/* Performance */}
              <div className="bg-[rgba(26,26,26,0.9)] backdrop-blur-[20px] rounded-[15px] border border-[rgba(212,175,55,0.2)] overflow-hidden">
                <div className="py-5 px-6 flex flex-col gap-1">
                  <h3 className="text-[0.95rem] font-bold text-[var(--gold-accent)] mb-2 flex items-center gap-2">
                    <Gauge className="w-4 h-4" /> Performance
                  </h3>
                  <SpecItem label="Engine" value={specs.engine} />
                  <SpecItem label="Horsepower" value={specs.horsepower} />
                  <SpecItem label="Rate per Mile" value={`$${car.vehicle_rate}`} />
                  <SpecItem label="Fuel Surcharge" value={`$${car.fuel_surcharge}`} />
                  <SpecItem label="Standard Gratuity" value={`${car.standard_gratuity}%`} />
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-[rgba(26,26,26,0.9)] backdrop-blur-[20px] rounded-[15px] border border-[rgba(212,175,55,0.2)] mt-6 py-5 px-6">
              <h3 className="text-[0.95rem] font-bold text-[var(--gold-accent)] mb-3 flex items-center gap-2">
                <Star className="w-4 h-4" /> Key Amenities
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {specs.amenities.map((amenity) => (
                  <div key={amenity} className="bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.3)] rounded-lg px-3 py-2 text-white/80 text-[0.9rem] text-center">
                    {amenity}
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended For */}
            <div className="bg-[rgba(26,26,26,0.9)] backdrop-blur-[20px] rounded-[15px] border border-[rgba(212,175,55,0.2)] mt-6 py-5 px-6">
              <h3 className="text-[0.95rem] font-bold text-[var(--gold-accent)] mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Recommended For
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {specs.recommendedFor.map((use) => (
                  <div key={use} className="bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.3)] rounded-lg px-3 py-2 text-white/80 text-[0.9rem] text-center">
                    {use}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
      <Footer />
    </div>
  )
}

export default function CarDetail() {
  return (
    <Suspense fallback={<div className="bg-[#0D0D0D] min-h-screen flex items-center justify-center"><p className="text-[var(--gold-accent)] text-xl">Loading...</p></div>}>
      <CarDetailContent />
    </Suspense>
  )
}
