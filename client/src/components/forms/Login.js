import React from "react";
import { useFormik } from 'formik'
import * as yup from 'yup'
import 'react-toastify/dist/ReactToastify.css'
import "animate.css/animate.min.css";
import { toast, cssTransition } from 'react-toastify'
import { useHistory } from 'react-router-dom'


// https://animate.style/
const bounce = cssTransition({
    enter: "animate__animated animate__bounceIn",
    exit: "animate__animated animate__bounceOut"
  });



function ValidationMessage({message}){
    return <p className="help is-danger is-size-6">{message}</p>
}

const validationSchema = yup.object({
    username: yup.string().required("Please enter your username"),
    password: yup.string().required("Please enter your password")
})

toast.configure()


function LoginForm(){
    const history = useHistory()

    const formBtn = document.querySelector('.submit')

    const {handleSubmit, handleChange, values, errors} = useFormik({
        initialValues: {
            username: "",
            password: ""
        },
        validationSchema,
        onSubmit(values){
            fetch('/api/login', {
                method: "POST",
                headers:{
                    "Content-Type": "application/json"
                },
                credentials: 'same-origin',
                body: JSON.stringify(values)
            }).then((response) => {
                if(!response.ok) throw Error('Failed to log in')
                return response.text()
            }).then(()=> {
                formBtn.disabled = true
                toast.success('Successfully logged in!', {
                    onClose: () => {
                        document.location = '/dashboard'
                    },
                    transition: bounce
                })
            }).catch((error) => {
                formBtn.disabled = true
                toast.error(`Login Failed!`, {
                    onClose: () => {
                        document.location = '/'
                    },
                    transition: bounce
                })
            })
        }
    })

    return (
        <section className="login section">
        <br/>
        <div className="container mt-5">
            <div className="columns is-three-quarters-mobile is-half-desktop">

                <div className="column box is-half is-offset-one-quarter">
                    <h1 className="title is-1 header-text">Login
                    <button type="button" onClick={()=>document.location = '/'} className="button is-light is-pulled-right" to="/dashboard">Cancel</button>
                    </h1>
                    <br></br>
                    <form onSubmit={handleSubmit} className="loginInput">
                        <div className="field">
                            <label htmlFor="username" className="label">Username</label>
                            <div className="control">
                                <input id="username" name="username" className={`input form-control ${errors.username ? 'is-invalid': ''}`} type="text" placeholder="ex: speedy" value={values.username} onChange={handleChange}/>
                                <ValidationMessage message={errors.username} />
                            </div>
                        </div>
                        <br></br>

                    <div className="field">
                        <label  htmlFor="password" className="label">Password</label>
                        <div className="control">
                            <input id="password" name="password" className={`input form-control ${errors.password ? 'is-invalid': ''}`} type="password" placeholder="Text input" value={values.password} onChange={handleChange}/>
                            <ValidationMessage message={errors.password} />
                        
                        </div>
                    </div>
                    <br></br>

                    <div className="field is-grouped">
                        <button type="submit" className="submit button is-fullwidth is-success mt-3">Login</button>
                    </div>
                    </form>
                    <br></br>
                    <hr className="line"></hr>
                    <h3 className="title header-text is-5">Don't have an account? <a onClick={()=>history.push('/register')} className=" is-link customlink">Register here</a></h3>
                    
                </div>


            </div>
        </div>
        </section>
    )
}

export default LoginForm;