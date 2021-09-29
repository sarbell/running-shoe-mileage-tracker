import React from "react";
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
    return <p className="help is-danger is-size-6">{message}</p>
}

const validationSchema = yup.object({
    name: yup.string().required('Please enter your full name'),
    username: yup.string().required('Please enter your username'),
    email: yup.string().email().required('Please enter a valid email'),
    password: yup.string().required('Please enter a password for your account').matches(/^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
    "Password must contain at least 8 characters, one uppercase, one number and one special case character")
})

toast.configure()


function Registration(){
    const formBtn = document.querySelector('.submit')

    const {handleSubmit, handleChange, values, errors} = useFormik({
        initialValues: {
            name: "",
            username: "",
            email: "",
            password: ""
        },
        validationSchema,
        onSubmit(values){
            fetch('/api/register', {
                method: "POST",
                headers:{
                    "Content-Type": "application/json"
                },
                credentials: 'same-origin',
                body: JSON.stringify(values)
            }).then((response) => {
                if(!response.ok) throw Error('Failed to sign up')
                return response.text()
            }).then(()=> {
                formBtn.disabled = true
                toast.success('Successfully Registered!', {
                    onClose: () => {
                        document.location = '/login'
                    },
                    transition: bounce
                })
            }).catch((error) => {
                formBtn.disabled = true
                toast.error(`Registration Failed!`, {
                    onClose: () => {
                        document.location = '/'
                    },
                    transition: bounce
                })
            })
        }
    })

    return (
        <section className="section register">
        <div className="container mt-5">
            <div className="columns is-three-quarters-mobile is-half-desktop">
                <div className="column box is-half is-offset-one-quarter">
                    <button type="button" onClick={()=>document.location = '/'} className="button is-light is-pulled-right" >Cancel</button>
                    <h1 className="title is-1 header-text">Registration </h1>
                    <form onSubmit={handleSubmit} className="registerInput">
                        <div className="field">
                            <label htmlFor="name"  className="label">Name</label>
                            <div className="control">
                                <input id="name" name="name" className={`input form-control ${errors.name ? 'is-invalid' : ''}`} type="text" placeholder="Speedy Gonzalez" value={values.name} onChange={handleChange}/>
                                <ValidationMessage message={errors.name} />
                            </div>
                        </div>
                    <br></br>
                        
                        <div className="field">
                            <label htmlFor="username" className="label">Username</label>
                            <div className="control">
                                <input id="username" name="username" className={`input form-control ${errors.username ? 'is-invalid' : ''}`} type="text" placeholder="SpeedyG" value={values.username} onChange={handleChange}/>
                                <ValidationMessage message={errors.username} />

                            </div>
                        </div>
                        <br></br>

                        <div className="field">
                            <label htmlFor="email" className="label">Email</label>
                            <div className="control">
                                <input className={`input form-control ${errors.email ? 'is-invalid' : ''}`}  type="text" id="email" name="email" placeholder="example@email.com" value={values.email} onChange={handleChange}/>
                                <ValidationMessage message={errors.email} />
                            </div>
                        </div>
                        <br></br>

                        <div className="field">
                            <label  htmlFor="password" className="label">Password</label>
                            <div className="control">
                                <input id="password" name="password" className={`input form-control ${errors.password ? 'is-invalid' : ''}`} type="password" placeholder="password" value={values.password} onChange={handleChange} />
                                <ValidationMessage message={errors.password} />
                            </div>
                        </div>
                        <br></br>
              
                        <div className="field is-grouped">
                            <br></br>
                                <button type="submit" className="submit button is-success is-fullwidth">Signup</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </section>
    )
}

export default Registration;