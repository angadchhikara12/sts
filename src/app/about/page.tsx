"use client"

import Link from "next/link"
import Navbar from "@/components/ui/Navbar"
import Footer from "@/components/Footer"
import { Shield, Clock, UserCheck, Car, Headphones, CheckCircle } from "lucide-react"

const values = [
  {
    icon: <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
    title: "Our Mission",
    description: "To provide unparalleled luxury transportation services that exceed expectations, ensuring every client experiences comfort, safety, and sophistication from pickup to destination.",
  },
  {
    icon: <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>,
    title: "Our Vision",
    description: "To be the most trusted and preferred luxury transportation provider, setting the standard for excellence in chauffeur services worldwide.",
  },
  {
    icon: <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>,
    title: "Our Values",
    description: "Excellence, integrity, reliability, and client satisfaction drive everything we do. We believe in treating every passenger like royalty.",
  },
]

const whyChooseUs = [
  { icon: Shield, title: "Unmatched Safety", description: "Our vehicles undergo rigorous inspections and our chauffeurs are trained in advanced safety protocols." },
  { icon: Clock, title: "Always On Time", description: "Punctuality is our promise. We monitor flights and traffic to ensure you're never kept waiting." },
  { icon: UserCheck, title: "Professional Chauffeurs", description: "Our chauffeurs are professionally trained, licensed, and dedicated to providing exceptional service." },
  { icon: Car, title: "Luxury Fleet", description: "From executive sedans to stretch limousines, our diverse fleet caters to every need and occasion." },
  { icon: Headphones, title: "24/7 Support", description: "Our dedicated support team is available around the clock to assist with any requests or changes." },
  { icon: CheckCircle, title: "Fully Insured", description: "Complete peace of mind with comprehensive insurance coverage for all passengers and vehicles." },
]

const team = [
  {
    name: "James Mitchell",
    role: "Founder & CEO",
    description: "With over 20 years in the transportation industry, James founded SAN Transportation Services with a vision for unmatched luxury service.",
  },
  {
    name: "Sarah Chen",
    role: "Operations Director",
    description: "Sarah ensures every ride runs smoothly, overseeing fleet operations and chauffeur training programs.",
  },
  {
    name: "Michael Torres",
    role: "Head of Client Relations",
    description: "Michael leads our client services team, ensuring every customer receives personalized attention.",
  },
  {
    name: "Emily Rodriguez",
    role: "Fleet Manager",
    description: "Emily maintains our fleet to the highest standards, ensuring every vehicle is pristine and performance-ready.",
  },
]

