import { useCallback, useState, useEffect } from 'react'
import { list, getSession } from 'fastmail-masked-email';
import { Button, Form, Stack, Spinner, ListGroup, Container, Row, Col  } from 'react-bootstrap';
import { Pencil, Trash, Clipboard } from 'react-bootstrap-icons';

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

  if (isLoading) return <Spinner animation="border" variant="primary" />
  if (!items) return <p>No data</p>


  const final = [];
    for (let elem of items) {
      if(elem.state !== 'disabled' && elem.state !== 'deleted') {
        final.push ( 
          <ListGroup.Item>
            <Container>
              <Row>
              <Col xs={7}>
                <Stack direction="vertical">
                  <h6> {elem.description}</h6> 
                  {elem.email}
                </Stack>
              </Col>
              <Col>
                <Form style={{margin: '5px'}}>
                  <Stack direction="horizontal" gap={3}>
                    <Button variant="success" type="submit"><Clipboard/></Button>
                    <Button variant="warning" type="submit"><Pencil/></Button>
                    <Button variant="danger" type="submit"><Trash/></Button>
                  </Stack>
                </Form>            
              </Col>
              </Row>
            </Container>
          </ListGroup.Item>
        );
      }
    }

  return (
    <ListGroup style={{marginBottom: '20px'}}>
      {final}  
    </ListGroup>
  )
}

