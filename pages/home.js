import { useCallback, useState } from 'react'
import Button from '../components/Button'
import styles from '../styles/home.module.css'
import { list, getSession } from 'fastmail-masked-email';


const callAPI = async () => {
  try {
    const session = await getSession('fmu1-98814015-75e35e610573b80dc05f16b2566c65ef-0-f7b28fbe7d9493034621f007a8e7ac1e');
    const myMaskedEmails = await list(session);
    console.log(myMaskedEmails);
  } catch (err) {
    console.log(err);
  }
};

function commandList(loggedIn, addMask) {
  if (!loggedIn) {
    return ( <><Button onClick={callAPI}>
      Login
    </Button></>)
  } else {
    return ( <><Button onClick={addMask}>
      Add mask
    </Button></>)
  }
}

function Home() {
  const [masks, setMasks] = useState(0)
  const loggedIn = false
  const addMask = useCallback(() => {
    setMasks((v) => v + 1)
  }, [setMasks])
 

  return (
    <main className={styles.main}>
      <h1 className={styles.h1}>MailMasks</h1>
      <h4 className={styles.h4}>
        {!loggedIn ? 'You have to login to FastMail to continue.' : (masks < 1 ?  'You don\'t have masks. Try adding one.' : 'You have ' + masks + ' masks.')}
        <br></br>
        <div className='col-md-12' style={{display: 'block'}}>
        {commandList(loggedIn, addMask)}
      </div>
      </h4>
     
     
      
    </main>
  )
}

export default Home
