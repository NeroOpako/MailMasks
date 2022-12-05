import { useCallback, useState, useEffect } from 'react'
import styles from '../styles/home.module.css'
import Image from 'next/image'
import {LoginPage} from '../pages/login'
import {ListPage} from '../pages/list'
import Button from '../components/Button'


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
    <main>
      <div className={styles.bgWrap}>
        <Image
          src="https://cdn.pixabay.com/photo/2018/04/16/12/59/mountains-3324569_960_720.jpg"
          alt="Background"
          quality={100}
          layout="fill"
        />
     </div>
     <h1 className={styles.h1}>MailMasks</h1>
     <div>
     {!token ? (
          <div style={{width: '100%', height: '100%'}}>
          <p style={{textAlign: 'center'}}>You must login to your FastMail account to continue. Type your Api Token and press save. This token won't leave the browser and will not be shared with anyone else.</p>
          
          <form style={{textAlign: 'center'}} onSubmit={addToken}>
            <input placeholder='Type your token here...' id="token" type="text" name="token" />
            <Button type="Submit">Save</Button>
          </form>
          </div>
        ) : <ListPage/>}
     </div>
      <p style={{position: 'fixed', bottom: '0', textAlign: 'center', width: '100%'}}>© Picture from <a href="https://pixabay.com/it/users/eriktanghe-8013345/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=3324569">Erik Tanghe</a> on <a href="https://pixabay.com/it//?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=3324569">Pixabay</a></p>
    </main>
  )
}

export default Home
