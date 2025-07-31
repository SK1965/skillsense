import {motion} from "framer-motion"
import { useEffect, useState } from "react"

function AnimatedScore({ score }: { score: number }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    let start = 0
    const end = score
    if (start >= end) return
    const increment = end > start ? 1 : -1
    const stepTime = 1000 / Math.abs(end - start)
    const timer = setInterval(() => {
      start += increment
      setDisplay(start)
      if (start >= end) clearInterval(timer)
    }, stepTime)
    return () => clearInterval(timer)
  }, [score])

  return <>{display}%</>
}

export default function CircularScore({ score = 0 }) {
  const radius = 60
  const stroke = 8
  const normalizedRadius = radius - stroke * 2
  const circumference = normalizedRadius * 2 * Math.PI
  const progress = circumference - (score / 100) * circumference

  return (
    <svg width={radius * 2} height={radius * 2} className="mx-auto block" role="img" aria-label={`Resume match score: ${score} percent`}>
      <circle
        stroke="#e6e6e6"
        fill="none"
        cx={radius}
        cy={radius}
        r={normalizedRadius}
        strokeWidth={stroke}
      />
      <motion.circle
        stroke="#22c55e"
        fill="none"
        cx={radius}
        cy={radius}
        r={normalizedRadius}
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={progress}
        strokeLinecap="round"
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: progress }}
        transition={{ duration: 1.1, type: "spring" }}
      />
      {/* Score Text */}
      <text
        x={radius}
        y={radius}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={32}
        fontWeight={800}
        fill="#22c55e"
        className="font-mono select-none"
      >
        <AnimatedScore score={score} />
      </text>
    </svg>
  )
}