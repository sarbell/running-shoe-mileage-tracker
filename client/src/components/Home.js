import React, {useContext} from "react";
import { Link } from 'react-router-dom';
import { ShoeContext } from "../components/ShoeRouter";
import About from '../components/About'

function Home(){
let {authenticated} = useContext(ShoeContext)

    return (
        <>
            <section className="hero is-large">
                <div className="hero-body">
                    <div className="container has-text-centered">
                        <h1 className="hero-text-main">
                            Stop wearing your sole <span className="thin">thin</span>.
                        </h1>
                        <p className="subtitle is-3">
                            Tracking your running shoe mileage just became a breeze.
                        </p>
                        
                        {!authenticated 
                            ? <Link to="/login" className="button is-large is-danger">Start Tracking!</Link>
                            : <Link to="/dashboard" className="button is-large is-danger">Start Tracking!</Link>
                        }
                    </div>
                </div>
            </section>
            <section className="section about-section">
                <About></About>
            </section>
        </>
    )
}

export default Home;