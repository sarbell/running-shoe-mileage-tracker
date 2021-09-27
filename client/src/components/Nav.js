import React from "react";
import { Link } from "react-router-dom";



function Nav(){

    return (
        <nav className="navbar customNavColor is-dark" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
            <a className="navbar-item" href="https://bulma.io">
            </a>

            <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            </a>
        </div>

        <div id="navbarBasicExample" className="navbar-menu">
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