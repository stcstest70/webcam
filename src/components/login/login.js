import React, { useContext, useState } from 'react';
import './login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import validator from 'validator';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../App';

const Login = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(UserContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errMsg, setErrMsg] = useState(false);
  const validateEmail = (e)=>{
    setEmail(e.target.value);
    if(!validator.isEmail(email)){
      setErrMsg(true);
    }else{
      setErrMsg(false);
    }
  }
  const handlesubmit = async (e)=>{
    e.preventDefault();
    if(validator.isEmail(email)){
      try {
        const res = await fetch('/login', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name, email
          })
        });
        if(res.status === 200){
          const data = await res.json();
        const { token } = data;
        sessionStorage.setItem('UserToken', token);
        dispatch({ type: "USER", payload: true });
        window.alert('User Logged in successfully...!');
        navigate('/');
        }else{
          window.alert('Some Error while logging in');
        }
        
    }catch(error){
      console.log(error);
    }
    }
    else{
      window.alert('Please Enter a valid E-mail');
    }
  }
    

  return (
    <div className='login'>
      <div className="form-title">
        <span>Sign In / Sign Up</span>
      </div>
      <div className="form_element">
        <label htmlFor="name"><FontAwesomeIcon icon={faUser} /></label>
        <input type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder='Enter Name' required />
      </div>
      <div className="form_element">
        <label htmlFor="email"><FontAwesomeIcon icon={faEnvelope} /></label>
        <input type="email" name="email" id="email" value={email} onChange={validateEmail} placeholder='Enter Email' required />
      </div>
      <div className="form_element">
      {errMsg ? <span className='errMsg'>Enter a valid E-mail</span> : ""}
      </div>
      <div className="submit-btn">
        <button onClick={handlesubmit}>Submit</button>
      </div>
    </div>
  )
}

export default Login