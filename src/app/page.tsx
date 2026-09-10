"use client"
import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/ui/Navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowRight, Car, Check, ChevronDown, Clock, Plane, Search, Shield, Quote, Star } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { TimePicker } from "@/components/ui/time-picker";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import FleetSection from "@/components/FleetSection"
import Footer from "@/components/Footer"

function CountUp({ target, suffix = "", duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          function tick(now: number) {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * target))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

const testimonials = [
  {
    name: "James Mitchell",
    role: "CEO, Mitchell & Partners",
    quote: "Absolutely exceptional service. Our executive team was picked up in a pristine Escalade and treated like royalty. This is the only car service we use now.",
    rating: 5,
  },
  {
    name: "Sarah Chen",
    role: "Event Planner, Luxe Events",
    quote: "I've booked SAN Transport for over 30 weddings and every single bride and groom has been thrilled. The attention to detail and punctuality is unmatched.",
    rating: 5,
  },
  {
    name: "David Ramirez",
    role: "Frequent Flyer",
    quote: "After a 14-hour flight, having a chauffeur waiting with a name card and cold water made all the difference. Reliable, professional, and worth every penny.",
    rating: 5,
  },
  {
    name: "Emily Tanaka",
    role: "Marketing Director, TechFlow Inc.",
    quote: "We use SAN Transport for all our VIP client transfers. The BMW 7 Series is always immaculate and our clients are consistently impressed. Highly recommended.",
    rating: 5,
  },
  {
    name: "Robert Greene",
    role: "Real Estate Agent, Berkshire Hathaway",
    quote: "First impressions matter in real estate. Arriving to property showings in a luxury vehicle from SAN Transport has directly helped me close more deals.",
    rating: 5,
  },
  {
    name: "Maria Santos",
    role: "Mother of Three",
    quote: "The Navigator L was perfect for our family vacation to LAX. Plenty of room for the kids and all our luggage. The driver was patient and so friendly.",
    rating: 5,
  },
]

const features = [
  { icon: <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 448 512"><path d="M224 0c-17.7 0-32 14.3-32 32V51.2C119.1 62.8 64 130.6 64 213.3V448c0 35.3 28.7 64 64 64h96c35.3 0 64-28.7 64-64V213.3c0-82.7-55.1-150.5-128-162.1V32c0-17.7-14.3-32-32-32zm45.3 493.3c12.5 12.5 32.8 12.5 45.3 0l96-96c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 394.7V288H96c-17.7 0-32-14.3-32-32V213.3c0-30 16.6-57.6 43.4-71.8 10.5-5.6 22.5-8.5 34.6-8.5h10.7c12.3 0 24.1 2.1 35.2 6.2l32 11.6c20.3 7.4 42.7 7.4 63 0l32-11.6c11.1-4 22.9-6.2 35.2-6.2h10.7c12.1 0 24.1 2.9 34.6 8.5C271.4 157.7 288 185.3 288 215.3V256c0 17.7-14.3 32-32 32h160v106.7l-45.3 45.3z"/></svg>, title: "Professional Chauffeurs", desc: "Highly trained, licensed professionals dedicated to your safety and comfort." },
  { icon: <Car className="w-8 h-8" />, title: "Luxury Fleet", desc: "Premium vehicles maintained to the highest standards of luxury and safety." },
  { icon: <Clock className="w-8 h-8" />, title: "24/7 Availability", desc: "Round-the-clock service for all your transportation needs, any time, any day." },
  { icon: <Check className="w-8 h-8" />, title: "On-Time Guarantee", desc: "Punctuality is our promise. We ensure you arrive on time, every time." },
  { icon: <Plane className="w-8 h-8" />, title: "Airport Specialists", desc: "Expert airport transfer services with flight tracking and meet & greet options." },
  { icon: <Shield className="w-8 h-8" />, title: "Safe & Secure", desc: "Your safety is paramount. Fully insured vehicles with advanced safety features." },
]

export default function Home() {
  const [passengers, setPassengers] = useState("Select Passengers");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState('Select Time');
  const [vehicleType, setVehicleType] = useState('Select Vehicle');

  return (
    <div className="bg-[#0D0D0D] min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full h-screen bg-[#0D0D0D] overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: "url('/logo.jpeg')", backgroundPosition: "center 55%" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0D]/15 via-[#0D0D0D]/20 to-[#0D0D0D]/70 z-[2]" />
        <div className="relative z-[3] text-center max-w-[700px] w-[calc(100%-160px)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="inline-block px-4 py-1.5 border border-[var(--gold-accent)] text-[var(--gold-accent)] text-[0.65rem] tracking-[3px] uppercase mb-5 font-medium backdrop-blur-[10px] bg-[rgba(221,186,94,0.08)]">
            Luxury Transportation
          </div>
          <h1 className="text-white text-[clamp(1.8rem,4vw,3rem)] mb-3.5 leading-[1.2] font-bold tracking-[-0.5px] font-[family-name:var(--font-playfair)]">
            Luxury Limo & Black Car <br />Service Across <span className="text-[var(--gold-accent)]">California</span>
          </h1>
          <p className="text-[var(--soft-gray)] text-[clamp(0.85rem,1.2vw,1rem)] max-w-[480px] mx-auto mb-7 font-light leading-relaxed">
            Premium chauffeur services for airport transfers, corporate travel, weddings, and special events across California.
          </p>
          <div className="flex gap-3.5 justify-center flex-wrap items-center">
            <Link href="/fleet">
              <span className="inline-flex items-center gap-2.5 px-6 py-3 text-[0.8rem] font-semibold tracking-[1px] uppercase rounded-lg bg-gradient-to-br from-[var(--gold-accent)] to-[var(--gold-dark)] text-[#0D0D0D] no-underline transition-all duration-400 hover:shadow-[0_4px_15px_rgba(212,175,55,0.3)]">
                Explore Fleet <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
            <Link href="/book">
              <span className="inline-flex items-center gap-2.5 px-6 py-3 text-[0.8rem] font-semibold tracking-[1px] uppercase rounded-lg border-2 border-[var(--gold-accent)] text-white bg-transparent no-underline transition-all duration-400 hover:bg-[var(--gold-accent)]/10">
                Book Now
              </span>
            </Link>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[3] flex items-center gap-2 animate-[fadeInUp_1s_ease_1.5s_both]">
          <span className="text-[0.7rem] text-[var(--soft-gray)] uppercase tracking-[2px]">Scroll to Explore</span>
          <ChevronDown className="w-3.5 h-3.5 text-[var(--gold-accent)] animate-bounce" />
        </div>
      </section>

      {/* Quick Booking Section */}
      <section className="relative py-[120px] bg-gradient-to-br from-[#0D0D0D] to-[#1A1A1A] overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--gold-accent)] to-transparent opacity-50" />
        <div className="max-w-[1400px] mx-auto px-5 relative z-[1]">
          <h2 className="text-white text-center text-[clamp(2rem,4vw,3rem)] mb-10 font-[family-name:var(--font-playfair)]">
            Quick <span className="text-[var(--gold-accent)]">Booking</span>
          </h2>
          <div className="bg-[rgba(26,26,26,0.95)] backdrop-blur-[30px] rounded-[25px] p-[50px] border border-[rgba(212,175,55,0.2)] shadow-[0_20px_60px_rgba(0,0,0,0.4)] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--gold-accent)] via-[var(--gold-light)] to-[var(--gold-accent)] opacity-80" />
            <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2.5">
                <label className="text-[var(--soft-gray)] text-[0.9rem] font-medium uppercase tracking-[1px]">Pickup Address</label>
                <Input className="w-full h-16 bg-[rgba(13,13,13,0.8)] border-2 border-[rgba(212,175,55,0.2)] rounded-[15px] text-white text-[1.05rem] px-6 py-5 ring-0! outline-none! placeholder:text-[var(--soft-gray)]! backdrop-blur-[10px] transition-all duration-400 focus:border-[var(--gold-accent)]! focus:bg-[rgba(13,13,13,0.95)]! focus:shadow-[0_0_0_4px_rgba(212,175,55,0.2)]! focus:-translate-y-0.5!" placeholder="Enter pickup location" />
              </div>
              <div className="flex flex-col gap-2.5">
                <label className="text-[var(--soft-gray)] text-[0.9rem] font-medium uppercase tracking-[1px]">Dropoff Address</label>
                <Input className="w-full h-16 bg-[rgba(13,13,13,0.8)] border-2 border-[rgba(212,175,55,0.2)] rounded-[15px] text-white text-[1.05rem] px-6 py-5 ring-0! outline-none! placeholder:text-[var(--soft-gray)]! backdrop-blur-[10px] transition-all duration-400 focus:border-[var(--gold-accent)]! focus:bg-[rgba(13,13,13,0.95)]! focus:shadow-[0_0_0_4px_rgba(212,175,55,0.2)]! focus:-translate-y-0.5!" placeholder="Enter dropoff location" />
              </div>
              <div className="flex flex-col gap-2.5">
                <label className="text-[var(--soft-gray)] text-[0.9rem] font-medium uppercase tracking-[1px]">Date</label>
                <Popover>
                  <PopoverTrigger render={<Button data-empty={!date} className="w-full h-16 bg-[rgba(13,13,13,0.8)] border-2 border-[rgba(212,175,55,0.2)] rounded-[15px] text-white text-[1.05rem] px-6 py-5 ring-0! outline-none! justify-between text-left data-[empty=true]:text-[var(--soft-gray)] backdrop-blur-[10px] transition-all duration-400 focus:border-[var(--gold-accent)]! focus:bg-[rgba(13,13,13,0.95)]! focus:shadow-[0_0_0_4px_rgba(212,175,55,0.2)]!">{date ? format(date, "PPP") : "Select Date"}<ChevronDown data-icon="inline-end" className="text-[var(--gold-accent)]" /></Button>} />
                  <PopoverContent className="w-auto p-0 bg-[#0D0D0D] border-2 border-[var(--gold-accent)] text-white" align="start">
                    <Calendar mode="single" selected={date} onSelect={setDate} defaultMonth={date} />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex flex-col gap-2.5">
                <label className="text-[var(--soft-gray)] text-[0.9rem] font-medium uppercase tracking-[1px]">Time</label>
                <Popover>
                  <PopoverTrigger render={<Button className="w-full h-16 bg-[rgba(13,13,13,0.8)] border-2 border-[rgba(212,175,55,0.2)] rounded-[15px] text-white text-[1.05rem] px-6 py-5 ring-0! outline-none! justify-between text-left flex backdrop-blur-[10px] transition-all duration-400 focus:border-[var(--gold-accent)]! focus:bg-[rgba(13,13,13,0.95)]! focus:shadow-[0_0_0_4px_rgba(212,175,55,0.2)]!">{time}<ChevronDown data-icon="inline-end" className="text-[var(--gold-accent)]" /></Button>} />
                  <PopoverContent className="w-auto p-4 bg-[#0D0D0D] border-2 border-[var(--gold-accent)] text-white" align="start">
                    <TimePicker value={time} onChange={setTime} />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex flex-col gap-2.5">
                <label className="text-[var(--soft-gray)] text-[0.9rem] font-medium uppercase tracking-[1px]">Passengers</label>
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button type="button" className="w-full h-16 bg-[rgba(13,13,13,0.8)] border-2 border-[rgba(212,175,55,0.2)] rounded-[15px] text-white text-[1.05rem] px-6 py-5 ring-0 outline-none justify-between text-left flex backdrop-blur-[10px] transition-all duration-400 focus:border-[var(--gold-accent)]! focus:bg-[rgba(13,13,13,0.95)]! focus:shadow-[0_0_0_4px_rgba(212,175,55,0.2)]!" />}>{passengers}<ChevronDown data-icon="inline-end" className="text-[var(--gold-accent)]" /></DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#1A1A1A] text-white border-2 border-[var(--gold-accent)]">
                    <DropdownMenuItem onClick={() => setPassengers("1 Passenger")}>1 Passenger</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPassengers("2 Passengers")}>2 Passengers</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPassengers("3 Passengers")}>3 Passengers</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPassengers("4 Passengers")}>4 Passengers</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPassengers("5 Passengers")}>5 Passengers</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPassengers("6 Passengers")}>6 Passengers</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPassengers("6+ Passengers")}>6+ Passengers</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex flex-col gap-2.5">
                <label className="text-[var(--soft-gray)] text-[0.9rem] font-medium uppercase tracking-[1px]">Vehicle Type</label>
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button type="button" className="w-full h-16 bg-[rgba(13,13,13,0.8)] border-2 border-[rgba(212,175,55,0.2)] rounded-[15px] text-white text-[1.05rem] px-6 py-5 ring-0 outline-none justify-between text-left flex backdrop-blur-[10px] transition-all duration-400 focus:border-[var(--gold-accent)]! focus:bg-[rgba(13,13,13,0.95)]! focus:shadow-[0_0_0_4px_rgba(212,175,55,0.2)]!" />}>{vehicleType}<ChevronDown data-icon="inline-end" className="text-[var(--gold-accent)]" /></DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#1A1A1A] text-white border-2 border-[var(--gold-accent)]">
                    <DropdownMenuItem onClick={() => setVehicleType("Sedan")}>Sedan</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setVehicleType("SUV")}>SUV</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setVehicleType("Stretch Limo")}>Stretch Limo</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setVehicleType("Executive")}>Executive</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setVehicleType("Exclusive")}>Exclusive</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="col-span-full flex justify-center mt-5">
                <Button type="submit" variant="gold" className="min-w-[220px] h-[56px] text-[0.95rem] px-9 py-4 rounded-[6px] cursor-pointer">
                  <Search className="w-4 h-4" /> Check Availability
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="relative py-[100px] bg-[#1A1A1A]">
        <div className="max-w-[1400px] mx-auto px-5">
          <div className="text-center mb-[60px] max-w-[800px] mx-auto">
            <span className="inline-block px-5 py-2 bg-[rgba(221,186,94,0.15)] border border-[var(--gold-accent)] text-[var(--gold-accent)] text-[0.85rem] tracking-[2px] uppercase mb-5 rounded-25px font-semibold">
              Why Choose Us
            </span>
            <h2 className="text-white text-[clamp(2.5rem,5vw,3.5rem)] mb-5 font-[family-name:var(--font-playfair)]">
              Experience the <span className="text-[var(--gold-accent)]">Difference</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((f) => (
              <div key={f.title} className="bg-[#0D0D0D] py-10 px-7.5 rounded-xl text-center border border-[rgba(212,175,55,0.1)] transition-[all_0.4s_cubic-bezier(0.4,0,0.2,1)] relative overflow-hidden group hover:border-[var(--gold-accent)] hover:-translate-y-2.5">
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[var(--gold-accent)] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-[rgba(212,175,55,0.1)] rounded-full text-[var(--gold-accent)] transition-[all_0.4s_cubic-bezier(0.4,0,0.2,1)] group-hover:bg-[var(--gold-accent)] group-hover:text-[#0D0D0D] group-hover:scale-110">
                  {f.icon}
                </div>
                <h3 className="text-white text-[1.4rem] mb-3.5">{f.title}</h3>
                <p className="text-[var(--soft-gray)] leading-[1.7]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#0D0D0D] to-[#1A1A1A] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(212,175,55,0.05)_0%,transparent_50%),radial-gradient(circle_at_80%_50%,rgba(212,175,55,0.05)_0%,transparent_50%)] pointer-events-none" />
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-10 relative z-[1]">
          {[
            { target: 10, suffix: "+", label: "Years Experience" },
            { target: 5000, suffix: "+", label: "Happy Clients", duration: 2500 },
            { target: 50, suffix: "+", label: "Luxury Vehicles" },
            { target: 24, suffix: "/7", label: "Customer Support" },
          ].map((s) => (
            <div key={s.label} className="text-center py-10 px-5 bg-[rgba(255,255,255,0.02)] rounded-[20px] border border-[rgba(212,175,55,0.1)] relative overflow-hidden transition-all duration-400 hover:-translate-y-2.5 hover:bg-[rgba(255,255,255,0.05)] hover:border-[rgba(212,175,55,0.3)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] group">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[var(--gold-accent)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-[var(--gold-accent)] text-[clamp(3rem,5vw,4.5rem)] font-bold mb-3.5 leading-none font-[family-name:var(--font-playfair)]">
                <CountUp target={s.target} suffix={s.suffix} duration={s.duration} />
              </div>
              <div className="text-[var(--soft-gray)] text-[1.1rem] font-medium tracking-[1px] uppercase">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-[100px] bg-[#0D0D0D]">
        <div className="max-w-[1400px] mx-auto px-5">
          <div className="text-center mb-[60px] max-w-[800px] mx-auto">
            <span className="inline-block px-5 py-2 bg-[rgba(221,186,94,0.15)] border border-[var(--gold-accent)] text-[var(--gold-accent)] text-[0.85rem] tracking-[2px] uppercase mb-5 rounded-25px font-semibold">
              Testimonials
            </span>
            <h2 className="text-white text-[clamp(2rem,4vw,3rem)] mb-3.5 font-[family-name:var(--font-playfair)]">
              What Our <span className="text-[var(--gold-accent)]">Clients</span> Say
            </h2>
            <p className="text-[var(--soft-gray)] text-[1.1rem] max-w-[600px] mx-auto">
              Trusted by hundreds of satisfied clients across California for premium transportation services.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7.5">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-[#1A1A1A] p-[35px] rounded-[15px] border border-[rgba(212,175,55,0.1)] relative transition-[all_0.4s_cubic-bezier(0.4,0,0.2,1)] hover:border-[var(--gold-accent)] hover:-translate-y-1.5">
                <div className="absolute top-5 left-6 text-[4rem] text-[var(--gold-accent)] opacity-20 font-[family-name:var(--font-playfair)] leading-none">&ldquo;</div>
                <p className="text-white italic leading-[1.7] mb-6 relative z-[1] text-[0.95rem]">{t.quote}</p>
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[var(--gold-accent)] text-[var(--gold-accent)]" />
                  ))}
                </div>
                <div className="flex items-center gap-3.5">
                  <div>
                    <h4 className="text-white mb-1">{t.name}</h4>
                    <p className="text-[var(--gold-accent)] text-[0.9rem]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Fleet */}
      <FleetSection />

      {/* CTA Banner */}
      <section className="relative py-[100px] bg-gradient-to-br from-[rgba(212,175,55,0.1)] to-[rgba(212,175,55,0.05)] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="max-w-4xl mx-auto px-5 text-center relative z-[1]">
          <h2 className="text-white text-[clamp(2.5rem,5vw,4rem)] mb-6 leading-[1.2] font-[family-name:var(--font-playfair)]">
            Ready to Experience <span className="text-[var(--gold-accent)] relative">Excellence<span className="absolute bottom-[-5px] left-0 w-full h-[2px] bg-[var(--gold-accent)] opacity-50" /></span>?
          </h2>
          <p className="text-[var(--soft-gray)] text-[1.2rem] mb-10 max-w-[600px] mx-auto leading-[1.6]">
            Book your luxury ride today and discover the difference that premium service makes.
          </p>
          <Link href="/book">
            <span className="inline-flex items-center gap-2.5 px-11 py-[18px] text-[1.1rem] font-semibold tracking-[1px] rounded-lg bg-gradient-to-br from-[var(--gold-accent)] to-[var(--gold-dark)] text-[#0D0D0D] no-underline transition-all duration-400 shadow-[0_10px_30px_rgba(212,175,55,0.3)] hover:-translate-y-[3px] hover:shadow-[0_15px_40px_rgba(212,175,55,0.4)]">
              <Car className="w-5 h-5" /> Reserve Your Ride
            </span>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
