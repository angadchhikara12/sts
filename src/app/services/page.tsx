"use client"

import Link from "next/link"
import Navbar from "@/components/ui/Navbar"
import Footer from "@/components/Footer"
import { Check } from "lucide-react"

const services = [
  {
    title: "Airport Transfers",
    description:
      "Professional airport pickup and drop-off with flight tracking. Experience stress-free airport transportation with our premium transfer services. We track your flight in real-time to ensure perfect timing, whether you're arriving or departing.",
    features: [
      "Real-time flight tracking",
      "Meet & greet service available",
      "24/7 availability",
      "Complimentary wait time",
    ],
    videoSrc: "https://cdn.sants.us/airport-services.mp4",

  },
  {
    title: "Point-to-Point Transportation",
    description:
      "Direct, efficient transportation between any two locations. Whether you need to get across town or across the state, our point-to-point service provides reliable, luxury transportation with no hidden fees.",
    features: [
      "Direct door-to-door service",
      "All-inclusive rates",
      "No hidden fees",
      "Professional chauffeurs",
    ],
    videoSrc: "https://cdn.sants.us/point-to-point.mp4",

  },
  {
    title: "Hourly Chauffeur Service",
    description:
      "Flexible hourly chauffeur service for your convenience. Perfect for business meetings, shopping trips, city tours, or any occasion where you need a professional driver on standby for as long as you need.",
    features: [
      "Flexible booking options",
      "Multiple stops included",
      "Wait time included",
      "Luxury vehicle of your choice",
    ],
    videoSrc: "https://cdn.sants.us/professional-chaffauer-services.mp4",

  },
  {
    title: "Wine Tour Transportation",
    description:
      "Explore the finest wineries in luxury and comfort. Our wine tour transportation provides a sophisticated experience for wine enthusiasts with professional chauffeurs who know the best routes and hidden gems.",
    features: [
      "Curated wine tour itineraries",
      "Luxury vehicle accommodations",
      "Flexible scheduling",
      "Group packages available",
    ],
    videoSrc: "https://cdn.sants.us/winery-services-video.mp4",

  },
  {
    title: "Special Events & Celebrations",
    description:
      "Make your special occasions unforgettable with our premium event transportation. From weddings to anniversaries, proms to red carpet events, we provide elegant transportation that matches the significance of your celebration.",
    features: [
      "Wedding transportation",
      "Anniversary & birthday celebrations",
      "Prom & graduation events",
      "Red carpet service available",
    ],
    videoSrc: "https://cdn.sants.us/special-event-services.mp4",

  },
  {
    title: "City Tour Limousine Service",
    description:
      "Explore the city in style with our guided city tour service. See the sights, landmarks, and hidden gems from the comfort of a luxury vehicle with a knowledgeable chauffeur who knows every corner of the city.",
    features: [
      "Customizable tour routes",
      "Knowledgeable chauffeur guides",
      "Photo stop opportunities",
      "Half-day and full-day options",
    ],
    videoSrc: "https://cdn.sants.us/city-tour.mp4",

  },
  {
    title: "Corporate Transportation",
    description:
      "Elevate your business travel with our executive transportation services. Perfect for client meetings, conferences, and corporate events that demand professionalism, discretion, and impeccable punctuality.",
    features: [
      "Executive vehicle fleet",
      "Professional chauffeurs",
      "Corporate account management",
      "Confidential and discreet service",
    ],
    videoSrc: "https://cdn.sants.us/corporate.mp4",

  },
  {
    title: "Professional Chauffeur Services",
    description:
      "Experience the pinnacle of luxury transportation with our professional chauffeur services. Our highly trained chauffeurs deliver a first-class experience with discretion and attention to detail that exceeds expectations.",
    features: [
      "Professionally trained & licensed",
      "Immaculate presentation & etiquette",
      "Local area expertise & navigation",
      "Discreet & confidential service",
    ],
    videoSrc: "https://cdn.sants.us/professional-chaffauer-services.mp4",

  },
  {
    title: "Casino Transportation",
    description:
      "Turn every casino visit into a first-class experience. Our premium limo service offers seamless, comfortable, and stylish transportation to the most popular casinos across California, with round-trip convenience.",
    features: [
      "Round-trip casino transportation",
      "Luxury fleet available 24/7",
      "Professional & discreet chauffeurs",
      "Group packages for casino outings",
    ],
    videoSrc: "https://cdn.sants.us/casino-services.mp4",

  },
]

