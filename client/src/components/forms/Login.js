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
    return <p className="help is-danger">{message}</p>
}

const validationSchema = yup.object({
    username: yup.string().required(),
    password: yup.string().required()
})

toast.configure()


function LoginForm(){
    const history = useHistory()

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
                toast.success('Successfully logged in!', {
                    onClose: () => {
                        document.location = '/dashboard'
                    },
                    transition: bounce
                })
            }).catch((error) => {
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
                    <h1 className="title is-1 header-text">Login</h1>
                    <br></br>
                    <form onSubmit={handleSubmit} className="loginInput">
                        <div className="field">
                            <label htmlFor="username" className="label">Username</label>
                            <div className="control">
                                <input id="username" name="username" className={`input form-control ${errors.username ? 'is-invalid': ''}`} type="text" placeholder="ex: speedy" value={values.username} onChange={handleChange}/>
                                <ValidationMessage message={errors.username} />
                            </div>
                        </div>

                    <div className="field">
                        <label  htmlFor="password" className="label">Password</label>
                        <div className="control">
                            <input id="password" name="password" className={`input form-control ${errors.password ? 'is-invalid': ''}`} type="password" placeholder="Text input" value={values.password} onChange={handleChange}/>
                            <ValidationMessage message={errors.password} />
                        
                        </div>
                    </div>

                    <div className="field is-grouped">
                        <div className="control">
                            <br></br>
                            <button type="submit" className="button is-success">Login</button>
                            <button type="button" onClick={()=>document.location = '/'} className="button is-light" to="/dashboard">Cancel</button>
                        </div>
                    </div>
                    </form>
                    <br></br>
                    <hr className="line"></hr>
                    <h2 onClick={()=>history.push('/register')} className="is-link title header-text is-3 customlink">Need to register?</h2>
                </div>


            </div>
        </div>
        </section>
    )
}

export default LoginForm;