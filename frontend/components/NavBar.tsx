import { NotepadText } from 'lucide-react';

const NavBar = () => {
  return (
    <header className="container mx-auto flex items-center py-6 px-4 border-b border-gray-300">
      <NotepadText size={ 60} color="teal" />
      {/* <Logo /> */}
      <div className="ml-4">
        <h1 className="text-4xl font-bold text-gray-800">TODO</h1>
        <p className="text-sm text-gray-500">Tick, Tack, Todo's on Track - Organize, Prioritize, and Relax!</p>
      </div>
    </header>
  );
};

export default NavBar;