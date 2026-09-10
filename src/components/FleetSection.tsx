"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Users, Luggage } from "lucide-react"
import { supabase } from "@/lib/supabase"

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

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

export default function FleetSection() {
  const [vehicles, setVehicles] = useState<Car[]>([])

  useEffect(() => {
    async function fetchFleet() {
      const { data } = await supabase
        .from("cars")
        .select("*")
        .order("id", { ascending: true })
      if (data) setVehicles(data)
    }
    fetchFleet()
  }, [])

  return (
    <section className="relative py-[120px] bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] overflow-hidden">
      <div className="absolute top-0 left-[-10%] w-[120%] h-px bg-gradient-to-r from-transparent via-[var(--gold-accent)] to-transparent opacity-30" />
      <div className="max-w-[1400px] mx-auto px-5 relative z-[1]">
        <div className="text-center mb-[60px] max-w-[800px] mx-auto">
          <span className="inline-block px-5 py-2 bg-[rgba(221,186,94,0.15)] border border-[var(--gold-accent)] text-[var(--gold-accent)] text-[0.85rem] tracking-[2px] uppercase mb-5 rounded-25px font-semibold">
            Our Fleet
          </span>
          <h2 className="text-white text-[clamp(2rem,4vw,3rem)] mb-3.5 font-[family-name:var(--font-playfair)]">
            Premium <span className="text-[var(--gold-accent)]">Vehicles</span>
          </h2>
          <p className="text-[var(--soft-gray)] text-[1.1rem] max-w-[600px] mx-auto">
            Explore our fleet of luxury vehicles, each maintained to the highest standards.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {vehicles.map((vehicle) => (
            <Link key={vehicle.id} href={`/fleet/${toSlug(vehicle.name)}`} className="group">
              <div className="bg-[rgba(26,26,26,0.9)] backdrop-blur-[20px] rounded-[20px] overflow-hidden border border-[rgba(212,175,55,0.2)] transition-all duration-500 relative hover:-translate-y-[15px] hover:scale-[1.02] hover:border-[var(--gold-accent)] hover:shadow-[0_20px_40px_rgba(212,175,55,0.2)]">
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--gold-accent)] via-[var(--gold-light)] to-[var(--gold-accent)] scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
                <div className="relative h-[280px] overflow-hidden">
                  <Image
                    src={vehicle.image}
                    alt={vehicle.name}
                    fill
                    className={`object-cover transition-all duration-800 brightness-90 contrast-[1.1] group-hover:scale-[1.15] group-hover:brightness-110 group-hover:contrast-[1.15]${vehicle.name.toLowerCase().includes("bmw") ? " object-[center_80%]" : vehicle.name.toLowerCase().includes("escalade") ? " object-[center_65%]" : vehicle.name.toLowerCase().includes("wagoneer") || vehicle.name.toLowerCase().includes("rivian") ? " object-top" : ""}`}
                  />
                </div>
                <div className="p-[35px] relative">
                  <h3 className="text-white text-[1.6rem] mb-3.5 font-semibold">{vehicle.name}</h3>
                  <div className="flex gap-5 mb-5 flex-wrap">
                    <div className="flex items-center gap-2 text-[var(--soft-gray)] text-[0.9rem] bg-[rgba(212,175,55,0.1)] px-3 py-1.5 rounded-20px border border-[rgba(212,175,55,0.2)]">
                      <Users className="w-4 h-4 text-[var(--gold-accent)]" />
                      <span>{vehicle.passenger_cap} Passengers</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--soft-gray)] text-[0.9rem] bg-[rgba(212,175,55,0.1)] px-3 py-1.5 rounded-20px border border-[rgba(212,175,55,0.2)]">
                      <Luggage className="w-4 h-4 text-[var(--gold-accent)]" />
                      <span>{vehicle.luggage_cap} Bags</span>
                    </div>
                  </div>
                  <p className="text-[var(--soft-gray)] text-[1rem] leading-[1.7] mb-6">{vehicle.description}</p>
                  <div className="flex justify-between items-center pt-6 border-t border-[rgba(212,175,55,0.1)]">
                    <div className="text-[var(--soft-gray)] text-[0.9rem]">
                      From <span className="text-[var(--gold-accent)] text-[1.4rem] font-bold">${vehicle.vehicle_rate}</span>/mile
                    </div>
                    <span className="inline-block bg-gradient-to-br from-[var(--gold-accent)] to-[var(--gold-dark)] text-[#0D0D0D] px-6 py-3 rounded-25px text-[0.85rem] font-semibold uppercase tracking-[1px] transition-all duration-400 group-hover:-translate-y-0.5 group-hover:shadow-[0_8px_25px_rgba(212,175,55,0.4)]">
                      View Details
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
