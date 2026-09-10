"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

interface Car {
  id: number
  name: string
  passenger_cap: number
  luggage_cap: number
  category: string
  vehicle_rate: string
}

interface CompRow {
  name: string
  passengers: number
  luggage: number
  category: string
  rate: string
  frontLegroom: string
  rearLegroom: string
  thirdRowLegroom: string | null
  maxCargo: string
  engine: string
  horsepower: string
  length: string
  recommendedFor: string[]
}

const specsData: Record<string, Omit<CompRow, "name" | "passengers" | "luggage" | "category" | "rate">> = {
  "lincoln-navigator-l": {
    frontLegroom: '43"',
    rearLegroom: '42"',
    thirdRowLegroom: '40"',
    maxCargo: "120.2 cu ft",
    engine: "3.5L Twin-Turbo V6",
    horsepower: "440 hp",
    length: '221.9"',
    recommendedFor: ["Family Outings", "Airport Transfers", "Group Travel", "Corporate Events"],
  },
  "bmw-7-series": {
    frontLegroom: '41.2"',
    rearLegroom: '43.3"',
    thirdRowLegroom: null,
    maxCargo: "19.1 cu ft",
    engine: "3.0L I-6 / 4.4L V8 TT",
    horsepower: "375–536 hp",
    length: '212.2"',
    recommendedFor: ["Business Travel", "Corporate Events", "Date Nights", "VIP Transfers"],
  },
  "cadillac-escalade": {
    frontLegroom: '44.5"',
    rearLegroom: '41.7"',
    thirdRowLegroom: '34.9"',
    maxCargo: "120.5 cu ft",
    engine: "6.2L V8",
    horsepower: "420 hp",
    length: '211.9"',
    recommendedFor: ["Weddings", "VIP & Executive", "Airport Transfers", "Special Events"],
  },
  "jeep-wagoneer-l": {
    frontLegroom: '40.9"',
    rearLegroom: '42.7"',
    thirdRowLegroom: '36.6"',
    maxCargo: "116.7 cu ft",
    engine: "3.0L Twin-Turbo I6",
    horsepower: "420 hp",
    length: '226"',
    recommendedFor: ["Family Trips", "Airport (Heavy Luggage)", "Group Travel", "Road Trips"],
  },
  "rivian-r1s": {
    frontLegroom: '41.4"',
    rearLegroom: '36.6"',
    thirdRowLegroom: '32.8"',
    maxCargo: "104.7 cu ft",
    engine: "Tri-Motor Electric",
    horsepower: "850+ hp",
    length: '200.8"',
    recommendedFor: ["Eco-Friendly Rides", "Scenic Tours", "Corporate Sustainability", "Tech Events"],
  },
  "mercedes-s-class": {
    frontLegroom: '41.4"',
    rearLegroom: '43.8"',
    thirdRowLegroom: null,
    maxCargo: "12.8 cu ft",
    engine: "3.0L I6 / 4.0L V8 TT",
    horsepower: "442–496 hp",
    length: '208.2"',
    recommendedFor: ["Weddings", "Red Carpet Events", "Executive Travel", "Date Nights"],
  },
}

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

function Cell({ children, highlight }: { children: React.ReactNode; highlight?: boolean }) {
  return (
    <td className={`px-2 py-2.5 text-[0.9rem] text-center border-b border-[rgba(212,175,55,0.15)] whitespace-nowrap ${highlight ? "text-[var(--gold-accent)] font-bold" : "text-[var(--soft-gray)]"}`}>
      {children}
    </td>
  )
}

