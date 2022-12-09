import { useCallback, useState } from 'react'
import styles from '../styles/home.module.css'
import { list, getSession } from 'fastmail-masked-email';
import { Button, Form, Stack, Spinner, ListGroup, Container, Row, Col  } from 'react-bootstrap';
import { Save } from 'react-bootstrap-icons';



export function DetailPage(session, isEdit) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const saveItem = async (e) => {
    try {
      if(e.target.description.value) {
        const newMaskedEmail = await create(session, { description: e.target.description.value });
      } else {
        const newMaskedEmail = await create(session);
      }
      setShow(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Launch demo modal
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form style={{textAlign: 'center'}} onSubmit={saveItem}>
            <Container>
              <Row>
              <Col xs={7}>
                <Stack direction="vertical" gap="3">
                  <input placeholder='Add a description (optional)' id="description" type="text" name="description" />
                  <input disabled="true" id="email" type="text" name="email" />
                </Stack>
              </Col>
              <Col>
                <Form style={{margin: '5px'}}>
                  <Button variant="success" onSubmit={callAPI} type="submit"><Save/></Button>
                </Form>            
              </Col>
              </Row>
            </Container>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}