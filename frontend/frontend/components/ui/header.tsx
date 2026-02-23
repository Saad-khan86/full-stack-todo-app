import React from 'react';
import Logo from './logo';

const Header = () => {
  return (
    <header className="container mx-auto flex items-center py-6 px-4">
      <Logo />
      <div className="ml-4">
        <h1 className="text-4xl font-bold text-gray-800">TODO</h1>
        <p className="text-sm text-gray-500">Tick, Tack, Todo's on Track - Organize, Prioritize, and Relax!</p>
      </div>
    </header>
  );
};

export default Header;