// src/Nav.js
// This is the page where we show everything in the beginning
import React from 'react';
import { Link } from 'react-router-dom';
import './css/Nav.css';

function Nav() {
  return (
    <nav>
      <ul className="nav-list">
        <li><Link to="/refresh">选</Link></li>
        <li><Link to="/collection">集</Link></li>
        <li><Link to="/creation">作</Link></li>
      </ul>
    </nav>
  );
}

export default Nav;
