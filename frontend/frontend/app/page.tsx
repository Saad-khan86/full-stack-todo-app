import Header from "@/components/ui/header";
import TodoList from "./todo_list";


export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Header />
      <main>
        <TodoList />
      </main>
    </div>
  );
}
