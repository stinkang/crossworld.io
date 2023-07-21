import React, { useState } from 'react';
import Flex from 'react-flexview';
import { Modal, Button } from 'react-bootstrap';
import './css/editor.css';

const FullScreenModal = (props) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleChangeRows = (event) => {
        props.onChangeRows(event);
      };
    
    const handleChangeColumns = (event) => {
        props.onChangeColumns(event);
    };
    
    const handleUpdateTitle = (event) => {
        props.onUpdateTitle(event);
    };

    return (
        <>
            <Button className="settings-button" variant="primary" onClick={handleShow}>
                Settings
            </Button>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Body style={{maxWidth: '25vw', margin: '0 auto'}}>
                    <Flex>
                        <div>Title: </div>
                        <input
                            type="text"
                            defaultValue={props.title}
                            onChange={handleUpdateTitle}
                        />
                    </Flex>
                    <Flex>
                        <div>Rows: </div>
                        <input
                            type="number"
                            defaultValue={props.grid.size}
                            onChange={handleChangeRows}
                        />
                    </Flex>
                    <Flex>
                        <div>Columns: </div>
                        <input
                            type="number"
                            defaultValue={props.grid.size}
                            onChange={handleChangeColumns}
                        />
                    </Flex>
                    {/* Place any additional inputs or components here */}
                </Modal.Body>
            </Modal>
        </>
    );
}

export default FullScreenModal;
