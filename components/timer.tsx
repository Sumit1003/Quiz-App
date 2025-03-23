"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { Clock } from "lucide-react"

type TimerProps = {
  duration: number
  onTimeUp: () => void
}

const Timer = ({ duration, onTimeUp }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1)
      }, 1000)
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false)
      onTimeUp()
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timeLeft, isActive, onTimeUp])

  // Calculate progress percentage
  const progressPercentage = (timeLeft / duration) * 100

  // Determine color based on time left
  const getColorClass = () => {
    if (timeLeft <= duration * 0.25) return "text-destructive"
    if (timeLeft <= duration * 0.5) return "text-warning"
    return "text-primary"
  }

  return (
    <div className="flex flex-col items-end space-y-1">
      <div className={`flex items-center gap-1 ${getColorClass()}`}>
        <Clock className="h-4 w-4" />
        <span className="font-medium">{timeLeft}s</span>
      </div>
      <Progress value={progressPercentage} className="h-2 w-24" />
    </div>
  )
}

export default Timer

