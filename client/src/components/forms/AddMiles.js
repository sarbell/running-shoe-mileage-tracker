import React, {useContext} from "react";
import { useParams } from 'react-router'
import { ShoeContext } from '../ShoeRouter'
import { useFormik } from 'formik'
import * as yup from 'yup'
import 'react-toastify/dist/ReactToastify.css'
import "animate.css/animate.min.css";
import { toast, cssTransition } from 'react-toastify'

// https://animate.style/
const bounce = cssTransition({
    enter: "animate__animated animate__bounceIn",
    exit: "animate__animated animate__bounceOut"
  });

function ValidationMessage({message}){
    return <p className="help is-danger">{message}</p>
}

const validationSchema = yup.object({
    today_miles: yup.number().required('Please enter how many miles you run.').min(0),
    day_ran: yup.date().required('Select the day of your run'),
})

toast.configure()


function AddMiles(){
    let {shoes} = useContext(ShoeContext)
    let {sid} = useParams()
    let shoe = sid ? shoes.find(s => s.id === sid) : {}


    function addMilesToTotal(values){
        let value = shoe.miles + values.today_miles
        value = {"miles": value}
        fetch(`/api/shoe/updateMiles/${shoe.id}`, {
            method: 'PUT',
            headers:{
                "Content-Type": "application/json"
            },
            credentials: 'same-origin',
            body: JSON.stringify(value)
        }).then((response) => {
            if(!response.ok) throw Error('Failed to add miles to shoe')
            return response.text()
        }).then(()=> {
            document.location = '/dashboard'

        }).catch((error) => {
            console.log(error)
            document.location = '/dashboard'

        })
    }

    const {handleSubmit, handleChange, values, errors} = useFormik({
        initialValues: {
            today_miles: '',
            day_ran: ''
        },
        validationSchema,
        onSubmit(values){
            fetch(`/api/shoe/addmiles/${shoe.id}`, {
                method: "POST",
                headers:{
                    "Content-Type": "application/json"
                },
                credentials: 'same-origin',
                body: JSON.stringify(values)
            }).then((response) => {
                if(!response.ok) throw Error('Failed to add miles')
                return response.text()
            }).then(()=> {
                toast.success('Successfully submitted!', {
                    onClose: () => {
                        addMilesToTotal(values)
                    },
                    transition: bounce
                })
            }).catch((error) => {
                toast.error(`Action Failed!`, {
                    onClose: () => {
                        document.location = '/dashboard'
                    },
                    transition: bounce
                })
            })
        }
    })

    return (
        <section className="shoeForm">
            <br/>
        <div className="container mt-5">
            <div className="columns is-mobile">
                <div className="column box is-half is-offset-one-quarter">
                    
                    <h1 className="title is-1 header-text">Add Miles for Your Run with <strong>{shoe.nickname}</strong></h1>
                    <form onSubmit={handleSubmit} className="shoeAddFormInput">

                        <div className="field">
                            <label htmlFor="today_miles" className="label">How many miles did you run?</label>
                            <div className="control">
                                <input id="today_miles" name="today_miles" className={`input form-control ${errors.today_miles ? 'is-invalid' : ''}`} type="number" placeholder="" value={values.today_miles} onChange={handleChange} />
                                <ValidationMessage message={errors.today_miles} />
                            </div>
                        </div>

                        <div className="field">
                            <label htmlFor="day_ran" className="label">Day of your run</label>
                            <div className="control">
                                <input id="day_ran" name="day_ran" className={`input form-control ${errors.day_ran ? 'is-invalid' : ''}`} type="date" value={values.day_ran} onChange={handleChange} />
                                <ValidationMessage message={errors.day_ran} />
                            </div>
                        </div>
              
                        <div className="field is-grouped">
                            <div className="control">
                                <button type="submit" className="button is-success">Add</button>
                                <button type="button" onClick={()=>document.location = '/dashboard'} className="button is-light" to="/dashboard">Cancel</button>
                            </div>
                        </div>

                    </form>
                    
                </div>
            </div>
        </div>
        </section>
    )
}

export default AddMiles;