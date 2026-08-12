import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Link } from "react-router"
import { LogoIntroSvg } from "@/components/ui/LogoIntroSvg"

export default function Home() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  return (
    <div ref={containerRef} className="bg-[#050505] min-h-screen text-white">
      {/* 01 — HERO */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#050505]">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=2832&auto=format&fit=crop')] bg-cover bg-center mix-blend-screen grayscale" />

        {/* Animated Centered Logo with Disappear/Reappear Loop */}
        <motion.div
          className="absolute w-[450px] h-[450px] md:w-[700px] md:h-[700px] z-5 flex items-center justify-center"
          animate={{ 
            opacity: [0, 0.25, 0.25, 0, 0, 0.25],
            scale: [0.6, 1, 1, 1, 0.6, 1],
            y: [30, 0, 0, 0, 30, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            times: [0, 0.15, 0.5, 0.666, 0.85, 1],
            ease: "easeOut",
          }}
        >
          <LogoIntroSvg />
        </motion.div>

        <div className="relative z-10 text-center max-w-[1440px] px-6 flex flex-col items-center">
          <motion.h1
            className="text-6xl md:text-[120px] font-display tracking-tighter uppercase leading-[0.85] mb-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
          >
            WEAR UR <br />
            IDENTITY.
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <Link
              to="/shop"
              className="inline-block bg-white text-black hover:bg-gray-200 transition-colors duration-300 px-12 py-4 text-xs font-sans font-semibold tracking-[0.2em] uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              data-cursor="view"
            >
              Shop The Drop
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 02 — BRAND STATEMENT */}
      <BrandStatement scrollYProgress={scrollYProgress} />

      {/* 03 — NEW DROP (White/Approachable) */}
      <NewDropSection />

      {/* 04 — EDITORIAL CAMPAIGN (Dark) */}
      <EditorialCampaign />
    </div>
  )
}

function BrandStatement({ scrollYProgress }: { scrollYProgress: any }) {
  const x = useTransform(scrollYProgress, [0, 0.5], ["0%", "-20%"])

  return (
    <section className="py-48 overflow-hidden relative bg-[#F2F2F0] text-black">
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
        <svg
          viewBox="0 0 100 100"
          className="w-[100vw] h-[100vw] md:w-[60vw] md:h-[60vw] absolute"
        >
          <path
            d="M50 10 C30 10 15 25 15 50 C15 75 30 90 50 90"
            fill="none"
            stroke="black"
            strokeWidth="0.5"
          />
          <path
            d="M50 20 C35 20 25 32 25 50 C25 68 35 80 50 80"
            fill="none"
            stroke="black"
            strokeWidth="0.5"
          />
          <path
            d="M50 30 C40 30 35 38 35 50 C35 62 40 70 50 70"
            fill="none"
            stroke="black"
            strokeWidth="0.5"
          />
        </svg>
      </div>

      <motion.div style={{ x }} className="whitespace-nowrap">
        <h2 className="text-[12vw] font-display tracking-tighter uppercase leading-[0.9]">
          YOU ARE NOT A COPY.{" "}
          <span className="text-gray-300">YOU ARE NOT A COPY.</span> YOU ARE NOT
          A COPY.
        </h2>
      </motion.div>
    </section>
  )
}

function NewDropSection() {
  const products = [
    {
      id: "01",
      name: "YUNIQUE OVERSIZED TEE",
      color: "BLACK",
      price: "12,000 DZD",
      img1: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1287&auto=format&fit=crop",
      img2: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1287&auto=format&fit=crop",
    },
    {
      id: "02",
      name: "RAW FORM HOODIE",
      color: "OFF BLACK",
      price: "18,500 DZD",
      img1: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1287&auto=format&fit=crop",
      img2: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1287&auto=format&fit=crop",
    },
    {
      id: "03",
      name: "IDENTITY CARGO PANT",
      color: "DARK GRAY",
      price: "24,000 DZD",
      img1: "https://images.unsplash.com/photo-1628157588553-5eeea00af15c?q=80&w=1480&auto=format&fit=crop",
      img2: "https://images.unsplash.com/photo-1628157588553-5eeea00af15c?q=80&w=1480&auto=format&fit=crop",
    },
    {
      id: "04",
      name: "SIGNATURE CAP",
      color: "BLACK",
      price: "5,500 DZD",
      img1: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1336&auto=format&fit=crop",
      img2: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1336&auto=format&fit=crop",
    },
  ]

  return (
    <section className="bg-white text-black py-24">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="flex justify-between items-end mb-16 border-b border-[#E5E5E5] pb-6">
          <h2 className="text-4xl md:text-5xl font-display tracking-tighter uppercase">
            NEW DROP
          </h2>
          <Link
            to="/shop"
            className="text-xs font-sans font-semibold tracking-[0.1em] text-gray-500 hover:text-black transition-colors uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black underline underline-offset-4"
          >
            VIEW ALL
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((p) => (
            <div
              key={p.id}
              className="group cursor-none relative"
              data-cursor="view"
            >
              <Link
                to="/product/01"
                className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
              >
                <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-[#F2F2F0]">
                  {/* Clean standard color images - no extreme grayscale filters */}
                  <img
                    src={p.img1}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out group-hover:opacity-0"
                    alt={p.name}
                  />
                  <img
                    src={p.img2}
                    className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100"
                    alt={p.name}
                  />
                </div>

                <div className="flex justify-between items-start font-sans text-xs tracking-widest uppercase text-black">
                  <div>
                    <p className="text-gray-400 mb-1">{p.id}</p>
                    <h3 className="font-semibold">{p.name}</h3>
                    <p className="text-gray-500 mt-1">{p.color}</p>
                  </div>
                  <div>
                    <p className="font-semibold">{p.price}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function EditorialCampaign() {
  return (
    <section className="relative h-[80vh] w-full flex items-center justify-center overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        <motion.img
          src="https://images.unsplash.com/photo-1492601229413-1768652d5b6d?q=80&w=2938&auto=format&fit=crop"
          className="w-full h-full object-cover opacity-60 mix-blend-screen"
          initial={{ scale: 1.05 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          data-cursor="explore"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80" />
      </div>

      <div className="relative z-10 text-center pointer-events-none px-6">
        <h2 className="text-6xl md:text-9xl font-display tracking-tighter uppercase leading-[0.9] mb-6 drop-shadow-2xl">
          YUNIQUE
          <br />
          <span className="text-3xl md:text-5xl text-gray-300">
            COLLECTION 01
          </span>
        </h2>
        <p className="font-sans text-xs tracking-[0.2em] md:tracking-[0.3em] uppercase font-semibold">
          IDENTITY WITHOUT PERMISSION.
        </p>
      </div>
    </section>
  )
}