export default function AboutPage() {
  return (
    <div className="bg-[#0D0D0D] min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative py-[100px] bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--gold-accent)] to-transparent opacity-30" />
        <div className="max-w-6xl mx-auto px-5 relative z-[1]">
          <h1 className="text-white text-[clamp(2rem,4vw,3rem)] mb-4 font-[family-name:var(--font-playfair)]">
            About <span className="text-[var(--gold-accent)]">Us</span>
          </h1>
          <p className="text-[var(--soft-gray)] text-lg mt-4 max-w-2xl">
            Discover the story behind San Francisco&apos;s premier luxury transportation service and our commitment to excellence.
          </p>
          <div className="flex items-center gap-2 text-[var(--soft-gray)] text-[0.9rem] mt-4">
            <Link href="/" className="hover:text-[var(--gold-accent)] transition no-underline">Home</Link>
            <span>/</span>
            <span className="text-[var(--gold-accent)]">About</span>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-[100px] bg-[#0D0D0D]">
        <div className="max-w-[1400px] mx-auto px-5">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <span className="inline-block px-5 py-2 bg-[rgba(221,186,94,0.15)] border border-[var(--gold-accent)] text-[var(--gold-accent)] text-[0.85rem] tracking-[2px] uppercase mb-5 rounded-25px font-semibold">
                Our Story
              </span>
              <h2 className="text-white text-[clamp(2rem,4vw,3rem)] font-[family-name:var(--font-playfair)]">
                Founded in <span className="text-[var(--gold-accent)]">2010</span>
              </h2>
            </div>
            <div className="bg-[rgba(26,26,26,0.9)] backdrop-blur-[20px] rounded-[20px] border border-[rgba(212,175,55,0.2)] p-[40px]">
              <p className="text-[var(--soft-gray)] text-[1.05rem] leading-[1.9] mb-5">
                SAN Transportation Services began with a simple vision: to redefine luxury transportation in San Francisco. What started as a small fleet of three vehicles has grown into one of the most respected luxury transportation services in the Bay Area.
              </p>
              <p className="text-[var(--soft-gray)] text-[1.05rem] leading-[1.9] mb-5">
                Our founder, inspired by the elegance of European chauffeur services, set out to create an experience that combines world-class comfort with impeccable reliability.
              </p>
              <p className="text-[var(--soft-gray)] text-[1.05rem] leading-[1.9] mb-5">
                Over the years, we&apos;ve had the privilege of serving thousands of clients, from Fortune 500 executives to couples on their wedding day. Each journey has reinforced our commitment to excellence and our passion for creating memorable experiences.
              </p>
              <p className="text-[var(--soft-gray)] text-[1.05rem] leading-[1.9]">
                Today, SAN Transportation Services stands as a testament to what happens when luxury meets dedication. We continue to invest in our fleet, our people, and our technology to ensure every ride exceeds expectations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="py-[100px] bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D]">
        <div className="max-w-[1400px] mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7.5">
            {values.map((v) => (
              <div key={v.title} className="bg-[rgba(26,26,26,0.9)] backdrop-blur-[20px] rounded-[20px] border border-[rgba(212,175,55,0.2)] p-[35px] text-center transition-all duration-400 hover:border-[var(--gold-accent)] hover:-translate-y-1.5 group">
                <div className="w-16 h-16 mx-auto mb-5 bg-[rgba(212,175,55,0.1)] rounded-full flex items-center justify-center text-[var(--gold-accent)] transition-all duration-400 group-hover:bg-[var(--gold-accent)] group-hover:text-[#0D0D0D] group-hover:scale-110">
                  {v.icon}
                </div>
                <h3 className="text-white text-[1.3rem] mb-3 font-semibold">{v.title}</h3>
                <p className="text-[var(--soft-gray)] leading-[1.7] text-[0.95rem]">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-[100px] bg-[#0D0D0D]">
        <div className="max-w-[1400px] mx-auto px-5">
          <div className="text-center mb-12 max-w-[800px] mx-auto">
            <span className="inline-block px-5 py-2 bg-[rgba(221,186,94,0.15)] border border-[var(--gold-accent)] text-[var(--gold-accent)] text-[0.85rem] tracking-[2px] uppercase mb-5 rounded-25px font-semibold">
              Why Choose Us
            </span>
            <h2 className="text-white text-[clamp(2rem,4vw,3rem)] mb-3.5 font-[family-name:var(--font-playfair)]">
              Why Choose <span className="text-[var(--gold-accent)]">SAN Transportation</span>
            </h2>
            <p className="text-[var(--soft-gray)] text-[1.1rem] max-w-[600px] mx-auto">
              Experience the difference that sets us apart from the rest.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7.5">
            {whyChooseUs.map((item) => (
              <div key={item.title} className="bg-[rgba(26,26,26,0.9)] backdrop-blur-[20px] rounded-[20px] border border-[rgba(212,175,55,0.2)] p-[35px] transition-all duration-400 hover:border-[var(--gold-accent)] hover:-translate-y-1.5 group">
                <div className="w-14 h-14 mb-5 bg-gradient-to-br from-[var(--gold-accent)] to-[var(--gold-dark)] rounded-full flex items-center justify-center transition-transform duration-400 group-hover:scale-110">
                  <item.icon className="w-6 h-6 text-[#0D0D0D]" />
                </div>
                <h3 className="text-white text-[1.2rem] mb-2.5 font-semibold">{item.title}</h3>
                <p className="text-[var(--soft-gray)] leading-[1.7] text-[0.95rem]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="py-[100px] bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D]">
        <div className="max-w-[1400px] mx-auto px-5">
          <div className="text-center mb-12 max-w-[800px] mx-auto">
            <span className="inline-block px-5 py-2 bg-[rgba(221,186,94,0.15)] border border-[var(--gold-accent)] text-[var(--gold-accent)] text-[0.85rem] tracking-[2px] uppercase mb-5 rounded-25px font-semibold">
              Our Team
            </span>
            <h2 className="text-white text-[clamp(2rem,4vw,3rem)] mb-3.5 font-[family-name:var(--font-playfair)]">
              Meet Our <span className="text-[var(--gold-accent)]">Team</span>
            </h2>
            <p className="text-[var(--soft-gray)] text-[1.1rem] max-w-[600px] mx-auto">
              The dedicated professionals behind every exceptional journey.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7.5">
            {team.map((member) => (
              <div key={member.name} className="bg-[rgba(26,26,26,0.9)] backdrop-blur-[20px] rounded-[20px] border border-[rgba(212,175,55,0.2)] overflow-hidden transition-all duration-400 hover:border-[var(--gold-accent)] hover:-translate-y-1.5 group">
                {/* Placeholder avatar */}
                <div className="h-[220px] bg-gradient-to-br from-[rgba(212,175,55,0.1)] to-[rgba(212,175,55,0.05)] flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-[rgba(212,175,55,0.15)] border border-[rgba(212,175,55,0.3)] flex items-center justify-center">
                    <span className="text-[var(--gold-accent)] text-2xl font-[family-name:var(--font-playfair)] font-bold">
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                </div>
                <div className="p-[25px]">
                  <h3 className="text-white text-[1.1rem] mb-1 font-semibold">{member.name}</h3>
                  <p className="text-[var(--gold-accent)] text-[0.85rem] mb-3">{member.role}</p>
                  <p className="text-[var(--soft-gray)] text-[0.9rem] leading-[1.6]">{member.description}</p>
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
            Ready to Experience the <span className="text-[var(--gold-accent)]">Difference</span>?
          </h2>
          <p className="text-[var(--soft-gray)] text-[1.2rem] mb-10 max-w-[600px] mx-auto leading-[1.6]">
            Join thousands of satisfied clients who trust SAN Transportation Services for their luxury transportation needs.
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
