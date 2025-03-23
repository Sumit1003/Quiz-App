"use client"

import { Card } from "@/components/ui/card"
import { Trophy } from "lucide-react"
import type { QUIZ_CATEGORIES } from "./quiz-app"

type CategorySelectionProps = {
  categories: typeof QUIZ_CATEGORIES
  highScores: Record<number, number>
  onSelectCategory: (category: (typeof QUIZ_CATEGORIES)[0]) => void
}

const CategorySelection = ({ categories, highScores, onSelectCategory }: CategorySelectionProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Choose a Quiz Category</h2>
        <p className="text-muted-foreground">Select a category to test your knowledge</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card
            key={category.id}
            className="p-4 cursor-pointer hover:bg-accent transition-colors duration-200 flex flex-col"
            onClick={() => onSelectCategory(category)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl">{category.icon}</div>
              {highScores[category.id] ? (
                <div className="flex items-center text-amber-500 text-sm font-medium">
                  <Trophy className="h-3.5 w-3.5 mr-1" />
                  {highScores[category.id]}/10
                </div>
              ) : null}
            </div>
            <h3 className="font-medium">{category.name}</h3>
            <p className="text-xs text-muted-foreground mt-1">10 multiple-choice questions</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default CategorySelection

