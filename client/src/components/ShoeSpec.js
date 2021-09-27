import React, {useContext} from 'react'
import { useHistory, useParams, Link } from 'react-router-dom'
import { ShoeContext } from './ShoeRouter'
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa'
import Nav from './Nav'
import 'react-toastify/dist/ReactToastify.css'
import "animate.css/animate.min.css";
import { toast, cssTransition } from 'react-toastify'

// https://animate.style/
const bounce = cssTransition({
    enter: "animate__animated animate__bounceIn",
    exit: "animate__animated animate__bounceOut"
  });




function ShoeSpec(){
    const history = useHistory()
    let {shoes, authenticated} = useContext(ShoeContext)
    let {sid} = useParams()
    let s = sid ? shoes.find(s => s.id === sid) : {}

    if(!authenticated){
        document.location = '/login'
        return <></>
      } 

    let deleteShoe = () => {
        if(window.confirm('Are you sure you want to delete this shoe?')){
            fetch(`/api/shoe/delete/${s.id}`, {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json"
                },
                credentials: 'same-origin',
            }).then(()=> {
                toast.success('Sucessfully deleted!', {
                    onClose: () => {
                        document.location = "/dashboard"
                    },
                    transition: bounce
                })
            }).catch((error) => {
                toast.error('Failed to delete!', {
                    onClose: () => {
                        document.location = "/dashboard"
                    },
                    transition: bounce
                })
            })
        }
    }


    return(
        <div>
        <Nav></Nav>
        <div className="columns main-dash is-multiline">
            <br></br>
            <div className="column">
                <div className="column">
                    <section>
                        <div className="container box shoeSpec">
                            <h1 className="title is-2">{s.nickname}  -  {s.miles} miles</h1>
                            <hr className="line"></hr>
                            <h2 className="subtitle is-3">{s.brand}, {s.model}</h2>
                            <p><strong>SIZE: </strong>{s.size}</p>
                            <p><strong>CURRENT USE: </strong>{s.status ? 'Yes' : 'Retired'}</p>
                            <p><strong>TYPE: </strong>{s.type}</p>
                            <p><strong>NOTES: </strong>{s.notes}</p>
                            <br></br>
                            <div className="buttons">
                                <button className="button is-info" onClick={() => history.push(`/shoe/${s.id}/update`)} ><FaPencilAlt className="icon is-small"></FaPencilAlt><span>Edit</span></button>
                                <button className="button is-danger" onClick={deleteShoe} ><FaTrashAlt className="icon is-small"></FaTrashAlt><span>Delete</span>  </button>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
        </div>


    )
}

export default ShoeSpec;