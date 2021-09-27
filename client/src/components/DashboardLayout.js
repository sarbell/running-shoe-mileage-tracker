import React, {useContext, useState, useEffect} from "react";
import { useHistory } from 'react-router-dom'
import { ShoeContext } from './ShoeRouter'
import ProgressBar from './ProgressBar'
import { FaPlusCircle } from 'react-icons/fa'


function DashboardLayout( ){
    let {shoes} = useContext(ShoeContext)
    const history = useHistory()
    const [logs, setLogs] = useState()
    
    let totalMiles =0 
    if(shoes){
        for(let i = 0; i < shoes.length; i++){
            totalMiles += shoes[i].miles
        }
    }

    // week so far
    // this is wrong!! 
    let weekSoFar = 0
    let currentDay = new Date();
    let first = currentDay.getDate() - currentDay.getDay()
    let last = first + 6
    let sunday = new Date(currentDay.setDate(first)).toUTCString()
    let saturday = new Date(currentDay.setDate(last)).toUTCString()
    currentDay = new Date().toUTCString()
    console.log(`Current Date:    ${currentDay}`)
    console.log(`Sunday:          ${sunday}`)
    console.log(`Saturday:        ${saturday}`)

    function getMileageLogs(shoeId){
          fetch(`api/mileEntries/${shoeId}`, {
            method: "GET",
            headers:{
              "Content-Type":"application/json"
            },
            credentials: 'same-origin',
          }).then(response => response.json()
          ).then((data) => {
            data.map(d => {
              let runDate = new Date(d.day_ran).toUTCString()
              console.log(runDate)
              if(runDate <= sunday && runDate >= saturday){
                weekSoFar += d.today_miles
              }
            })
            console.log(weekSoFar)
          }).catch((err) =>{
            console.log(err)
          })
    }


    if(shoes){
      for(let i = 0; i < shoes.length; i++){
        getMileageLogs(shoes[i].id)
      }
    }

    // Weekly Average
    // math
    let weeklyAverage = 0;


    let progressBars
    if(shoes){
        progressBars = shoes.map(s => {return <ProgressBar key={s.id} shoe={s}/>})
    }else{
        progressBars = <h3>Please add a shoe and start tracking! Your progress will be shown here.</h3>
    }

    
    return (
      <div className="columns graphs">
          <div className="column is-3">
              <div className="container main-content">
                <div className="box has-text-centered">
                    <h3 className="is-size-4">Total Miles</h3>
                    <small></small>
                    <p className="totalMilesOnAppNum">{totalMiles}</p>
                </div>
              </div>

              <div className="container  main-content">
                <div className="box has-text-centered">
                    <h3 className="is-size-4">Week so far</h3>
                    <p className="totalMilesOnAppNum">{weekSoFar}</p>

                </div>
              </div>
            
              <div className="container  main-content">
                <div className="box has-text-centered">
                    <h3 className="is-size-4">Weekly average</h3>
                    <p className="totalMilesOnAppNum">{weeklyAverage}</p>
                </div>
              </div>
            
          </div>

          <div className="column">
                <h3 className="is-size-2 ">
                  Running Shoe Tracker 
                  <button onClick={() => history.push(`/add/shoe`)} className="add-shoe-btn button is-info is-pulled-right"> <FaPlusCircle></FaPlusCircle>  Add Shoe</button>
                </h3>
                <h4 className="is-size-5">It is reccomended to replace your running shoes after about 300 miles. Green is good, yellow is a reminder that they are getting old, orange is time to change, and red is stop running in those old shoes!</h4>
              <br></br>
              <div className="box container">
                {progressBars}
              </div>
          </div>


      </div>
    )
}

export default DashboardLayout;