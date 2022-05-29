import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import "./Navbar.css";

export default function NavbarAdmin() {
  const [open, setOpen] = useState(false);
  return (
    <nav>
      <div className="header">
        <NavLink to="/">
          <i className="fab fa-hive" /> Admin
        </NavLink>
      </div>
      <ul
        className="navbar-links"
        style={{ transform: open ? "translateX(0px)" : "" }}
      >
        <li>
          <NavLink to="/Verification" activeClassName="nav-active">
            Verifikasi
          </NavLink>
        </li>
        <li>
          <NavLink to="/AddCandidate" activeClassName="nav-active">
            Tambah Kandidat
          </NavLink>
        </li>
        <li>
          <NavLink to="/Registration" activeClassName="nav-active">
            <i className="far fa-registered" /> Pendaftaran
          </NavLink>
        </li>
        <li>
          <NavLink to="/Voting" activeClassName="nav-active">
            <i className="fas fa-vote-yea" /> Pemilihan
          </NavLink>
        </li>
        <li>
          <NavLink to="/Results" activeClassName="nav-active">
            <i className="fas fa-poll-h" /> Hasil
          </NavLink>
        </li>
      </ul>
      <i onClick={() => setOpen(!open)} className="fas fa-bars burger-menu"></i>
    </nav>
  );
}
