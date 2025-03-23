"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Timer from "./timer"

type QuestionCardProps = {
  question: {
    question: string
    all_answers: string[]
  }
  questionNumber: number
  totalQuestions: number
  onAnswerSelect: (answer: string) => void
  onTimeUp: () => void
}

const QuestionCard = ({ question, questionNumber, totalQuestions, onAnswerSelect, onTimeUp }: QuestionCardProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false)

  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswer(null)
    setIsAnswerSubmitted(false)
  }, [question])

  const handleAnswerClick = (answer: string) => {
    if (isAnswerSubmitted) return

    setSelectedAnswer(answer)
    setIsAnswerSubmitted(true)

    // Add a small delay before moving to the next question
    setTimeout(() => {
      onAnswerSelect(answer)
    }, 500)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-sm font-medium">
          Question {questionNumber} of {totalQuestions}
        </div>
        <Timer duration={15} onTimeUp={onTimeUp} key={questionNumber} />
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold" dangerouslySetInnerHTML={{ __html: question.question }} />

        <div className="grid gap-3">
          {question.all_answers.map((answer, index) => (
            <Button
              key={index}
              variant={selectedAnswer === answer ? "default" : "outline"}
              className="justify-start h-auto py-4 px-6 text-left"
              onClick={() => handleAnswerClick(answer)}
              disabled={isAnswerSubmitted}
            >
              <span dangerouslySetInnerHTML={{ __html: answer }} />
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default QuestionCard

