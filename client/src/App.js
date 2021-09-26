import React from "react";
import "./App.css";
import ShoeRouter from './components/ShoeRouter.js'
import {BrowserRouter as Router} from 'react-router-dom'

function App() {

  return (
    <>
      <header></header>
      <main>
          <Router>
            <ShoeRouter />
          </Router>
      </main>
      <footer className="footer has-background-grey-light has-text-light">
        <div className="content has-text-centered">
          <p>
            <strong>Bulma</strong> by <a href="https://jgthms.com">Jeremy Thomas</a>. The source code is licensed
            <a href="http://opensource.org/licenses/mit-license.php">MIT</a>. The website content
            is licensed <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY NC SA 4.0</a>.
          </p>
        </div>
      </footer>
    </>
  );
}

export default App;