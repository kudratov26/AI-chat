import { Header } from "@/components/layout/Header/Header"
import { Chat } from "@/components/Chat"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Chat />
      </main>
    </div>
  );
}
