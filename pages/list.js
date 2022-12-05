import { useCallback, useState, useEffect } from 'react'
import { list, getSession } from 'fastmail-masked-email';

export function ListPage() {
  const [session, setSession] = useState(null)
  const [isLoading, setLoading] = useState(false)
  const [items, setItems] = useState(null)

  useEffect(() => {
    setLoading(true)
    try {
      getSession(localStorage.getItem("token")).then((data) => {
        setSession(data)
         list(data).then((listData) => {
          setItems(listData)
          setLoading(false)
         })
      })
    } catch (err) {
      console.log(err);
    }    
  }, [])

  if (isLoading) return <p>Loading...</p>
  if (!items) return <p>No data</p>


  const final = [];
    for (let elem of items) {
      final.push(<li key={elem.description}>{elem.description}</li>);
    }

  return (
    <ul>
{final}
    </ul>
  )
}

