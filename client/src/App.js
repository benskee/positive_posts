import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify'
import Joi from 'joi-browser';
import schedule from 'node-schedule';
import Form from './components/Form'
import { register, getUsers } from './services/userService'
import UserCard from './components/UserCard';
import 'bootstrap/dist/css/bootstrap.css';
import "react-toastify/dist/ReactToastify.css";
import './App.css';


const App = () => {
  const [ data, setData ] = useState({ 
      username: '', 
      email: '',
  })
  const [ users, setUsers ] = useState([])
  const [ errors, setErrors ] = useState({})

  const schema = {
      username: Joi.string().allow('').max(255).label('Username'),
      email: Joi.string().required().max(255).email().label('Email'),
  }

  useEffect(() => {
    schedule.scheduleJob("*/5 * * * * *", function(){
    console.log('scheduler')
    })
  }, [])

  const doSubmit = async () => {
        try {
            let res = await register(data);
            setUsers(res.data)
            toast.success('User added!')
        } catch (err) {
            if(err.response && err.response.status === 400) {
            const newErrors = { ...errors };
            const { type, message } = err.response.data
            newErrors[type] = message;
            setErrors({ newErrors })
            toast.error(message)
            }
        }
    }

    const formProps = {
        data,
        setData,
        errors,
        setErrors,
        schema
    }

  return (
    <div className="App">
      <main>
        <div className="container col-md-4">
          <ToastContainer hideProgressBar='true' autoClose={2500}/>
          <h1 className='text-center my-4'>Positive Posts</h1>
          <form onSubmit={(e) => Form.handleSubmit(formProps, doSubmit, e)}>
              {Form.renderInput("username", "Username", formProps)}
              <small className="form-text text-muted">Feel Free to leave Username blank.</small>
              {Form.renderInput("email", "Email", formProps)}
              {Form.renderButton('Register', formProps)}
          </form>
        </div>
        {users.length > 0 && <div className="container col-10 mt-4">
          <div className="row">
            {users.map(user=> <UserCard user={user} key={user}/>)}
          </div>
        </div>}
      </main>
    </div>
  );
}

export default App;
