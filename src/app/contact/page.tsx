"use client"

import { useState } from "react"
import Link from "next/link"
import Navbar from "@/components/ui/Navbar"
import Footer from "@/components/Footer"
import { MapPin, Phone, Mail, Clock, ChevronDown, CheckCircle } from "lucide-react"

const contactInfo = [
  { icon: MapPin, label: "Our Location", value: "California" },
  { icon: Phone, label: "Phone Number", value: "+1 (234) 567-9992", href: "tel:+12345679992" },
  { icon: Mail, label: "Email Address", value: "info@sants.us", href: "mailto:info@sants.us" },
  { icon: Clock, label: "Working Hours", value: "24/7 Customer Support", sub: "Reservations Available Anytime" },
]

const subjects = [
  "Booking Inquiry",
  "Request a Quote",
  "Corporate Account",
  "Feedback",
  "Complaint",
  "Other",
]

const faqs = [
  {
    q: "How far in advance should I book?",
    a: "We recommend booking at least 24-48 hours in advance to ensure vehicle availability. However, we do accommodate same-day requests based on fleet availability.",
  },
  {
    q: "What is your cancellation policy?",
    a: "Cancellations made 24 hours or more before the scheduled pickup receive a full refund. Cancellations within 24 hours may be subject to a cancellation fee.",
  },
  {
    q: "Do you offer corporate accounts?",
    a: "Yes, we offer corporate account management with dedicated support, monthly billing, and customized solutions for businesses of all sizes.",
  },
  {
    q: "Are your chauffeurs professionally trained?",
    a: "Absolutely. All our chauffeurs undergo extensive training, background checks, and hold professional licenses. They're trained in defensive driving, customer service, and safety protocols.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards (Visa, MasterCard, American Express, Discover), corporate accounts, and bank transfers. Cash payments can be arranged upon request.",
  },
  {
    q: "Do you provide child seats?",
    a: "Yes, we provide child seats and booster seats upon request at no additional charge. Please specify the age and weight of the child when booking to ensure the appropriate seat is provided.",
  },
]

