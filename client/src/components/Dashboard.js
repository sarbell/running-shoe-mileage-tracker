import React, {useContext} from "react";
import DashboardLayout from "./DashboardLayout";
import { ShoeContext } from "./ShoeRouter";
import { Link } from "react-router-dom";



function Dashboard(){
    let {shoes, authenticated} = useContext(ShoeContext)

    if(!authenticated){
        document.location = '/login'
        return <></>
      } 

    let deleteNotification = () => {
        let notifyDiv = document.querySelector('.notification')
        notifyDiv.parentNode.removeChild(notifyDiv)
    }

    let notifications = [] 
    if(shoes){  
        for(let i = 0; i < shoes.length; i++){
            let shoe = shoes[i]
            if(shoe.miles >= 250 && shoe.miles <= 350){
                notifications.push(
                    <div key={i} className={`top-notification-bar notification is-warning column`}>
                        <button onClick={deleteNotification} className="delete"></button>
                        <h3>{`${shoe.nickname} is getting pretty used. Time to start thinking of your next shoe.`}</h3> 
                    </div>
                )
            }else if(shoe.miles > 350 && shoe.miles <= 425){
                notifications.push(
                    <div key={i} className={`top-notification-bar notification is-danger column`}>
                        <button onClick={deleteNotification} className="delete"></button>
                        <h3>{`${shoe.nickname} is almost out of life!! Pick up a new shoe before injury occurs.`}</h3> 
                    </div>
                )
            }
            else if(shoe.miles > 425){       
                notifications.push(
                    <div key={i} className={`top-notification-bar notification red column`}>
                        <button onClick={deleteNotification} className="delete"></button>
                        <h3>{`${shoe.nickname} is DONE! Retire this trusty pair and start on a fresh one ASAP!`}</h3> 
                    </div>
                )
            }
        } 
    }

    return (
        <div className="columns main-dash is-multiline">
            <div className="column side-menu is-2">
                <aside className="menu">
                    <p className="custom-menu-label is-size-4">
                        Hello!
                    </p>
                    
                    <ul className="menu-list is-size-5">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/dashboard">Dashboard</Link></li>
                    </ul>
                    <p className="custom-menu-label is-size-4">
                        Account
                    </p>
                    <ul className="menu-list is-size-5">
                        <li><Link to="/logout">Logout</Link></li>
                    </ul>
                </aside>
            </div>
            <br></br>
            <div className="column">
                {notifications} 
                <div className="column">
                    <section>
                        <DashboardLayout/>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;