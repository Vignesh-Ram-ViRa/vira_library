import React from 'react';
import { Link } from 'react-router-dom';
import { Counter } from '../features/counter/Counter';
import logo from '/vite.svg';

function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React!</p>
        <p>
          <Counter />
        </p>
        <p>
          <Link to="/about" className="App-link">About</Link>
        </p>
      </header>
    </div>
  );
}

export default Home;