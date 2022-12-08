import { useCallback, useState, useEffect } from 'react'
import { remove } from 'lodash'
import { list, getSession, create, disable, enable, update } from 'fastmail-masked-email';
import { Button, Toast, ToastContainer, Stack, Spinner, ListGroup, Container, Row, Col, Modal  } from 'react-bootstrap';
import { Pencil, SlashCircle, Clipboard, Save } from 'react-bootstrap-icons';

export function ListPage() {
  const [session, setSession] = useState(null)
  const [isLoading, setLoading] = useState(false)
  const [items, setItems] = useState(null)
  const [show, setShow] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [edit, setEdit] = useState(null)
  const [elem, setElem] = useState({email : '', description: ''})

  const handleClose = () => {
    setShow(false);
    setElem({email : '', description: ''});
    setItems(items);
    setEdit(false);
  } 
  const handleShow = (edit, elem) => {
    setShow(true);
    setEdit(edit);
    setElem(elem);
  } 

 const saveItem = async () => {
    try {
      elem.description = document.getElementById('description').value;
      await update(elem.id, session, {
        description: elem.description ? elem.description : ''
      });
      items.splice(items.map(function(e) { return e.id; }).indexOf(elem.id), 1, elem);
    } catch (err) {
      console.log(err);
    }
    handleClose();
  };

  const toggleItem = async (el) => {
    try {
      if(el.state === 'enabled') {
        await disable(el.id, session);
      } else {
        await enable(el.id, session);
      }
      items.splice(items.map(function(e) { return e.id; }).indexOf(el.id), 1, el);
    } catch (err) {
      console.log(err);
    }
    handleClose();
  }; 

  const copyEmail = async (email) => {
    try {
      await navigator.clipboard.writeText(email);
      setShowToast(true);
    } catch(err) {
      alert('Error in copying text: ', err);
    }
  };

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
          <ListGroup.Item key={elem.id}>
            <Container>
              <Row>
              <Col xs={7}>
                <Stack direction="vertical">
                  <h6> {elem.description ? elem.description : 'No description provided'}</h6> 
                  {elem.email}
                </Stack>
              </Col>
              <Col style={{width: '100%', textAlign: 'end'}}>
               <div>
                  <Button variant="success" onClick={() => copyEmail(elem.email)}><Clipboard/></Button>
                  <Button style={{marginLeft: '5px', marginRight: '5px'}} variant="warning" onClick={() => handleShow(true, elem)}><Pencil/></Button>
                  <Button variant="danger" onClick={() => toggleItem(elem)}><SlashCircle/></Button>
                </div>         
              </Col>
              </Row>
            </Container>
          </ListGroup.Item>
        );
      }
    }

  return (
    <div style={{marginBottom: '20px'}}>
      <ListGroup >
        {final}  
      </ListGroup>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{edit ? 'Edit' : 'New'} Masked Mail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form style={{textAlign: 'center'}}>
            <Container>
              <Row>
              <Col xs={12}>
                <Stack direction="vertical" gap="3">
                  <input placeholder='Add a description (optional)' id="description" type="text" name="description" defaultValue={elem.description} />
                  <input disabled={true} id="email" type="text" name="email" defaultValue={elem.email} />
                </Stack>
              </Col>
              </Row>
            </Container>
          </form>
        </Modal.Body>
        <Modal.Footer>
         <Button variant="success" onClick={saveItem} type="submit">Save</Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <div
        aria-live="polite"
        aria-atomic="true"
        >
        <ToastContainer position="top-end" className="p-3">
          <Toast onClose={() => setShowToast(false)} show={showToast} delay={1000} autohide>
            <Toast.Header>
              <strong className="me-auto">Text copied</strong>
            </Toast.Header>
          </Toast>
        </ToastContainer>
      </div>
    </div>
  )
}

