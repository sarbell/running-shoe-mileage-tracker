import React from 'react'
import { useHistory } from 'react-router-dom'
import { FaPlusCircle } from 'react-icons/fa'



function ProgressBar(props){
    const history = useHistory()
    const s = props.shoe


    let color = 'grey'
    if(s.miles <=250){
        color = "hsl(141, 71%, 48%)"
    }else if (s.miles > 250 && s.miles <= 350){
        color = "#ffe66d"
    }else if(s.miles > 350 && s.miles <= 425){
        color = "#ff6b6b"
    }else if(s.miles > 425){
        color = "red"
    }

    let milesLeft = 500 - s.miles
    if (milesLeft < 0){
        milesLeft = `0 miles remaining`
    }else{
        milesLeft = `about ${500 - s.miles} miles remaining`
    }


    return(
        <>
        <div>
            <h2 className="shoeTitle" ><span onClick={() => history.push(`/shoe/${s.id}`)}>{s.nickname}</span>
                <span className="addMilesBtn is-pulled-right" onClick={() => history.push(`/shoe/addmiles/${s.id}`)}><FaPlusCircle></FaPlusCircle>  Miles</span>
            </h2>
            <p><strong>{s.brand}, {s.model}: </strong>{s.type} - {s.status ? 'Current Shoe': 'Retired'} 
                <span className="is-pulled-right"><strong>{s.miles} miles ran</strong>
                {/* <span> - {milesLeft}</span> */}
                </span>
            </p>
            <div className="progressBar">
                <div style={{backgroundColor: `${color}`, width: `${(s.miles / 500) * 100}% `}} max="500" className="bar">
                    <span className="is-pulled-right"><strong>{Math.round((s.miles / 500) * 100)}%</strong></span>
                </div>
            </div>
        </div>
        <br></br>
        <br></br>


        </>
    )
}

export default ProgressBar;