export default function ServicesPage() {
  return (
    <div className="bg-[#0D0D0D] min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative py-[100px] bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--gold-accent)] to-transparent opacity-30" />
        <div className="max-w-6xl mx-auto px-5 relative z-[1]">
          <h1 className="text-white text-[clamp(2rem,4vw,3rem)] mb-4 font-[family-name:var(--font-playfair)]">
            Our <span className="text-[var(--gold-accent)]">Services</span>
          </h1>
          <p className="text-[var(--soft-gray)] text-lg mt-4 max-w-2xl">
            Premium chauffeur services tailored to meet your every transportation need with elegance and professionalism.
          </p>
          <div className="flex items-center gap-2 text-[var(--soft-gray)] text-[0.9rem] mt-4">
            <Link href="/" className="hover:text-[var(--gold-accent)] transition no-underline">Home</Link>
            <span>/</span>
            <span className="text-[var(--gold-accent)]">Services</span>
          </div>
        </div>
      </section>

      {/* Service Sections */}
      {services.map((service, i) => {
        const isReversed = i % 2 !== 0
        return (
          <section
            key={service.title}
            className={`relative py-[100px] overflow-hidden ${
              i % 2 === 0 ? "bg-[#0D0D0D]" : "bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D]"
            }`}
          >
            {/* Subtle separator line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--gold-accent)] to-transparent opacity-20" />

            <div className={`max-w-[1400px] mx-auto px-5 flex flex-col ${isReversed ? "lg:flex-row-reverse" : "lg:flex-row"} gap-12.5 items-center`}>
              {/* Video */}
              <div className="w-full lg:w-1/2 relative">
                <div className="relative aspect-video rounded-[20px] overflow-hidden border border-[rgba(212,175,55,0.2)] bg-[rgba(26,26,26,0.9)]">
                  {service.videoSrc ? (
                    <video
                      src={service.videoSrc}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center min-h-[300px]">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.3)] flex items-center justify-center">
                          <svg className="w-7 h-7 text-[var(--gold-accent)]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                        <p className="text-[var(--soft-gray)] text-[0.9rem]">{service.title}</p>
                        <p className="text-[var(--soft-gray)] text-[0.75rem] opacity-50 mt-1">Video coming soon</p>
                      </div>
                    </div>
                  )}
                  {/* Gold corner accent */}
                  <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[var(--gold-accent)] rounded-tl-[20px] opacity-40 pointer-events-none" />
                  <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[var(--gold-accent)] rounded-br-[20px] opacity-40 pointer-events-none" />
                </div>
              </div>

              {/* Content */}
              <div className="w-full lg:w-1/2 flex flex-col gap-6">
                <div className="inline-flex items-center gap-2.5 self-start">
                  <span className="text-[0.75rem] text-[var(--gold-accent)] tracking-[3px] uppercase font-medium">
                    0{i + 1}
                  </span>
                  <span className="w-10 h-px bg-[var(--gold-accent)]" />
                  <span className="text-[0.75rem] text-[var(--soft-gray)] tracking-[2px] uppercase">
                    Service
                  </span>
                </div>

                <h2 className="text-white text-[clamp(1.8rem,3vw,2.5rem)] leading-[1.2] font-[family-name:var(--font-playfair)]">
                  {service.title}
                </h2>

                <p className="text-[var(--soft-gray)] text-[1.05rem] leading-[1.8]">
                  {service.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  {service.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2.5 text-[var(--soft-gray)] text-[0.9rem]">
                      <div className="w-5 h-5 rounded-full bg-[rgba(212,175,55,0.15)] flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-[var(--gold-accent)]" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <Link href="/book" className="self-start mt-3">
                  <span className="inline-flex items-center gap-2.5 px-7 py-3.5 text-[0.85rem] font-semibold tracking-[1px] uppercase rounded-lg bg-gradient-to-br from-[var(--gold-accent)] to-[var(--gold-dark)] text-[#0D0D0D] no-underline transition-all duration-400 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(212,175,55,0.4)]">
                    Book {service.title}
                  </span>
                </Link>
              </div>
            </div>
          </section>
        )
      })}

      {/* CTA Banner */}
      <section className="relative py-[100px] bg-gradient-to-br from-[rgba(212,175,55,0.1)] to-[rgba(212,175,55,0.05)] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="max-w-4xl mx-auto px-5 text-center relative z-[1]">
          <h2 className="text-white text-[clamp(2rem,4vw,3rem)] mb-5 font-[family-name:var(--font-playfair)]">
            Ready to Experience <span className="text-[var(--gold-accent)]">Excellence</span>?
          </h2>
          <p className="text-[var(--soft-gray)] text-[1.2rem] mb-10 max-w-[600px] mx-auto leading-[1.6]">
            Contact us today to discuss your transportation needs and receive a personalized quote.
          </p>
          <Link href="/book">
            <span className="inline-flex items-center gap-2.5 px-11 py-[18px] text-[1.1rem] font-semibold tracking-[1px] rounded-lg bg-gradient-to-br from-[var(--gold-accent)] to-[var(--gold-dark)] text-[#0D0D0D] no-underline transition-all duration-400 shadow-[0_10px_30px_rgba(212,175,55,0.3)] hover:-translate-y-[3px] hover:shadow-[0_15px_40px_rgba(212,175,55,0.4)]">
              Book Your Service
            </span>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
