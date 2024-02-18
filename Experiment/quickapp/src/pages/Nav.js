// src/pages/Nav.js
// This is the page where we show everything in the beginning
import React from 'react';
import { NavLink } from 'react-router-dom'; // Import NavLink
import '../css/Nav.css';

function Nav() {
  return (
    <nav>
      <ul className="nav-list">
        <li>
          <NavLink to="/refresh" className={({ isActive }) => isActive ? 'active-nav-item' : undefined}>选</NavLink>
        </li>
        <li>
          <NavLink to="/collection" className={({ isActive }) => isActive ? 'active-nav-item' : undefined}>集</NavLink>
        </li>
        <li>
          <NavLink to="/creation" className={({ isActive }) => isActive ? 'active-nav-item' : undefined}>作</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
