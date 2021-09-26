import React, {useContext} from 'react'
import { useHistory, useParams, Link } from 'react-router-dom'
import { ShoeContext } from './ShoeRouter'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa'



function ShoeSpec(){
    const history = useHistory()
    let {shoes} = useContext(ShoeContext)
    let {sid} = useParams()
    let s = sid ? shoes.find(s => s.id === sid) : {}



    let deleteShoe = () => {
        if(window.confirm('Are you sure you want to delete this shoe?')){
            fetch(`/api/shoe/delete/${s.id}`, {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json"
                },
                credentials: 'same-origin',
            }).then(()=> {
                toast('Sucessfully deleted!', {
                    onClose: () => {
                        document.location = "/dashboard"
                    }
                })
            }).catch((error) => {
                toast('Failed to delete!', {
                    onClose: () => {
                        document.location = "/dashboard"
                    }
                })
            })
        }
    }


    return(
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
                <div className="column">
                    <section>
                        <div className="container box">
                            <h1 className="title is-2">{s.nickname}  -  {s.miles} miles</h1>
                            <hr className="line"></hr>
                            <h2 className="subtitle is-3">{s.brand}, {s.model}</h2>
                            <p>SIZE: {s.size}</p>
                            <p>CURRENT USE: {s.status ? 'Yes' : 'Retired'}</p>
                            <p>TYPE: {s.type}</p>
                            <p>NOTES: {s.notes}</p>
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


    )
}

export default ShoeSpec;