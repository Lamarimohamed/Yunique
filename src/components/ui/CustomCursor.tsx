import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [hoverText, setHoverText] = useState("")

  useEffect(() => {
    // Only run on desktop
    if (window.matchMedia("(max-width: 768px)").matches) return

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      const clickable = target.closest('a, button, [role="button"]')
      const product = target.closest('[data-cursor="view"]')
      const image = target.closest('[data-cursor="explore"]')

      if (product) {
        setIsHovering(true)
        setHoverText("VIEW")
      } else if (image) {
        setIsHovering(true)
        setHoverText("EXPLORE")
      } else if (clickable) {
        setIsHovering(true)
        setHoverText("")
      } else {
        setIsHovering(false)
        setHoverText("")
      }
    }

    window.addEventListener("mousemove", updateMousePosition)
    window.addEventListener("mouseover", handleMouseOver)

    return () => {
      window.removeEventListener("mousemove", updateMousePosition)
      window.removeEventListener("mouseover", handleMouseOver)
    }
  }, [])

  if (window.matchMedia("(max-width: 768px)").matches) return null

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-white rounded-full pointer-events-none z-[100] transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center mix-blend-difference"
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
          scale: hoverText ? 5 : isHovering ? 1.5 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 700,
          damping: 35,
          mass: 1.5,
        }}
      >
        {hoverText && (
          <span className="text-[3px] text-black font-display tracking-widest uppercase scale-[0.6] opacity-100">
            {hoverText}
          </span>
        )}
      </motion.div>
    </>
  )
}
