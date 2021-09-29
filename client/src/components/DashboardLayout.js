import React, {useContext, useEffect, useState} from "react";
import { useHistory } from 'react-router-dom'
import { ShoeContext } from './ShoeRouter'
import ProgressBar from './ProgressBar'
import { FaPlusCircle } from 'react-icons/fa'
import { FaCaretDown} from 'react-icons/fa'
import {differenceInWeeks, format} from 'date-fns'


function DashboardLayout( ){
    let {shoes} = useContext(ShoeContext)
    const history = useHistory()
    const [filterShoes, setFilterShoes] = useState([])
    const [isActive, setActive] = useState(false)
    const [isChanged, setChanged] = useState(false)
    const [weeklyAvg, setWeeklyAvg] = useState(0)
    const [logs, setLogs] = useState([])
    const [weekSoFar, setWeekSoFar] = useState(0)
    const [runningLogs, setHistoryLog] = useState([])
    const [loading, setLoading] = useState(true)

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
    let historyLogs = []

    function calculateWeekSoFar(){
      if(shoes){
        let fetchCalls = []
        let arr = []
        for(let i = 0; i < shoes.length; i++){
            fetchCalls.push(
            fetch(`api/mileEntries/${shoes[i].id}`,{
              method: "GET",
              headers:{
                "Content-Type":"application/json"
              },
              credentials: 'same-origin',
            })
            .then(response => response.json())
            .then(response => {
              arr.push(response)
            })
            .catch((err)=>{
              console.log(err)
            })
          )
        }
      
        Promise.all(fetchCalls).then(function() {
          setLogs([...arr])
        })
        
        if(logs){
          let d 
          let runDate
          for(let i = 0; i < logs.length; i++){
            for(let j = 0; j < logs[i].length; j++){
              d = logs[i][j]
              runDate = new Date(d.day_ran)
              if(runDate <= saturday && runDate >= sunday){
                weeklyMiles += d.today_miles
              }
              historyLogs.push(d)
            }
          }
          setWeekSoFar(weeklyMiles)
          setHistoryLog(historyLogs)
        }
      }
    }

if(shoes && logs){
  let foundName
  for(let i = 0; i < runningLogs.length; i++){
      foundName = shoes.find(s => s.id === runningLogs[i].shoe_ran_in )
      foundName = foundName.nickname
      runningLogs[i].nickname = foundName
  }
  runningLogs.sort((a,b)=> (a.day_ran < b.day_ran) ? 1 : -1)
}

let runHistory
runHistory = 
      <div>
        <ul className="has-text-left">
          {runningLogs.map(rl => {return <li key={rl.id} rlog={rl}>- {rl.today_miles} mi on {format(new Date(rl.day_ran), 'MM/dd')} in {rl.nickname}</li>})}
        </ul>
      </div>

    // Weekly Average since start of first shoe added
    useEffect(()=> {
      if(loading){
        console.log('loading')
      }else{
        if(shoes != undefined || shoes.length > 0){
        shoes.sort((a, b) => (a.first_date > b.first_date) ? 1 : -1 )
        let oldest = shoes[0]
        oldest = oldest.first_date
        let today = new Date()
        let weeks = differenceInWeeks(today, oldest)
        let weeklyAverage = Math.round(totalMiles / weeks)
        setWeeklyAvg(weeklyAverage)
        calculateWeekSoFar()
      }
      }
      
    }, [shoes])
    
    // Order of shoes
    // Sort most least -> great miles 
    function sortLeastToGreatMiles(shoes){
      setChanged(false)
      const filteredShoes = shoes.sort((a, b) => (a.miles > b.miles) ? 1 : -1 )
      setFilterShoes([...filteredShoes])
    }
    
    // Sort most great -> least miles 
    function sortGreatToLeastMiles(shoes){
      setChanged(false)
      const filteredShoes = shoes.sort((a, b) => (a.miles < b.miles) ? 1 : -1 )
      setFilterShoes([...filteredShoes])
    }

    // Sort newest -> older
    function sortNewToOld(shoes){
      setChanged(false)
      const filteredShoes = shoes.sort((a, b) => (a.first_date < b.first_date) ? 1 : -1 )
      setFilterShoes([...filteredShoes])
    }

    // Sort oldest -> newest
    function sortOldToNew(shoes){
      setChanged(false)
      const filteredShoes = shoes.sort((a, b) => (a.first_date > b.first_date) ? 1 : -1 )
      setFilterShoes([...filteredShoes])
    }

    // Show only x type of shoe
    function showOnlyType(shoes, type){
      setChanged(true)
      const result = shoes.filter(shoe => shoe.type === type)
      setFilterShoes([...result])
    }
   
    // Show only current / retired shoes
    function showOnlyStatus(shoes, status){
      setChanged(true)
      const result = shoes.filter(shoe => shoe.status === status)
      setFilterShoes([...result])
    }

    // Show all shoes
    function showAllShoes(shoes){
      setChanged(false)
      setFilterShoes([...shoes])
    }

    let showFilters = false
    let progressBars
    if(shoes){
      if(shoes.length >= 1){
        showFilters = true
        if(isChanged){
          progressBars = filterShoes.map(s => {return <ProgressBar key={s.id} shoe={s}/>})

        }else{
          progressBars = shoes.map(s => {return <ProgressBar key={s.id} shoe={s}/>})
        }
        
      }else{
        progressBars = <h3>Please add a shoe and start tracking! Your progress will be shown here.</h3>
      }
    }

    const handleToggle = () => {
      setActive(!isActive)
    }

    let filters
    if(shoes && showFilters){
      filters = 
        <div className="columns is-desktop">
            <div className={isActive ? 'dropdown is-active column is-one-fifth' : 'dropdown column is-one-fifth'}>
              <div className="dropdown-trigger">
                <button onClick={handleToggle} className="button" aria-haspopup="true" aria-controls="dropdown-menu2">
                  <span>Filter Shoes <FaCaretDown></FaCaretDown></span>
                </button>
              </div>
              <div className="dropdown-menu" id="dropdown-menu2" role="menu">
                <div className="dropdown-content">
                  <div className="dropdown-item filterItem">
                    <p onClick={()=>sortNewToOld(shoes)}>SHOES: Newest to Oldest</p>
                  </div>
                  <div className="dropdown-item filterItem">
                    <p onClick={()=>sortOldToNew(shoes)}>SHOES: Oldest to Newest</p>
                  </div>
                  <div className="dropdown-item filterItem">
                    <p onClick={()=>sortGreatToLeastMiles(shoes)}>MILES: Most to Least</p>
                  </div>
                  <div className="dropdown-item filterItem">
                    <p onClick={()=>sortLeastToGreatMiles(shoes)}>MILES: Least to Most</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="colum p-0">
              <h4>Type of Shoe</h4>
              <div className="buttons has-addons">
                <button onClick={()=>showOnlyType(shoes, 'road')} className="button is-small">Road Shoes</button>
                <button onClick={()=>showOnlyType(shoes, 'trail')} className="button is-small">Trail Shoes</button>
                <button onClick={()=>showOnlyType(shoes, 'racing')} className="button is-small">Racing Shoes</button>
              </div>
            </div>
            <div className="column p-0 mr-6">
            <h4>Status of Shoe</h4>
              <div className="buttons has-addons">
                <button onClick={()=>showOnlyStatus(shoes, true)} className="button is-small">Current Shoes</button>
                <button onClick={()=>showOnlyStatus(shoes, false)} className="button is-small">Retired Shoes</button>
                <button onClick={()=>showAllShoes(shoes)} className="button is-small">All Shoes</button>
              </div>
            </div>
        </div>    
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
                    <h3 className="is-size-4">Week So Far</h3>
                    <small>Not showing? <span className="has-text-info" onClick={()=>calculateWeekSoFar()}>Update</span></small>
                    <p className="totalMilesOnAppNum">{weekSoFar}</p>
                </div>
              </div>

              <div className="container  main-content">
                <div className="box has-text-centered">
                    <h3 className="is-size-4">Weekly Average</h3>
                    <small>From the date of oldest shoe's first run</small>
                    <p className="totalMilesOnAppNum">{weeklyAvg}</p>
                </div>
              </div>

              <div className="container main-content">
                <div className="box has-text-centered">
                    <h3 className="is-size-4">Running Log</h3>
                    {runHistory}
                </div>
              </div>
                        
          </div>
          <div className="column">
                <h3 className="is-size-2 ">
                  Running Shoe Tracker 
                  <button onClick={() => history.push(`/add/shoe`)} className="add-shoe-btn button is-info is-pulled-right"> <FaPlusCircle></FaPlusCircle>  Add Shoe</button>
                </h3>
                <h4 className="is-size-5">It is recommended to replace your running shoes after about 350 miles. Green is good, yellow is a reminder that they are getting old, orange is time to change, and red is stop running in those old shoes!</h4>
              <br></br>
              <div className="box container">
                <div className="block">
                 {filters}
                </div>
                  <hr className="about-line"></hr>
                  <br></br>
                <div className="block">
                  {progressBars}
                </div>
              </div>
          </div>


      </div>
    )
}

export default DashboardLayout;