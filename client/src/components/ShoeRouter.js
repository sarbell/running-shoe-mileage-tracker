import React, { createContext, useEffect, useState } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import LoginForm from "./forms/Login";
import Home from "./Home";
import Registration from "./forms/Register";
import AddShoeForm from './forms/AddShoeForm';
import ShoeSpec from './ShoeSpec'

import { useCookies } from 'react-cookie'
import About from './About';
import Dashboard from './Dashboard';
import Logout from './forms/Logout'
import AddMiles from './forms/AddMiles'

export const ShoeContext = createContext()

export default function ShoeRouter(){
    // router code for getting api stuff
    const [shoes, setShoes] = useState()
    const [cookies] = useCookies(['token'])
    let [authenticated, setAuthenticated] = useState(cookies.token !== undefined)

    useEffect(() => {
        if(!shoes){
            fetch('/api/shoe', {
                credentials: 'same-origin',
            })
            .then(response => response.text())
            .then((data) => {
                setShoes(JSON.parse(data, (key, value) => {
                const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:.*Z$/
                if(typeof value === 'string' && dateFormat.test(value)){
                    return new Date(value)
                }
                return value
                }))
            })
            .catch(console.error)
        }
    })
    

    return (
        <ShoeContext.Provider value={{shoes, setShoes, authenticated, setAuthenticated}}>
            <Switch>
                <Route exact path="/"><Home /></Route>
                <Route path="/login"><LoginForm /></Route>
                <Route path="/register"><Registration /></Route>
                <Route path="/about"><About /></Route>
                <Route path="/dashboard">{!authenticated ?<LoginForm /> : <Dashboard />}</Route>
                <Route path="/logout">{!authenticated ?<LoginForm /> : <Logout />}</Route>
                <Route path="/add/shoe">{!authenticated ?<LoginForm /> : <AddShoeForm></AddShoeForm>}</Route>
                <Route path="/shoe/:sid/update">{!authenticated ?<LoginForm /> : <AddShoeForm></AddShoeForm>}</Route>
                <Route path="/shoe/addmiles/:sid">{!authenticated ?<LoginForm /> : <AddMiles></AddMiles>}</Route>
                <Route path="/shoe/:sid">{!authenticated ?<LoginForm /> : <ShoeSpec></ShoeSpec>}</Route>
                <Redirect from="" to="/" />
            </Switch>
          </ShoeContext.Provider>

        
    )
}