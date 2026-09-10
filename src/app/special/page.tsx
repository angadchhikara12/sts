"use client"

import Link from "next/link"
import Navbar from "@/components/ui/Navbar"
import Footer from "@/components/Footer"
import { Gift, Users, Star, Calendar } from "lucide-react"

const specials = [
  {
    icon: Gift,
    title: "Loyalty Program",
    description:
      "Receive a free ride to or from the airport after you complete 10 trips with us. We will automatically credit eligible trips — no need to enroll.",
    highlight: "10 Trips = Free Ride",
  },
  {
    icon: Users,
    title: "Referral Reward",
    description:
      "Refer a friend for 50% off your next trip within a 20 mi radius within San Francisco, and receive an additional free ride to/from the airport once your referral completes 3 rides with us.",
    highlight: "50% Off + Free Ride",
  },
  {
    icon: Star,
    title: "Social Media Promo",
    description:
      "Leave a review and we will apply a 30% reward toward your next ride.",
    highlight: "30% Off Next Ride",
  },
  {
    icon: Calendar,
    title: "Multiday Special",
    description:
      "Book multiple days and enjoy premium service with dedicated vehicle and chauffeur.",
    highlight: "Premium Service",
  },
]

export default function SpecialPage() {
  return (
    <div className="bg-[#0D0D0D] min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative py-[100px] bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--gold-accent)] to-transparent opacity-30" />
        <div className="max-w-6xl mx-auto px-5 relative z-[1]">
          <h1 className="text-white text-[clamp(2rem,4vw,3rem)] mb-4 font-[family-name:var(--font-playfair)]">
            Special <span className="text-[var(--gold-accent)]">Offers</span>
          </h1>
          <p className="text-[var(--soft-gray)] text-lg mt-4 max-w-2xl">
            Exclusive rewards and promotions for our valued customers. Save more with every ride.
          </p>
          <div className="flex items-center gap-2 text-[var(--soft-gray)] text-[0.9rem] mt-4">
            <Link href="/" className="hover:text-[var(--gold-accent)] transition no-underline">Home</Link>
            <span>/</span>
            <span className="text-[var(--gold-accent)]">Special Offers</span>
          </div>
        </div>
      </section>

      {/* Specials Grid */}
      <section className="py-[100px] bg-[#0D0D0D]">
        <div className="max-w-[1400px] mx-auto px-5">
          <div className="text-center mb-12 max-w-[800px] mx-auto">
            <span className="inline-block px-5 py-2 bg-[rgba(221,186,94,0.15)] border border-[var(--gold-accent)] text-[var(--gold-accent)] text-[0.85rem] tracking-[2px] uppercase mb-5 rounded-25px font-semibold">
              Exclusive Deals & Rewards
            </span>
            <h2 className="text-white text-[clamp(2rem,4vw,3rem)] mb-3.5 font-[family-name:var(--font-playfair)]">
              Take advantage of our <span className="text-[var(--gold-accent)]">special programs</span>
            </h2>
            <p className="text-[var(--soft-gray)] text-[1.1rem] max-w-[600px] mx-auto">
              Save on every luxury ride with our exclusive rewards and promotions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7.5">
            {specials.map((special) => (
              <div
                key={special.title}
                className="bg-[rgba(26,26,26,0.9)] backdrop-blur-[20px] rounded-[20px] border border-[rgba(212,175,55,0.2)] overflow-hidden transition-all duration-400 hover:border-[var(--gold-accent)] hover:-translate-y-1.5 group"
              >
                <div className="p-[35px]">
                  <div className="flex items-start gap-5 mb-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-[var(--gold-accent)] to-[var(--gold-dark)] rounded-full flex items-center justify-center shrink-0 transition-transform duration-400 group-hover:scale-110">
                      <special.icon className="w-6 h-6 text-[#0D0D0D]" />
                    </div>
                    <div>
                      <h3 className="text-white text-[1.4rem] mb-2 font-semibold">{special.title}</h3>
                      <p className="text-[var(--soft-gray)] leading-[1.7] text-[0.95rem]">{special.description}</p>
                    </div>
                  </div>
                  <div className="ml-[76px] inline-flex items-center gap-2 px-4 py-2 bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.3)] rounded-lg">
                    <span className="text-[var(--gold-accent)] font-bold text-[0.95rem]">{special.highlight}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative py-[100px] bg-gradient-to-br from-[rgba(212,175,55,0.1)] to-[rgba(212,175,55,0.05)] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="max-w-4xl mx-auto px-5 text-center relative z-[1]">
          <h2 className="text-white text-[clamp(2rem,4vw,3rem)] mb-5 font-[family-name:var(--font-playfair)]">
            Ready to <span className="text-[var(--gold-accent)]">Book</span>?
          </h2>
          <p className="text-[var(--soft-gray)] text-[1.2rem] mb-10 max-w-[600px] mx-auto leading-[1.6]">
            Book your next luxury ride and take advantage of our exclusive special offers.
          </p>
          <Link href="/book">
            <span className="inline-flex items-center gap-2.5 px-11 py-[18px] text-[1.1rem] font-semibold tracking-[1px] rounded-lg bg-gradient-to-br from-[var(--gold-accent)] to-[var(--gold-dark)] text-[#0D0D0D] no-underline transition-all duration-400 shadow-[0_10px_30px_rgba(212,175,55,0.3)] hover:-translate-y-[3px] hover:shadow-[0_15px_40px_rgba(212,175,55,0.4)]">
              Book Your Ride
            </span>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
