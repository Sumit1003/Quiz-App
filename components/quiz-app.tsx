"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import QuestionCard from "./question-card"
import Results from "./results"
import ThemeToggle from "./theme-toggle"
import CategorySelection from "./category-selection"
import { Loader2 } from "lucide-react"

// Define quiz categories with their API IDs
export const QUIZ_CATEGORIES = [
  { id: 9, name: "General Knowledge", icon: "🌍" },
  { id: 23, name: "History", icon: "📜" },
  { id: 19, name: "Mathematics", icon: "🔢" },
  { id: 22, name: "Geography", icon: "🗺️" },
  { id: 17, name: "Science & Nature", icon: "🔬" },
  { id: 18, name: "Computers", icon: "💻" },
  { id: 21, name: "Sports", icon: "⚽" },
  { id: 10, name: "Books", icon: "📚" },
  { id: 11, name: "Film", icon: "🎬" },
  { id: 12, name: "Music", icon: "🎵" },
]

type Question = {
  question: string
  correct_answer: string
  incorrect_answers: string[]
  all_answers: string[]
}

type QuizState = "category-selection" | "not-started" | "loading" | "in-progress" | "completed"

const QuizApp = () => {
  const [quizState, setQuizState] = useState<QuizState>("category-selection")
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [userAnswers, setUserAnswers] = useState<string[]>([])
  const [highScores, setHighScores] = useState<Record<number, number>>({})
  const [selectedCategory, setSelectedCategory] = useState<(typeof QUIZ_CATEGORIES)[0] | null>(null)
  const [difficulty, setDifficulty] = useState("medium")

  // Load high scores from localStorage on component mount
  useEffect(() => {
    const savedHighScores = localStorage.getItem("quizHighScores")
    if (savedHighScores) {
      setHighScores(JSON.parse(savedHighScores))
    }
  }, [])

  // Handle category selection
  const handleCategorySelect = (category: (typeof QUIZ_CATEGORIES)[0]) => {
    setSelectedCategory(category)
    setQuizState("not-started")
  }

  // Fetch questions from the API
  const fetchQuestions = async () => {
    if (!selectedCategory) return

    setQuizState("loading")
    try {
      const response = await fetch(
        `https://opentdb.com/api.php?amount=10&category=${selectedCategory.id}&difficulty=${difficulty}&type=multiple`,
      )
      const data = await response.json()

      if (data.response_code === 0) {
        // Format questions and shuffle answers
        const formattedQuestions = data.results.map((q: any) => {
          const all_answers = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5)
          return {
            ...q,
            all_answers,
          }
        })

        setQuestions(formattedQuestions)
        setQuizState("in-progress")
        setCurrentQuestionIndex(0)
        setScore(0)
        setUserAnswers([])
      } else {
        throw new Error("Failed to fetch questions")
      }
    } catch (error) {
      console.error("Error fetching questions:", error)
      setQuizState("not-started")
    }
  }

  // Handle answer selection
  const handleAnswerSelect = (answer: string) => {
    const currentQuestion = questions[currentQuestionIndex]
    const isCorrect = answer === currentQuestion.correct_answer

    if (isCorrect) {
      setScore((prev) => prev + 1)
    }

    const newUserAnswers = [...userAnswers]
    newUserAnswers[currentQuestionIndex] = answer
    setUserAnswers(newUserAnswers)

    // Move to next question or end quiz
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      endQuiz()
    }
  }

  // Handle timer expiration
  const handleTimeUp = () => {
    // If no answer was selected, record an empty answer
    if (!userAnswers[currentQuestionIndex]) {
      const newUserAnswers = [...userAnswers]
      newUserAnswers[currentQuestionIndex] = ""
      setUserAnswers(newUserAnswers)
    }

    // Move to next question or end quiz
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      endQuiz()
    }
  }

  // End the quiz and update high score if needed
  const endQuiz = () => {
    setQuizState("completed")

    if (selectedCategory) {
      const categoryId = selectedCategory.id
      const currentHighScore = highScores[categoryId] || 0

      if (score > currentHighScore) {
        const newHighScores = { ...highScores, [categoryId]: score }
        setHighScores(newHighScores)
        localStorage.setItem("quizHighScores", JSON.stringify(newHighScores))
      }
    }
  }

  // Restart the quiz
  const restartQuiz = () => {
    setQuizState("not-started")
  }

  // Go back to category selection
  const goToCategories = () => {
    setQuizState("category-selection")
    setSelectedCategory(null)
  }

  // Get current high score for selected category
  const getCurrentHighScore = () => {
    if (!selectedCategory) return 0
    return highScores[selectedCategory.id] || 0
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex justify-end mb-4">
        <ThemeToggle />
      </div>

      <Card className="w-full p-6">
        {quizState === "category-selection" && (
          <CategorySelection
            categories={QUIZ_CATEGORIES}
            highScores={highScores}
            onSelectCategory={handleCategorySelect}
          />
        )}

        {quizState === "not-started" && selectedCategory && (
          <div className="flex flex-col items-center space-y-6">
            <h2 className="text-2xl font-bold text-center">
              {selectedCategory.icon} {selectedCategory.name} Quiz
            </h2>

            {getCurrentHighScore() > 0 && (
              <p className="text-lg font-medium">Your High Score: {getCurrentHighScore()}/10</p>
            )}

            <div className="space-y-4 w-full max-w-xs">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Difficulty:</label>
                <select
                  className="w-full p-2 border rounded-md bg-background"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <Button className="w-full" size="lg" onClick={fetchQuestions}>
                Start Quiz
              </Button>

              <Button className="w-full" variant="outline" onClick={goToCategories}>
                Back to Categories
              </Button>
            </div>

            <div className="text-sm text-muted-foreground space-y-2">
              <p>• 10 multiple-choice questions</p>
              <p>• 15 seconds per question</p>
              <p>• Your high score will be saved</p>
            </div>
          </div>
        )}

        {quizState === "loading" && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg">Loading questions...</p>
          </div>
        )}

        {quizState === "in-progress" && questions.length > 0 && selectedCategory && (
          <>
            <div className="mb-4 flex items-center justify-center">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {selectedCategory.icon} {selectedCategory.name}
              </span>
            </div>
            <QuestionCard
              question={questions[currentQuestionIndex]}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              onAnswerSelect={handleAnswerSelect}
              onTimeUp={handleTimeUp}
            />
          </>
        )}

        {quizState === "completed" && selectedCategory && (
          <Results
            score={score}
            totalQuestions={questions.length}
            onRestart={restartQuiz}
            onBackToCategories={goToCategories}
            highScore={getCurrentHighScore()}
            categoryName={selectedCategory.name}
            categoryIcon={selectedCategory.icon}
          />
        )}
      </Card>
    </div>
  )
}

export default QuizApp

