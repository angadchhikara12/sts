import Link from "next/link"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-[#0D0D0D] border-t border-[rgba(212,175,55,0.1)] py-20 pb-7.5">
      <div className="max-w-[1400px] mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-12.5 mb-12.5">
          {/* Brand */}
          <div className="max-w-[350px]">
            <Link href="/" className="flex items-center gap-3 no-underline mb-5">
              <Image src="/logo.jpeg" alt="Logo" width={50} height={50} className="w-11 h-11 object-contain" />
              <span className="font-[family-name:var(--font-playfair)] text-xl font-bold text-white flex items-center gap-1">
                SAN <span className="text-[var(--gold-accent)] text-[0.8em]">Transport Services</span>
              </span>
            </Link>
            <p className="text-[var(--soft-gray)] text-[0.95rem] leading-[1.7] mb-5">
              Premium luxury limo and black car service across California. Professional chauffeurs, exceptional vehicles.
            </p>
            <div className="flex gap-3.5">
              <a href="https://facebook.com/santransportservices" target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full bg-[#1A1A1A] border border-[rgba(212,175,55,0.3)] flex items-center justify-center text-[var(--gold-accent)] text-lg transition-all duration-400 hover:bg-[var(--gold-accent)] hover:text-[#0D0D0D] hover:-translate-y-0.5 no-underline">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://instagram.com/santransportservices" target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full bg-[#1A1A1A] border border-[rgba(212,175,55,0.3)] flex items-center justify-center text-[var(--gold-accent)] text-lg transition-all duration-400 hover:bg-[var(--gold-accent)] hover:text-[#0D0D0D] hover:-translate-y-0.5 no-underline">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="https://x.com/santranspocr6a" target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full bg-[#1A1A1A] border border-[rgba(212,175,55,0.3)] flex items-center justify-center text-[var(--gold-accent)] text-lg transition-all duration-400 hover:bg-[var(--gold-accent)] hover:text-[#0D0D0D] hover:-translate-y-0.5 no-underline">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://wa.me/message/3ONZGWHTWBJ5B1" target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full bg-[#1A1A1A] border border-[rgba(212,175,55,0.3)] flex items-center justify-center text-[var(--gold-accent)] text-lg transition-all duration-400 hover:bg-[var(--gold-accent)] hover:text-[#0D0D0D] hover:-translate-y-0.5 no-underline">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-[1.1rem] mb-6 font-[family-name:var(--font-playfair)]">Quick Links</h4>
            <ul className="flex flex-col gap-3">
              <li><Link href="/" className="text-[var(--soft-gray)] text-[0.95rem] transition-all duration-400 hover:text-[var(--gold-accent)] hover:pl-1 no-underline">Home</Link></li>
              <li><Link href="/fleet" className="text-[var(--soft-gray)] text-[0.95rem] transition-all duration-400 hover:text-[var(--gold-accent)] hover:pl-1 no-underline">Fleet</Link></li>
              <li><Link href="/services" className="text-[var(--soft-gray)] text-[0.95rem] transition-all duration-400 hover:text-[var(--gold-accent)] hover:pl-1 no-underline">Services</Link></li>
              <li><Link href="/special" className="text-[var(--soft-gray)] text-[0.95rem] transition-all duration-400 hover:text-[var(--gold-accent)] hover:pl-1 no-underline">Special</Link></li>
              <li><Link href="/about" className="text-[var(--soft-gray)] text-[0.95rem] transition-all duration-400 hover:text-[var(--gold-accent)] hover:pl-1 no-underline">About</Link></li>
              <li><Link href="/contact" className="text-[var(--soft-gray)] text-[0.95rem] transition-all duration-400 hover:text-[var(--gold-accent)] hover:pl-1 no-underline">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white text-[1.1rem] mb-6 font-[family-name:var(--font-playfair)]">Services</h4>
            <ul className="flex flex-col gap-3">
              <li><span className="text-[var(--soft-gray)] text-[0.95rem]">Airport Transfers</span></li>
              <li><span className="text-[var(--soft-gray)] text-[0.95rem]">Corporate Travel</span></li>
              <li><span className="text-[var(--soft-gray)] text-[0.95rem]">Wedding Transportation</span></li>
              <li><span className="text-[var(--soft-gray)] text-[0.95rem]">Special Events</span></li>
              <li><span className="text-[var(--soft-gray)] text-[0.95rem]">Hourly Charter</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-[1.1rem] mb-6 font-[family-name:var(--font-playfair)]">Contact Info</h4>
            <ul className="flex flex-col gap-3.5">
              <li className="flex items-start gap-3 text-[var(--soft-gray)] text-[0.95rem]">
                <svg className="w-5 h-5 text-[var(--gold-accent)] mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                California
              </li>
              <li className="flex items-start gap-3 text-[var(--soft-gray)] text-[0.95rem]">
                <svg className="w-5 h-5 text-[var(--gold-accent)] mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                <a href="tel:+12345679992" className="hover:text-[var(--gold-accent)] transition no-underline">+1 (234) 567-9992</a>
              </li>
              <li className="flex items-start gap-3 text-[var(--soft-gray)] text-[0.95rem]">
                <svg className="w-5 h-5 text-[var(--gold-accent)] mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                <a href="mailto:info@sants.us" className="hover:text-[var(--gold-accent)] transition no-underline">info@sants.us</a>
              </li>
              <li className="flex items-start gap-3 text-[var(--soft-gray)] text-[0.95rem]">
                <svg className="w-5 h-5 text-[var(--gold-accent)] mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
                24/7 Customer Support
              </li>
            </ul>
            <Link href="/book" className="inline-block mt-5 bg-gradient-to-br from-[var(--gold-accent)] to-[var(--gold-dark)] text-[#0D0D0D] text-[0.9rem] font-bold rounded px-5 py-2.5 no-underline transition-all duration-400 hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(212,175,55,0.3)]">
              Book Now
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-7.5 border-t border-[rgba(212,175,55,0.1)] flex flex-wrap justify-between items-center gap-5">
          <p className="text-[var(--soft-gray)] text-[0.9rem]">&copy; {new Date().getFullYear()} SAN Transport Services. All rights reserved. <span className="text-[var(--gold-accent)]">SAN</span></p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-[var(--soft-gray)] text-[0.9rem] transition-colors hover:text-[var(--gold-accent)] no-underline">Privacy Policy</Link>
            <Link href="/terms" className="text-[var(--soft-gray)] text-[0.9rem] transition-colors hover:text-[var(--gold-accent)] no-underline">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
