import NavBar from "@/components/NavBar";
import TodoList from "@/components/TodoList";


export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <NavBar />
      <main className="container mx-auto mt-2 p-4 max-w-2xl">
        <TodoList />
      </main>
    </div>
  );
}
