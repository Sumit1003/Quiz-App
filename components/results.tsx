"use client"

import { Button } from "@/components/ui/button"
import { Trophy, Award, BarChart2, Home } from "lucide-react"

type ResultsProps = {
  score: number
  totalQuestions: number
  onRestart: () => void
  onBackToCategories: () => void
  highScore: number
  categoryName: string
  categoryIcon: string
}

const Results = ({
  score,
  totalQuestions,
  onRestart,
  onBackToCategories,
  highScore,
  categoryName,
  categoryIcon,
}: ResultsProps) => {
  const percentage = Math.round((score / totalQuestions) * 100)

  // Determine feedback based on score
  const getFeedback = () => {
    if (percentage >= 90) return `Excellent! You're a ${categoryName} expert!`
    if (percentage >= 70) return "Great job! You know your stuff!"
    if (percentage >= 50) return "Good effort! Keep learning!"
    return "Keep practicing! You'll improve with time."
  }

  // Check if this is a new high score
  const isNewHighScore = score > highScore

  return (
    <div className="flex flex-col items-center space-y-6 py-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">
          {categoryIcon} {categoryName} Quiz Completed!
        </h2>
        <p className="text-muted-foreground">{getFeedback()}</p>
      </div>

      <div className="flex items-center justify-center w-32 h-32 rounded-full bg-primary/10 border-4 border-primary">
        <div className="text-center">
          <div className="text-3xl font-bold">{score}</div>
          <div className="text-sm text-muted-foreground">out of {totalQuestions}</div>
        </div>
      </div>

      <div className="space-y-4 w-full max-w-xs">
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-primary" />
            <span>Score Percentage:</span>
          </div>
          <span className="font-semibold">{percentage}%</span>
        </div>

        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            <span>High Score:</span>
          </div>
          <span className="font-semibold">
            {isNewHighScore ? score : highScore}/{totalQuestions}
          </span>
        </div>

        {isNewHighScore && (
          <div className="flex items-center justify-center gap-2 p-3 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded-lg">
            <Award className="h-5 w-5" />
            <span className="font-medium">New High Score!</span>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <Button onClick={onRestart} className="flex-1">
          Try Again
        </Button>
        <Button onClick={onBackToCategories} variant="outline" className="flex-1">
          <Home className="h-4 w-4 mr-2" />
          Categories
        </Button>
      </div>
    </div>
  )
}

export default Results

