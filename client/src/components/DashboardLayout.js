import React, {useContext} from "react";
import { useHistory } from 'react-router-dom'
import { ShoeContext } from './ShoeRouter'
import ProgressBar from './ProgressBar'
import { FaPlusCircle } from 'react-icons/fa'
// import {format, isAfter, isBefore, isEqual} from 'date-fns'


function DashboardLayout( ){
    let {shoes} = useContext(ShoeContext)
    const history = useHistory()

    // TOTAL MILES
    let totalMiles =0 
    if(shoes){
        for(let i = 0; i < shoes.length; i++){
            totalMiles += shoes[i].miles
        }
    }

    // week so far    
    let currentDay = new Date();
    let first = currentDay.getDate() - currentDay.getDay()
    let last = first + 6
    let sunday = new Date(currentDay.setDate(first))
    let saturday = new Date(currentDay.setDate(last))
    currentDay = new Date()
    let weeklyMiles = 0
    let logs = []
    let weekSoFar = []
    
    function getMileageLogs(shoeId){
          fetch(`api/mileEntries/${shoeId}`, {
            method: "GET",
            headers:{
              "Content-Type":"application/json"
            },
            credentials: 'same-origin',
          }).then(response => response.text()
          ).then((data) => {
            setLogs(JSON.parse(data, (key, value) => {
            const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:.*Z$/
            if(typeof value === 'string' && dateFormat.test(value)){
                return new Date(value)
            }
            return value
            }))
        }).then(() => {
          for(let i = 0; i < logs.length; i++){
            for(let j = 0; j < logs[i].length; j++){
              let d = logs[i][j]
              let runDate = new Date(d.day_ran)
                  if(runDate <= saturday && runDate >= sunday){
                    weeklyMiles += d.today_miles
                  }
            }
          }
        }).then(() => {
          setWeeklyTotal(weeklyMiles)
        })
          .catch((err) =>{
            console.log(err)
          })
    }

    if(shoes){
      for(let i = 0; i < shoes.length; i++){
        getMileageLogs(shoes[i].id)
      }
    }

    function setLogs(x){
      logs.push(x)
    }

    let  weekTotal = 0
    function setWeeklyTotal(t){
        weekSoFar.push(t)
        weekTotal = weekSoFar[weekSoFar.length - 1]
        console.log(weekTotal)

    }
    console.log(weekTotal)


    let progressBars
    if(shoes){
      if(shoes.length >= 1){
        progressBars = shoes.map(s => {return <ProgressBar key={s.id} shoe={s}/>})
      }else{
        progressBars = <h3>Please add a shoe and start tracking! Your progress will be shown here.</h3>
      }
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
                    <p className="totalMilesOnAppNum">{weekTotal}</p>

                </div>
              </div>
            
              {/* <div className="container  main-content">
                <div className="box has-text-centered">
                    <h3 className="is-size-4">Weekly average</h3>
                    <p className="totalMilesOnAppNum">{weeklyAverage}</p>
                </div>
              </div> */}
            
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