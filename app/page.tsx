import QuizApp from "@/components/quiz-app"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-8">Ultimate Quiz App</h1>
      <QuizApp />
    </main>
  )
}

