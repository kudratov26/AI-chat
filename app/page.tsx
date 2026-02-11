import { Header } from "@/components/layout/Header/Header"
import { Chat } from "@/components/Chat"
import { Transcript } from "@/components/Transcript"

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black/95">
      <Header />
      <main className="flex h-full w-full">
        <Chat />
        <Transcript />
      </main>
    </div>
  );
}
