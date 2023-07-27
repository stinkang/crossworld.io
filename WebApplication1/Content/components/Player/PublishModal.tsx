import React, { useState } from 'react';
import Flex from 'react-flexview';
import { Modal, Button } from 'react-bootstrap';
import './css/editor.css';

const PublishModal = (props) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleUpdateIsAnonymous = (event) => {
        props.onUpdateIsAnonymous(event);
    };
    
    const handlePublish = () => {
        props.onPublish();
    };

    return (
        <>
            <Button className="publish-button" variant="primary" onClick={handleShow}>
                Publish
            </Button>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Body style={{maxWidth: '25vw', margin: '0 auto'}}>
                    <Flex>
                        <div>Publish Anonymously?: </div>
                        &nbsp;
                        <input
                            type="checkbox"
                            defaultValue={0}
                            onChange={handleUpdateIsAnonymous}
                        />
                    </Flex>
                    <Button className="publish-button" variant="primary" onClick={handlePublish}>
                        Publish
                    </Button>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default PublishModal;
