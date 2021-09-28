import React from "react";
import { Link } from "react-router-dom";



function Nav(){
    document.addEventListener('DOMContentLoaded', () => {

        // Get all "navbar-burger" elements
        const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
      
        // Check if there are any navbar burgers
        if ($navbarBurgers.length > 0) {
      
          // Add a click event on each of them
          $navbarBurgers.forEach( el => {
            el.addEventListener('click', () => {
      
              // Get the target from the "data-target" attribute
              const target = el.dataset.target;
              const $target = document.getElementById(target);
      
              // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
              el.classList.toggle('is-active');
              $target.classList.toggle('is-active');
      
            });
          });
        }
      
      });

    return (
        <nav className="navbar is-dark" role="navigation" aria-label="main navigation">
        {/* <div className="navbar-brand">
            <a className="navbar-item" href="https://bulma.io">
            </a>

            <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navMenu">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            </a>
        </div> */}

        <div id="navMenu" className="navbar-menu is-active customNavMenuBar">
            <div className="navbar-start">
                <Link to="/" className="navbar-item">
                    Home
                </Link>

                <Link to="/dashboard" className="navbar-item">
                    Dashboard
                </Link>
            </div>

            <div className="navbar-end">
            <div className="navbar-item">
                <div className="buttons">

                <Link to="./logout"className="button is-light">
                    Logout
                </Link>
                </div>
            </div>
            </div>
        </div>
        </nav>
    )
}

export default Nav;