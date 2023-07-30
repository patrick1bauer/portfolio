import Link from "next/link";
import React from "react";

export default function SideNav() {
  return (
    <nav role="navigation">
      <div id="menuToggle">
        <input type="checkbox" />
        <span className="burger"/>
        <span className="burger"/>
        <span className="burger"/>
        <ul id="menu">
          <Link href="/">
            <li>Patrick Bauer</li>
          </Link>
          <Link href="/about">
            <li>About</li>
          </Link>
          <Link href="/contact">
            <li>Contact</li>
          </Link>
          <Link href="/legal">
            <li>Legal</li>
          </Link>
        </ul>
      </div>
    </nav>
  );
}
