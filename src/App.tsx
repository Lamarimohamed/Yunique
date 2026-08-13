import { BrowserRouter, Routes, Route } from "react-router"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

// Pages
import Home from "./pages/Home"
import Shop from "./pages/Shop"
import About from "./pages/About"
import ProductDetail from "./pages/ProductDetail"
import Checkout from "./pages/Checkout"
import AdminDashboard from "./pages/admin/AdminDashboard"

// Components
import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"
import CustomCursor from "./components/ui/CustomCursor"
import PageTransition from "./components/ui/PageTransition"
import { LogoIntroSvg } from "./components/ui/LogoIntroSvg"
import CartDrawer from "./components/ui/CartDrawer"
import { CartProvider } from "./context/CartContext"
import { DataProvider } from "./context/DataContext"

export default function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Faster, snappier load for an approachable feel, enough to show the sweep
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <DataProvider>
      <CartProvider>
        <BrowserRouter>
          <CustomCursor />

          <AnimatePresence mode="wait">
            {loading ? (
              <IntroSequence key="intro" />
            ) : (
              <motion.div
                key="app"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <Navbar />
                <PageTransition>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/drop" element={<Shop />} />
                    <Route path="/collections" element={<Shop />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="*" element={<Home />} />
                  </Routes>
                </PageTransition>
                <Footer />
                <CartDrawer />
              </motion.div>
            )}
          </AnimatePresence>
        </BrowserRouter>
      </CartProvider>
    </DataProvider>
  )
}

function IntroSequence() {
  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center overflow-hidden"
      exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
    >
      <style>{`
        .mark-wrap {
          width: min(72vw, 620px);
          color: #ffffff;
          position: relative;
        }
        svg.mark { display: block; width: 100%; height: auto; overflow: visible; }
        svg.mark path {
          fill: currentColor;
          opacity: 0;
          transform-box: fill-box;
          transform-origin: center;
          animation-fill-mode: forwards;
          animation-timing-function: cubic-bezier(.16,.84,.32,1);
        }
        .p-top    { animation-name: ridgeInTop;    animation-duration: .62s; }
        .p-bottom { animation-name: ridgeInBottom; animation-duration: .62s; }
        .p-letter { animation-name: letterIn;      animation-duration: .55s; }

        @keyframes ridgeInTop {
          from { opacity: 0; transform: scale(1.07) translateY(-3%); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes ridgeInBottom {
          from { opacity: 0; transform: scale(1.07) translateY(3%); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes letterIn {
          from { opacity: 0; transform: translateY(10px) scale(.92); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .sweep {
          position: absolute; inset: 0;
          pointer-events: none;
        }
        .sweep-bar {
          position: absolute; top: -20%; bottom: -20%; left: -35%;
          width: 30%;
          background: linear-gradient(100deg, transparent, rgba(255,255,255,.55), transparent);
          transform: translateX(-40%) skewX(-12deg);
          opacity: 0;
          animation: sweep 1.1s ease-out forwards;
          animation-delay: 1560ms;
          mix-blend-mode: screen;
        }
        @keyframes sweep {
          0%   { transform: translateX(-40%) skewX(-12deg); opacity: 0; }
          12%  { opacity: .9; }
          60%  { opacity: .35; }
          100% { transform: translateX(340%) skewX(-12deg); opacity: 0; }
        }
      `}</style>

      <div className="mark-wrap">
        <LogoIntroSvg />
        <div className="sweep">
          <div className="sweep-bar"></div>
        </div>
      </div>
    </motion.div>
  )
}
