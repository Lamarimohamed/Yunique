import { motion } from "framer-motion"

export default function About() {
  return (
    <main className="min-h-screen bg-[#050505] text-white pt-32 pb-32">
      <section className="h-[70vh] flex items-center justify-center relative overflow-hidden px-6">
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          {/* Faint massive fingerprint behind text */}
          <svg
            viewBox="0 0 100 100"
            className="w-[120vw] h-[120vw] absolute animate-[spin_120s_linear_infinite]"
          >
            <path
              d="M50 10 C30 10 15 25 15 50 C15 75 30 90 50 90"
              fill="none"
              stroke="white"
              strokeWidth="0.2"
            />
            <path
              d="M50 20 C35 20 25 32 25 50 C25 68 35 80 50 80"
              fill="none"
              stroke="white"
              strokeWidth="0.2"
            />
            <path
              d="M50 30 C40 30 35 38 35 50 C35 62 40 70 50 70"
              fill="none"
              stroke="white"
              strokeWidth="0.2"
            />
          </svg>
        </div>

        <div className="relative z-10 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xs font-sans tracking-[0.4em] text-gray-400 font-semibold mb-8 uppercase"
          >
            YUNIQUE
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            className="text-6xl md:text-9xl font-display tracking-tighter uppercase leading-[0.85]"
          >
            YOU WERE NEVER
            <br />
            MEANT TO BLEND IN.
          </motion.h1>
        </div>
      </section>

      <section className="bg-white text-black py-32 rounded-t-[3rem]">
        <div className="max-w-[800px] mx-auto px-6 font-sans text-xl md:text-3xl leading-relaxed text-gray-600">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            YUNIQUE is built around individuality. We believe clothing is not a
            uniform to hide behind, but a canvas for your personal identity.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            The fingerprint represents the fact that every person carries an
            identity that cannot be duplicated. No two are the same.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-black font-display text-4xl md:text-6xl tracking-tighter uppercase mt-24 text-center"
          >
            YOUR IDENTITY.
            <br />
            YOUR MOVEMENT.
            <br />
            YUNIQUE.
          </motion.p>
        </div>
      </section>
    </main>
  )
}
