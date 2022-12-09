import { useCallback, useState } from 'react'
import { Button  } from 'react-bootstrap';
import styles from '../styles/home.module.css'
import { list, getSession } from 'fastmail-masked-email';


export function LoginPage(token) {
  
  const addToken = (e) => {
    e.preventDefault();
    localStorage.setItem("token",  e.target.token.value);
  };

  return (
    <div style={{width: '100%', height: '100%'}}>
    <p style={{textAlign: 'center'}}>You must login to your FastMail account to continue. Type your Api Token and press save. This token won't leave the browser and will not be shared with anyone else.</p>
    
    <form style={{textAlign: 'center'}} onSubmit={addToken}>
      <input placeholder='Type your token here...' id="token" type="text" name="token" />
      <Button type="Submit">Save</Button>
    </form>
    </div>
   )
}

