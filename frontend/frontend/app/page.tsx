import Header from "@/components/ui/header";
import TodoList from "../components/ui/todo_list";
import { Modal } from "@/components/ui/modal";


export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Header />
      <main className="container mx-auto mt-2 p-4 max-w-2xl">
        < Modal />
        <TodoList />
      </main>
    </div>
  );
}
