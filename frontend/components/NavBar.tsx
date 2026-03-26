import { NotepadText } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';

const NavBar = () => {
  return (
    <header className="container mx-auto flex items-center justify-between py-6 px-4 border-b border-gray-300">
      <div className='flex items-center justify-between gap-3'>
        <NotepadText size={60} color="teal" />
        {/* <Logo /> */}
        <div>
          <h1 className="text-4xl font-bold text-gray-800">TODO</h1>
          <p className="text-sm text-gray-500">Tick, Tack, Todo's on Track - Organize, Prioritize, and Relax!</p>
        </div>
      </div>
      <div className='flex items-center justify-between gap-3'>
        <Link href={"/login"} className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-1.5 px-4 rounded-sm shadow-md transition-colors flex items-center justify-center">
          Login 
        </Link>
        <Link href={"/register"} className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-1.5 px-4 rounded-sm shadow-md transition-colors flex items-center justify-center">
          Register
        </Link>
      </div>
    </header>
  );
};

export default NavBar;