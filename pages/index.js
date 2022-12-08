import { useCallback, useState, useEffect } from 'react'
import styles from '../styles/home.module.css'
import Image from 'next/image'
import {LoginPage} from '../pages/login'
import {ListPage} from '../pages/list'
import { Button, Form, Stack  } from 'react-bootstrap';
import { EnvelopeDash, Save } from 'react-bootstrap-icons';

function Home() {
  const [token, setToken] = useState();
  const loadData = (() => {
    if (typeof window !== "undefined") {
      setToken(t => t = localStorage.getItem("token"))
    }
  })

  useEffect(() => {
    loadData()
  })

  const addToken = (e) => {
    e.preventDefault();
    localStorage.setItem("token",  e.target.token.value);
    setToken(t => t = localStorage.getItem("token"))
  };

  return (
    <main >
     <h1 className={styles.h1}> <EnvelopeDash/> MailMasks</h1>
     <p style={{textAlign: 'center', width: '100%'}}>Made by NeroPako</p>
      <div style={{margin: '20px'}}>
      {!token ? (
          <div style={{textAlign: 'center', width: '90%', display: 'flex', alignContent: 'center', justifyContent: 'center'}}>
             <Stack direction="vertical" gap={3}>
             <h5>You must login to your FastMail account to continue. Type your Api Token and press save. This token won't leave the browser and will not be shared with anyone else.</h5>
              <Form onSubmit={addToken}>
                  <Form.Control id="token" name="token"  type="password" placeholder="Type your token here..." />
                  <Button style={{marginTop: '10px'}} variant="primary" type="submit">Save</Button>
              </Form>
             </Stack>
          </div>
        ) : <ListPage/>}
      </div>
    </main>
  )
}

export default Home
