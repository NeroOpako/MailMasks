import { useCallback, useState } from 'react'
import Button from '../components/Button'
import styles from '../styles/home.module.css'
import { list, getSession } from 'fastmail-masked-email';


export function LoginPage(token) {
  

  const callAPI = async () => {
    try {
      const session = await getSession('fmu1-98814015-75e35e610573b80dc05f16b2566c65ef-0-f7b28fbe7d9493034621f007a8e7ac1e');
      const myMaskedEmails = await list(session);
      console.log(myMaskedEmails);
    } catch (err) {
      console.log(err);
    }
  };

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