export default function FleetComparison() {
  const [rows, setRows] = useState<CompRow[]>([])

  useEffect(() => {
    async function fetchCars() {
      const { data } = await supabase
        .from("cars")
        .select("*")
        .order("id", { ascending: true })
      if (data) {
        const mapped: CompRow[] = data.map((c: Car) => {
          const extra = specsData[toSlug(c.name)]
          return {
            name: c.name,
            passengers: c.passenger_cap,
            luggage: c.luggage_cap,
            category: c.category,
            rate: c.vehicle_rate,
            frontLegroom: extra?.frontLegroom ?? "—",
            rearLegroom: extra?.rearLegroom ?? "—",
            thirdRowLegroom: extra?.thirdRowLegroom ?? null,
            maxCargo: extra?.maxCargo ?? "—",
            engine: extra?.engine ?? "—",
            horsepower: extra?.horsepower ?? "—",
            length: extra?.length ?? "—",
            recommendedFor: extra?.recommendedFor ?? [],
          }
        })
        setRows(mapped)
      }
    }
    fetchCars()
  }, [])

  if (rows.length === 0) return null

  return (
    <section className="py-[100px] bg-[#0D0D0D]">
      <div className="max-w-[1500px] mx-auto px-5">
        <div className="text-center mb-10 max-w-[800px] mx-auto">
          <span className="inline-block px-5 py-2 bg-[rgba(221,186,94,0.15)] border border-[var(--gold-accent)] text-[var(--gold-accent)] text-[0.85rem] tracking-[2px] uppercase mb-5 rounded-25px font-semibold">
            Compare Vehicles
          </span>
          <h2 className="text-white text-[clamp(2rem,4vw,3rem)] mb-3.5 font-[family-name:var(--font-playfair)]">
            Fleet <span className="text-[var(--gold-accent)]">Comparison</span>
          </h2>
          <p className="text-[var(--soft-gray)] text-[1.1rem] max-w-[600px] mx-auto">
            Side-by-side comparison of our luxury fleet to help you choose the perfect vehicle.
          </p>
        </div>

        <div className="bg-[rgba(26,26,26,0.9)] backdrop-blur-[20px] rounded-[20px] overflow-x-auto border border-[rgba(212,175,55,0.2)]">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="border-b-2 border-[rgba(212,175,55,0.3)]">
                <th className="px-2 py-3 text-left text-[0.9rem] font-bold text-[var(--gold-accent)] min-w-[140px] whitespace-nowrap">Vehicle</th>
                <th className="px-2 py-3 text-center text-[0.9rem] font-bold text-[var(--gold-accent)] whitespace-nowrap">Passengers</th>
                <th className="px-2 py-3 text-center text-[0.9rem] font-bold text-[var(--gold-accent)] whitespace-nowrap">Bags</th>
                <th className="px-2 py-3 text-center text-[0.9rem] font-bold text-[var(--gold-accent)] whitespace-nowrap">Front Legroom</th>
                <th className="px-2 py-3 text-center text-[0.9rem] font-bold text-[var(--gold-accent)] whitespace-nowrap">Rear Legroom</th>
                <th className="px-2 py-3 text-center text-[0.9rem] font-bold text-[var(--gold-accent)] whitespace-nowrap">3rd Row</th>
                <th className="px-2 py-3 text-center text-[0.9rem] font-bold text-[var(--gold-accent)] whitespace-nowrap">Max Cargo</th>
                <th className="px-2 py-3 text-center text-[0.9rem] font-bold text-[var(--gold-accent)] whitespace-nowrap">Engine</th>
                <th className="px-2 py-3 text-center text-[0.9rem] font-bold text-[var(--gold-accent)] whitespace-nowrap">HP</th>
                <th className="px-2 py-3 text-center text-[0.9rem] font-bold text-[var(--gold-accent)] whitespace-nowrap">$/Mi</th>
                <th className="px-2 py-3 text-center text-[0.9rem] font-bold text-[var(--gold-accent)] w-[100px] whitespace-nowrap">Best For</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.name}
                  className={`transition-colors ${i % 2 === 0 ? "bg-[rgba(212,175,55,0.02)]" : ""}`}
                >
                  <td className="px-2 py-2.5 text-[0.9rem] text-left whitespace-nowrap">
                    <span className="text-[var(--gold-accent)] font-bold">{row.name}</span>
                    <br />
                    <span className="text-[var(--soft-gray)] text-[0.8rem] opacity-60">{row.category}</span>
                  </td>
                  <Cell highlight>{row.passengers}</Cell>
                  <Cell>{row.luggage}</Cell>
                  <Cell>{row.frontLegroom}</Cell>
                  <Cell>{row.rearLegroom}</Cell>
                  <Cell>{row.thirdRowLegroom ?? "N/A"}</Cell>
                  <Cell>{row.maxCargo}</Cell>
                  <Cell>{row.engine}</Cell>
                  <Cell highlight>{row.horsepower}</Cell>
                  <Cell highlight>${row.rate}</Cell>
                  <td className="px-2 py-2.5 text-[0.9rem] text-center border-b border-[rgba(212,175,55,0.15)]">
                    <div className="flex flex-wrap justify-center gap-1">
                      {row.recommendedFor.map((r) => (
                        <span key={r} className="bg-[rgba(212,175,55,0.15)] text-[var(--gold-accent)] text-[10px] rounded-full px-1.5 py-0.5 whitespace-nowrap">{r}</span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
