import React from 'react'
import { useHistory } from 'react-router-dom'


function ProgressBar(props){
    const history = useHistory()
    const s = props.shoe

    let color = 'grey'
    if(s.miles <=250){
        color = "hsl(141, 71%, 48%)"
    }else if (s.miles > 250 && s.miles <= 350){
        color = "#ffe66d"
    }else if(s.miles > 350 && s.miles <= 425){
        color = "##ff6b6b"
    }else if(s.miles > 425){
        color = "red"
    }


    return(
        <>
        <div>
            <h2 className="shoeTitle" onClick={() => history.push(`/shoe/${s.id}`)}>{s.nickname}</h2>
            <p > <strong>{s.brand}, {s.model} </strong> -  {s.status ? 'Current Shoe': 'Retired'}
                <span className="is-pulled-right"><strong>{s.miles} miles</strong></span>
            </p>
            <button className="button " onClick={() => history.push(`/shoe/addmiles/${s.id}`)}>add miles</button>


            <div className="progressBar">
                <div style={{backgroundColor: `${color}`, width: `${(s.miles / 550) * 100}% `}} max="550" className="bar"></div>
            </div>
        </div>
        <br></br>
        <br></br>


        </>
    )
}

export default ProgressBar;