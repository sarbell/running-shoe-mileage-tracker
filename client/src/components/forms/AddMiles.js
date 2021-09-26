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
    first_date: yup.date().required(),
    brand: yup.string().required(),
    model: yup.string().required(),
    size: yup.string().required(),
    type: yup.mixed().oneOf(['road', 'trail', 'racing']).required(),
    nickname: yup.string(),
    status: yup.boolean().required(),
    notes: yup.string(),
    miles: yup.number()
})

toast.configure()


function AddMiles(){
    let {shoes} = useContext(ShoeContext)
    let {sid} = useParams()
    let shoe = sid ? shoes.find(s => s.id === sid) : {}


    const {handleSubmit, handleChange, values, errors} = useFormik({
        initialValues: {...shoe},
        validationSchema,
        onSubmit(values){
            fetch(`/api/shoe/addmiles/${shoe.id}`, {
                method: "PUT",
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
                        document.location = '/dashboard'
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
                    
                    <h1 className="title is-1 header-text">Add Miles</h1>
                    <form onSubmit={handleSubmit} className="shoeFormInput">

                        <div className="field">
                            <label htmlFor="miles" className="label">How many miles did you run?</label>
                            <div className="control">
                                <input id="miles" name="miles" className={`input form-control ${errors.miles ? 'is-invalid' : ''}`} type="number" placeholder="" value={values.miles} onChange={handleChange} />
                                <ValidationMessage message={errors.miles} />
                            </div>
                        </div>
              
                        <div className="field is-grouped">
                            <div className="control">
                                <button type="submit" className="button is-success">add</button>
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