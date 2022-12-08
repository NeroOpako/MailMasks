import { useCallback, useState, useEffect } from 'react'
import { list, getSession, create, disable, enable, update, remove } from 'fastmail-masked-email';
import { Button, Toast, ToastContainer, Stack, Spinner, ListGroup, Container, Row, Col, Modal  } from 'react-bootstrap';
import { Pencil, SlashCircle, Clipboard } from 'react-bootstrap-icons';

export function ListPage() {
  const [session, setSession] = useState(null)
  const [isLoading, setLoading] = useState(false)
  const [items, setItems] = useState(null)
  const [show, setShow] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [edit, setEdit] = useState(null)
  const [elem, setElem] = useState({email : '', description: ''})
  const [showBlocked, setShowBlocked] = useState(false)

  const handleClose = async () => {
    setShow(false);
    if(!edit) {
      await remove(elem.id, session).finally(() => {
        setElem({email : '', description: ''});
        setItems(items);
        setEdit(false);
      });
    } else {
      setElem({email : '', description: ''});
      setItems(items);
      setEdit(false);
    }
  } 
  const handleShow = async (el) => {
    setEdit(el);
    if(!el) {
      await create(session).then((elem) => {
        el = elem;
        setElem(el);
        setShow(true);
      });
    } else {
      setElem(el);
      setShow(true);
    }
  } 

 const saveItem = async () => {
    try {
      elem.description = document.getElementById('description').value;
      await update(elem.id, session, {
        description: elem.description ? elem.description : ''
      }).then(() => {
        if(edit) {
          items.splice(items.map(function(e) { return e.id; }).indexOf(elem.id), 1, elem);
        } else {
          items.push(elem);
        }
      });
    } catch (err) {
      console.log(err);
    }
    handleClose();
  };

  const toggleItem = async () => {
    try {
      if(elem.state === 'enabled') {
        await disable(elem.id, session).then(() => {
          items.splice(items.map(function(e) { return e.id; }).indexOf(elem.id), 1, elem);
        });
      } else {
        await enable(elem.id, session).then(() => {
          items.splice(items.map(function(e) { return e.id; }).indexOf(elem.id), 1, elem);
        });
      }
    } catch (err) {
      console.log(err);
    }
    handleClose();
  }; 

  const copyEmail = async (email) => {
    try {
      await navigator.clipboard.writeText(email).then(() => {
        setShowToast(true);
      });
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

  if (isLoading) return (
      <div style={{width: '100%', textAlign: 'center'}}>
        <Spinner animation="border" variant="primary" />
      </div>
    )
  if (!items) return (
    <div style={{width: '100%', textAlign: 'center'}}>
      <p>No masks found</p>
    </div>
  )

  const final = [];
    for (let elem of items) {
      if((!showBlocked && elem.state !== 'disabled' && elem.state !== 'deleted') || (showBlocked && elem.state === 'disabled')) {
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
                  <Button style={{marginLeft: '5px', marginRight: '5px'}} variant="warning" onClick={() => handleShow(elem)}><Pencil/></Button>
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
      <div style={{width: '100%', textAlign: 'center', margin: '10px'}}>
        <Button style={{marginRight: '10px'}} variant="primary" onClick={() => handleShow(false)}>Add Item</Button>
        <Button style={{marginLeft: '10px'}} variant="secondary" onClick={() => setShowBlocked(!showBlocked)}>{showBlocked ? 'Show Enabled' : 'Show Blocked'}</Button>
      </div>
      <ListGroup>
        {final}  
      </ListGroup>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
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
         <Button variant="primary" onClick={saveItem} type="submit">Save</Button>
          {edit &&
            <Button variant={elem.state === 'enabled' ? 'danger' : 'success'} onClick={toggleItem} type="submit">
              {elem.state === 'enabled' ? 'Block' : 'Enable'}
            </Button>}
          <Button variant="secondary" onClick={handleClose}>
            Cancel
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

