import { Link } from "react-router"

export default function Footer() {
  return (
    <footer
      className="bg-[#050505] text-white pt-32 pb-12 px-6 border-t border-[#181818] relative overflow-hidden"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      {/* Massive Fingerprint Background Graphic */}
      <div
        className="absolute bottom-0 right-0 w-[800px] h-[800px] opacity-[0.03] pointer-events-none translate-x-1/4 translate-y-1/4"
        aria-hidden="true"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path
            d="M50 10 C30 10 15 25 15 50 C15 75 30 90 50 90"
            fill="none"
            stroke="white"
            strokeWidth="0.5"
          />
          <path
            d="M50 20 C35 20 25 32 25 50 C25 68 35 80 50 80"
            fill="none"
            stroke="white"
            strokeWidth="0.5"
          />
          <path
            d="M50 30 C40 30 35 38 35 50 C35 62 40 70 50 70"
            fill="none"
            stroke="white"
            strokeWidth="0.5"
          />
        </svg>
      </div>

      <div className="max-w-[1440px] mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between mb-24">
          <div className="mb-12 md:mb-0">
            <h2
              className="text-6xl md:text-8xl font-display tracking-tighter uppercase mb-6"
              aria-hidden="true"
            >
              YUNIQUE
            </h2>
          </div>

          <nav
            className="grid grid-cols-2 md:grid-cols-3 gap-12 font-display text-sm tracking-[0.1em] text-gray-500"
            aria-label="Footer Navigation"
          >
            <div className="flex flex-col space-y-4">
              <Link
                to="/shop"
                className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
              >
                SHOP
              </Link>
              <Link
                to="/about"
                className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
              >
                ABOUT
              </Link>
              <Link
                to="/contact"
                className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
              >
                CONTACT
              </Link>
            </div>
            <div className="flex flex-col space-y-4">
              <Link
                to="/shipping"
                className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
              >
                SHIPPING
              </Link>
              <Link
                to="/returns"
                className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
              >
                RETURNS
              </Link>
              <Link
                to="/faq"
                className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
              >
                FAQ
              </Link>
            </div>
            <div className="flex flex-col space-y-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
              >
                INSTAGRAM
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
              >
                TIKTOK
              </a>
            </div>
          </nav>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-xs font-sans text-gray-600 border-t border-[#181818] pt-8">
          <p>© YUNIQUE 2026</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              to="/terms"
              className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
            >
              TERMS
            </Link>
            <Link
              to="/privacy"
              className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
            >
              PRIVACY
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