export default function ContactPage() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError("")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          phone_number: phone,
          subject,
          message,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to submit message")
      }
      setSubmitted(true)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-[#0D0D0D] min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative py-[100px] bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--gold-accent)] to-transparent opacity-30" />
        <div className="max-w-6xl mx-auto px-5 relative z-[1]">
          <h1 className="text-white text-[clamp(2rem,4vw,3rem)] mb-4 font-[family-name:var(--font-playfair)]">
            Contact <span className="text-[var(--gold-accent)]">Us</span>
          </h1>
          <p className="text-[var(--soft-gray)] text-lg mt-4 max-w-2xl">
            We&apos;re here to help. Reach out to us for bookings, inquiries, or any assistance you need.
          </p>
          <div className="flex items-center gap-2 text-[var(--soft-gray)] text-[0.9rem] mt-4">
            <Link href="/" className="hover:text-[var(--gold-accent)] transition no-underline">Home</Link>
            <span>/</span>
            <span className="text-[var(--gold-accent)]">Contact</span>
          </div>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="py-[100px] bg-[#0D0D0D]">
        <div className="max-w-[1400px] mx-auto px-5">
          <div className="text-center mb-12 max-w-[800px] mx-auto">
            <span className="inline-block px-5 py-2 bg-[rgba(221,186,94,0.15)] border border-[var(--gold-accent)] text-[var(--gold-accent)] text-[0.85rem] tracking-[2px] uppercase mb-5 rounded-25px font-semibold">
              Get In Touch
            </span>
            <h2 className="text-white text-[clamp(2rem,4vw,3rem)] mb-3.5 font-[family-name:var(--font-playfair)]">
              Contact <span className="text-[var(--gold-accent)]">Information</span>
            </h2>
            <p className="text-[var(--soft-gray)] text-[1.1rem] max-w-[600px] mx-auto">
              Have questions or ready to book? Our team is available 24/7 to assist you with all your luxury transportation needs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10">
            {/* Left — Contact Info */}
            <div className="flex flex-col gap-5">
              {contactInfo.map((item) => (
                <div key={item.label} className="flex items-start gap-4 bg-[rgba(26,26,26,0.9)] backdrop-blur-[20px] rounded-[15px] border border-[rgba(212,175,55,0.2)] p-5 transition-all duration-400 hover:border-[var(--gold-accent)]">
                  <div className="w-12 h-12 bg-gradient-to-br from-[var(--gold-accent)] to-[var(--gold-dark)] rounded-full flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-[#0D0D0D]" />
                  </div>
                  <div>
                    <p className="text-[var(--soft-gray)] text-[0.85rem] mb-1">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-white font-semibold text-[0.95rem] hover:text-[var(--gold-accent)] transition no-underline">{item.value}</a>
                    ) : (
                      <p className="text-white font-semibold text-[0.95rem]">{item.value}</p>
                    )}
                    {item.sub && <p className="text-[var(--soft-gray)] text-[0.8rem] mt-0.5">{item.sub}</p>}
                  </div>
                </div>
              ))}

              <div className="bg-[rgba(26,26,26,0.9)] backdrop-blur-[20px] rounded-[15px] border border-[rgba(212,175,55,0.2)] p-5">
                <p className="text-[var(--soft-gray)] text-[0.85rem] mb-3">Follow Us</p>
                <div className="flex gap-3">
                  <a href="https://facebook.com/santransportservices" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.3)] flex items-center justify-center text-[var(--gold-accent)] transition-all duration-400 hover:bg-[var(--gold-accent)] hover:text-[#0D0D0D] no-underline">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                  <a href="https://instagram.com/santransportservices" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.3)] flex items-center justify-center text-[var(--gold-accent)] transition-all duration-400 hover:bg-[var(--gold-accent)] hover:text-[#0D0D0D] no-underline">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  </a>
                  <a href="https://x.com/santranspocr6a" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.3)] flex items-center justify-center text-[var(--gold-accent)] transition-all duration-400 hover:bg-[var(--gold-accent)] hover:text-[#0D0D0D] no-underline">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                  <a href="https://wa.me/message/3ONZGWHTWBJ5B1" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[rgba(212,175,55,0.1)] border border-[rgba(212,175,55,0.3)] flex items-center justify-center text-[var(--gold-accent)] transition-all duration-400 hover:bg-[var(--gold-accent)] hover:text-[#0D0D0D] no-underline">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Right — Contact Form */}
            {submitted ? (
              <div className="bg-[rgba(26,26,26,0.9)] backdrop-blur-[20px] rounded-[20px] border border-[rgba(212,175,55,0.2)] p-[40px] flex flex-col items-center justify-center text-center min-h-[400px]">
                <div className="w-20 h-20 rounded-full bg-[rgba(221,186,94,0.1)] border-2 border-[var(--gold-accent)] flex items-center justify-center mb-6">
                  <CheckCircle className="w-10 h-10 text-[var(--gold-accent)]" />
                </div>
                <h3 className="text-white text-[1.6rem] mb-4 font-[family-name:var(--font-playfair)]">Message Sent!</h3>
                <p className="text-[var(--soft-gray)] text-[1rem] max-w-[400px] mb-2">
                  Thank you, {firstName}. We've received your message.
                </p>
                <p className="text-[var(--soft-gray)] text-[0.9rem] max-w-[400px] mb-8">
                  Our team will get back to you within 2 hours.
                </p>
                <button type="button" onClick={() => { setSubmitted(false); setFirstName(""); setLastName(""); setEmail(""); setPhone(""); setSubject(""); setMessage("") }} className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-br from-[var(--gold-accent)] to-[var(--gold-dark)] text-[#0D0D0D] rounded-full text-[0.9rem] font-semibold uppercase tracking-[1px] cursor-pointer border-none transition-all duration-400 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(221,186,94,0.5)]">
                  Send Another Message
                </button>
              </div>
            ) : (
            <form onSubmit={handleSubmit} className="bg-[rgba(26,26,26,0.9)] backdrop-blur-[20px] rounded-[20px] border border-[rgba(212,175,55,0.2)] p-[40px]">
              <h3 className="text-white text-[1.4rem] mb-6 font-[family-name:var(--font-playfair)]">Send Us a Message</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[var(--soft-gray)] text-[0.85rem] font-medium uppercase tracking-[1px]">First Name *</label>
                  <input required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full h-14 bg-[rgba(13,13,13,0.8)] border-2 border-[rgba(212,175,55,0.2)] rounded-[15px] text-white px-5 outline-none transition-all duration-400 focus:border-[var(--gold-accent)] focus:shadow-[0_0_0_4px_rgba(212,175,55,0.2)]" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[var(--soft-gray)] text-[0.85rem] font-medium uppercase tracking-[1px]">Last Name *</label>
                  <input required value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full h-14 bg-[rgba(13,13,13,0.8)] border-2 border-[rgba(212,175,55,0.2)] rounded-[15px] text-white px-5 outline-none transition-all duration-400 focus:border-[var(--gold-accent)] focus:shadow-[0_0_0_4px_rgba(212,175,55,0.2)]" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[var(--soft-gray)] text-[0.85rem] font-medium uppercase tracking-[1px]">Email Address *</label>
                  <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-14 bg-[rgba(13,13,13,0.8)] border-2 border-[rgba(212,175,55,0.2)] rounded-[15px] text-white px-5 outline-none transition-all duration-400 focus:border-[var(--gold-accent)] focus:shadow-[0_0_0_4px_rgba(212,175,55,0.2)]" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[var(--soft-gray)] text-[0.85rem] font-medium uppercase tracking-[1px]">Phone Number</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full h-14 bg-[rgba(13,13,13,0.8)] border-2 border-[rgba(212,175,55,0.2)] rounded-[15px] text-white px-5 outline-none transition-all duration-400 focus:border-[var(--gold-accent)] focus:shadow-[0_0_0_4px_rgba(212,175,55,0.2)]" />
                </div>
              </div>
              <div className="flex flex-col gap-2 mb-5">
                <label className="text-[var(--soft-gray)] text-[0.85rem] font-medium uppercase tracking-[1px]">Subject *</label>
                <div className="relative">
                  <select required value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full h-14 bg-[rgba(13,13,13,0.8)] border-2 border-[rgba(212,175,55,0.2)] rounded-[15px] text-white px-5 pr-12 outline-none appearance-none cursor-pointer transition-all duration-400 focus:border-[var(--gold-accent)] focus:shadow-[0_0_0_4px_rgba(212,175,55,0.2)]">
                    <option value="">Select a subject</option>
                    {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--gold-accent)] pointer-events-none" />
                </div>
              </div>
              <div className="flex flex-col gap-2 mb-6">
                <label className="text-[var(--soft-gray)] text-[0.85rem] font-medium uppercase tracking-[1px]">Message *</label>
                <textarea required value={message} onChange={(e) => setMessage(e.target.value)} rows={5} className="w-full bg-[rgba(13,13,13,0.8)] border-2 border-[rgba(212,175,55,0.2)] rounded-[15px] text-white px-5 py-4 outline-none resize-none transition-all duration-400 focus:border-[var(--gold-accent)] focus:shadow-[0_0_0_4px_rgba(212,175,55,0.2)]" />
              </div>
              {submitError && (
                <div className="flex items-center gap-3 p-4 mb-5 bg-[rgba(220,38,38,0.08)] border border-[rgba(220,38,38,0.3)] rounded-[15px] text-[0.9rem]">
                  <span className="text-red-400">{submitError}</span>
                </div>
              )}
              <button type="submit" disabled={submitting} className="w-full h-14 bg-gradient-to-br from-[var(--gold-accent)] to-[var(--gold-dark)] text-[#0D0D0D] rounded-[15px] font-bold text-[0.95rem] uppercase tracking-[1px] cursor-pointer border-none transition-all duration-400 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(212,175,55,0.4)] disabled:opacity-50 disabled:cursor-not-allowed">
                {submitting ? "Sending..." : "Send Message"}
              </button>
            </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-[100px] bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D]">
        <div className="max-w-3xl mx-auto px-5">
          <div className="text-center mb-12">
            <span className="inline-block px-5 py-2 bg-[rgba(221,186,94,0.15)] border border-[var(--gold-accent)] text-[var(--gold-accent)] text-[0.85rem] tracking-[2px] uppercase mb-5 rounded-25px font-semibold">
              FAQ
            </span>
            <h2 className="text-white text-[clamp(2rem,4vw,3rem)] font-[family-name:var(--font-playfair)]">
              Frequently Asked <span className="text-[var(--gold-accent)]">Questions</span>
            </h2>
            <p className="text-[var(--soft-gray)] text-[1.1rem] mt-3 max-w-[600px] mx-auto">
              Quick answers to common questions about our services.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-[rgba(26,26,26,0.9)] backdrop-blur-[20px] rounded-[15px] border border-[rgba(212,175,55,0.2)] overflow-hidden transition-all duration-400 hover:border-[var(--gold-accent)]">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 bg-transparent border-none cursor-pointer text-left"
                >
                  <span className="text-white font-semibold text-[0.95rem] pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-[var(--gold-accent)] shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                <div className={`overflow-hidden transition-[max-height] duration-300 ${openFaq === i ? "max-h-40" : "max-h-0"}`}>
                  <p className="text-[var(--soft-gray)] text-[0.9rem] leading-[1.7] px-5 pb-5">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-[100px] bg-gradient-to-br from-[rgba(212,175,55,0.1)] to-[rgba(212,175,55,0.05)] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="max-w-4xl mx-auto px-5 text-center relative z-[1]">
          <h2 className="text-white text-[clamp(2rem,4vw,3rem)] mb-5 font-[family-name:var(--font-playfair)]">
            Ready to Experience <span className="text-[var(--gold-accent)]">Luxury Travel</span>?
          </h2>
          <p className="text-[var(--soft-gray)] text-[1.2rem] mb-10 max-w-[600px] mx-auto leading-[1.6]">
            Book your ride today and discover why clients choose SAN Transportation Services for their transportation needs.
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
