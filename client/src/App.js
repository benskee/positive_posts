import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify'
import Joi from 'joi-browser';
import Form from './components/Form'
import postDict from './posts/postDict'
import { register, getUsers } from './services/userService'
import 'bootstrap/dist/css/bootstrap.css';
import "react-toastify/dist/ReactToastify.css";
import './App.css';
import UserCard from './components/UserCard';


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

  const doSubmit = async () => {
        try {
            let res = await register(data);
            let user = res.data
            let usersCopy = [...users]
            usersCopy.push(user)
            setUsers(usersCopy)
            toast.success('User added!')
        } catch (err) {
            if(err.response && err.response.status === 400) {
            const newErrors = { ...errors };
            const { type, message } = err.response.data
            newErrors[type] = message;
            setErrors({ newErrors })
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

    const choosePost = posts => {
      let idx = Math.floor(Math.random() * posts.length)
      console.log(idx)

      return [posts.splice(idx, 1), posts]
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
