import React, { useContext, useEffect, useState } from 'react';
import './navbar.css';
import { UserContext } from '../../App';

const Navbar = () => {
  const { state, dispatch } = useContext(UserContext);
  const [name, setName] = useState('');
  const CheckTokenValid = async () => {
    const token = sessionStorage.getItem('UserToken');
    const res = await fetch('/checkTokenValid', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token
      })
    });
    if (res.status === 200) {
      const data = await res.json();
      const { decoded } = data;
      setName(decoded.name);
    }
  }


  useEffect(() => {
    CheckTokenValid();
  }, []);
  return (
    <div className='navbar'><span>Webcam App</span>{state? <span>Welcome, {name}</span>  : ""}</div>
  )
}

export default Navbar