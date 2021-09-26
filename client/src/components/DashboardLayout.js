import React, {useContext} from "react";
import { useHistory } from 'react-router-dom'
import { ShoeContext } from './ShoeRouter'
import ProgressBar from './ProgressBar'


function DashboardLayout( ){
    let {shoes, authenticated} = useContext(ShoeContext)
    const history = useHistory()

    if(!authenticated){
      document.location = '/login'
      return <></>
    } 
    
    // needs to be for the logged in user
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
    let sunday = new Date(currentDay.setDate(first))
    let saturday = new Date(currentDay.setDate(last))
    // console.log(sunday)
    // console.log(saturday)
    if(shoes){
        for(let i = 0; i < shoes.length; i++){
            console.log(shoes[i].first_date)
            if(shoes[i].first_date >= sunday && shoes[i].first_date <= saturday){
              weekSoFar += shoes[i].miles
              // console.log(weekSoFar)
            }
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
                <h3 className="is-size-3">
                  Running Shoe Tracker 
                  <button onClick={() => history.push(`/add/shoe`)} className="add-shoe-btn button is-info is-outline is-pulled-right">Add Shoe</button>
                </h3>
                <h4 className="is-size-7">It is reccomended to replace your running shoes after about 300 miles. Green is good, yellow is a reminder that they are getting old. Orange is time to change, and red is stop running in those old shoes!</h4>
              <br></br>
              {/* <div className="container tabs-container">
                    <div className="tabs is-boxed">
                        <ul>
                            <li className="current">
                                <a><span>Current</span></a>
                            </li>
                            <li className="retired">
                                <a><span>Retired</span></a>
                            </li>
                            <li className="all">
                                <a><span>All</span></a>
                            </li>
                        </ul>
                    </div>
              </div> */}

              <div className="box container">
                {progressBars}
              </div>
          </div>


      </div>
    )
}

export default DashboardLayout;