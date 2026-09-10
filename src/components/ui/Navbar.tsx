"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import { NotificationPanel } from "@/components/ui/notification-panel"

export default function Navbar() {
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0D0D0D]/98 backdrop-blur-[20px] shadow-[0_2px_20px_rgba(0,0,0,0.3)]"
            : "bg-[#0D0D0D]"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-5 flex justify-between items-center h-18">
          {/* Logo */}
          <Link href="/" className="flex items-end gap-3 no-underline">
            <Image src="/logo.jpeg" alt="Logo" width={100} height={100} className="w-11 h-11 object-contain" />
            <p className="font-[family-name:var(--font-playfair)] text-xl font-bold text-white">
              <span className="text-3xl font-[family-name:var(--font-playfair)]">SAN </span><span className="text-3xl text-[var(--gold-accent)] font-[family-name:var(--font-playfair)]">T</span><span className="text-[var(--gold-accent)]">ransport </span><span className="text-3xl text-[var(--gold-accent)] font-[family-name:var(--font-playfair)]">S</span><span className="text-[var(--gold-accent)]">ervices</span>
            </p>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-10">
            <Link href="/" className="text-white text-[0.95rem] font-medium relative pb-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[var(--gold-accent)] after:transition-[width] after:duration-400 hover:text-[var(--gold-accent)] hover:after:w-full transition-colors">
              Home
            </Link>
            <Link href="/fleet" className="text-white text-[0.95rem] font-medium relative pb-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[var(--gold-accent)] after:transition-[width] after:duration-400 hover:text-[var(--gold-accent)] hover:after:w-full transition-colors">
              Fleet
            </Link>
            <Link href="/services" className="text-white text-[0.95rem] font-medium relative pb-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[var(--gold-accent)] after:transition-[width] after:duration-400 hover:text-[var(--gold-accent)] hover:after:w-full transition-colors">
              Services
            </Link>
            <Link href="/special" className="text-white text-[0.95rem] font-medium relative pb-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[var(--gold-accent)] after:transition-[width] after:duration-400 hover:text-[var(--gold-accent)] hover:after:w-full transition-colors">
              Special
            </Link>
            <Link href="/about" className="text-white text-[0.95rem] font-medium relative pb-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[var(--gold-accent)] after:transition-[width] after:duration-400 hover:text-[var(--gold-accent)] hover:after:w-full transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-white text-[0.95rem] font-medium relative pb-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[var(--gold-accent)] after:transition-[width] after:duration-400 hover:text-[var(--gold-accent)] hover:after:w-full transition-colors">
              Contact
            </Link>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setNotificationOpen(true)}
              className="relative p-2 rounded-full transition-colors hover:bg-white/5 cursor-pointer"
            >
              <Bell className="w-5 h-5 text-white" />
            </button>
            <Link href="/book" className="hidden lg:inline-flex">
              <span className="inline-block bg-gradient-to-br from-[var(--gold-accent)] to-[var(--gold-dark)] text-[#0D0D0D] px-5 py-2.5 rounded-[5px] font-bold uppercase tracking-[1.1px] text-[0.85rem] leading-none no-underline transition-transform hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(212,175,55,0.3)]">
                Book Now
              </span>
            </Link>
            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden flex flex-col gap-1.5 z-[1001] cursor-pointer bg-transparent border-none p-1"
            >
              <span className={`w-7 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? "rotate-45 translate-x-[8px] translate-y-[8px]" : ""}`} />
              <span className={`w-7 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`w-7 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? "-rotate-45 translate-x-[8px] -translate-y-[8px]" : ""}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 w-[80%] max-w-[400px] h-screen bg-[#0D0D0D] z-[999] transition-[right] duration-300 pt-20 px-10 overflow-y-auto ${
          mobileOpen ? "right-0" : "right-[-100%]"
        }`}
      >
        <div className="flex flex-col gap-5">
          <Link href="/" onClick={() => setMobileOpen(false)} className="text-white text-lg font-medium no-underline hover:text-[var(--gold-accent)] transition-colors">Home</Link>
          <Link href="/fleet" onClick={() => setMobileOpen(false)} className="text-white text-lg font-medium no-underline hover:text-[var(--gold-accent)] transition-colors">Fleet</Link>
          <Link href="/services" onClick={() => setMobileOpen(false)} className="text-white text-lg font-medium no-underline hover:text-[var(--gold-accent)] transition-colors">Services</Link>
          <Link href="/special" onClick={() => setMobileOpen(false)} className="text-white text-lg font-medium no-underline hover:text-[var(--gold-accent)] transition-colors">Special</Link>
          <Link href="/about" onClick={() => setMobileOpen(false)} className="text-white text-lg font-medium no-underline hover:text-[var(--gold-accent)] transition-colors">About</Link>
          <Link href="/contact" onClick={() => setMobileOpen(false)} className="text-white text-lg font-medium no-underline hover:text-[var(--gold-accent)] transition-colors">Contact</Link>
          <Link href="/book" onClick={() => setMobileOpen(false)} className="mt-2 bg-gradient-to-br from-[var(--gold-accent)] to-[var(--gold-dark)] text-[#0D0D0D] px-6 py-3 rounded-2xl text-center font-bold uppercase tracking-[1.1px] text-sm no-underline hover:text-[#0D0D0D]">
            Book Now
          </Link>
        </div>
      </div>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[998]"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <NotificationPanel open={notificationOpen} onOpenChange={setNotificationOpen} />
    </>
  )
}
