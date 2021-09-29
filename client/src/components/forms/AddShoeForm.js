import React, {useContext} from "react";
import { useParams } from 'react-router'
import { ShoeContext } from '../ShoeRouter'
import { useFormik } from 'formik'
import * as yup from 'yup'
import 'react-toastify/dist/ReactToastify.css'
import "animate.css/animate.min.css";
import { toast, cssTransition } from 'react-toastify'
import Nav from '../Nav'

// https://animate.style/
const bounce = cssTransition({
    enter: "animate__animated animate__bounceIn",
    exit: "animate__animated animate__bounceOut"
  });

function ValidationMessage({message}){
    return <p className="help is-danger is-size-6">{message}</p>
}

const validationSchema = yup.object({
    first_date: yup.date(),
    brand: yup.string().required("shoe brand is required"),
    model: yup.string(),
    size: yup.string().required(),
    type: yup.mixed().oneOf(['road', 'trail', 'racing']).required("Please select type of running shoe"),
    nickname: yup.string(),
    status: yup.boolean().required("Please indicate if this shoe is in your current rotation"),
    notes: yup.string(),
    miles: yup.number().min(0)
})

toast.configure()


function AddShoeForm(){
    let {shoes} = useContext(ShoeContext)
    let {sid} = useParams()
    let shoe = sid ? shoes.find(s => s.id === sid) : {}
    let is_new = sid === undefined

    const formBtn = document.querySelector('.submit')

    const {handleSubmit, handleChange, values, errors} = useFormik({
        initialValues: is_new ? {
            first_date: "",
            brand: "",
            model: "",
            size: "",
            type: "",
            nickname: "",
            status: "",
            notes: "",
            miles: "",        
        } : {...shoe},
        validationSchema,
        onSubmit(values){
            fetch(`/api/shoe/${is_new ? 'add' :  'update/' + shoe.id}`, {
                method: is_new ? "POST" : "PUT",
                headers:{
                    "Content-Type": "application/json"
                },
                credentials: 'same-origin',
                body: JSON.stringify(values)
            }).then((response) => {
                if(!response.ok) throw Error('Failed to add shoe')
                return response.text()
            }).then(()=> {
                formBtn.disabled = true
                toast.success('Successfully submitted!', {
                    onClose: () => {
                        document.location = '/dashboard'
                    },
                    transition: bounce
                })
            }).catch((error) => {
                formBtn.disabled = true
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
        <>
        <Nav></Nav>
        <section className="shoeForm">
            <br/>
        <div className="container mt-5">
            <div className="columns is-centered ">
                <div className="column box is-half-desktop is-full-mobile">
                
                    <h1 className="title is-1 header-text">{is_new ? "Add Shoe" : "Edit Shoe"}
                    <button type="button" onClick={()=>document.location = '/dashboard'} className="button is-light is-pulled-right" to="/dashboard">Cancel</button>
                    
                    </h1>
                    <form onSubmit={handleSubmit} className="shoeFormInput">

                        <div className="field">
                            <label htmlFor="nickname" className="label">Shoe's Nickname</label>
                            <div className="control">
                                <input id="nickname" name="nickname" className={`input form-control ${errors.nickname ? 'is-invalid' : ''}`} type="text" placeholder="What do you call your shoes?" value={values.nickname} onChange={handleChange}/>
                                <ValidationMessage message={errors.nickname} />
                            </div>
                        </div>
                        
                        <div className="field">
                            <label htmlFor="brand" className="label">Brand</label>
                            <div className="control">
                                <input id="brand" name="brand" className={`input form-control ${errors.brand ? 'is-invalid' : ''}`} type="text" placeholder="ex: Brooks" value={values.brand} onChange={handleChange}/>
                                <ValidationMessage message={errors.brand} />
                            </div>
                        </div>

                        <div className="field">
                            <label htmlFor="model" className="label">Model</label>
                            <div className="control">
                                <input className={`input form-control ${errors.model ? 'is-invalid' : ''}`}  type="text" id="model" name="model" placeholder="Ghost" value={values.model} onChange={handleChange}/>
                                <ValidationMessage message={errors.model} />
                            </div>
                        </div>

                        <div className="field">
                            <label htmlFor="size" className="label">Size</label>
                            <div className="control">
                                <input id="size" name="size" className={`input form-control ${errors.size ? 'is-invalid' : ''}`} type="text" placeholder="7.5" value={values.size} onChange={handleChange} />
                                <ValidationMessage message={errors.size} />
                            </div>
                        </div>

                        <div className="field">
                            <label htmlFor="type" className="label">Type</label>
                            <div className="control">
                                <select className={`input ${errors.type ? 'is-invalid' : ''}`} id="type" name="type" value={values.type} onChange={handleChange}> 
                                    <option value="">Not selected</option>
                                    <option value="road">road</option>
                                    <option value="trail">trail</option>
                                    <option value="racing">racing</option>
                                </select>
                                <ValidationMessage message={errors.type} />
                            </div>
                        </div>

                        <div className="field">
                            <label htmlFor="status" className="label">Are you using this shoe right now?</label>
                            <div className="control">
                                <select className={`input ${errors.status ? 'is-invalid' : ''}`} id="status" name="status" value={values.status} onChange={handleChange}> 
                                    <option value="">Not selected</option>
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </select>
                                <ValidationMessage message={errors.status} />
                            </div>
                        </div>

                        <div className="field">
                            <label htmlFor="notes" className="label">Notes</label>
                            <div className="control">
                                <input id="notes" name="notes" className={`input form-control ${errors.notes ? 'is-invalid' : ''}`} type="text" placeholder="Anything you'd like to add?" value={values.notes} onChange={handleChange} />
                                <ValidationMessage message={errors.notes} />
                            </div>
                        </div>

                        <div className="field">
                            <label htmlFor="first_date" className="label">Date of first run in shoes</label>
                            <div className="control">
                                <input id="first_date" name="first_date" className={`input form-control ${errors.first_date ? 'is-invalid' : ''}`} type="date" value={values.start_date} onChange={handleChange} />
                                <ValidationMessage message={errors.first_date} />
                            </div>
                        </div>

                        <div className="field">
                            <label htmlFor="miles" className="label">Miles on this shoe</label>
                            <div className="control">
                                <input id="miles" name="miles" className={`input form-control ${errors.miles ? 'is-invalid' : ''}`} type="number" placeholder="" value={values.miles} onChange={handleChange} />
                                <ValidationMessage message={errors.miles} />
                            </div>
                        </div>
                        <br></br>

                        <div className="field is-grouped">
                                <button type="submit" className="button submit is-success is-fullwidth">Set...Go!</button>
                        </div>
                        <br></br>

                    </form>
                    
                </div>
            </div>
        </div>
        </section>
        </>
    )
}

export default AddShoeForm;