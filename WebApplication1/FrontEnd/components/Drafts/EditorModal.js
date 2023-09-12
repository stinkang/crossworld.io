import React, { useState } from 'react';
import Flex from 'react-flexview';
import { Modal } from 'react-bootstrap';
import EditIcon from '@material-ui/icons/Edit';
import { IconButton } from '@material-ui/core';

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
            <IconButton className="settings-button" variant="primary" onClick={handleShow}>
                <EditIcon />
            </IconButton>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Body style={{maxWidth: '25vw', margin: '0 auto'}}>
                    <Flex>
                        <div>Title: </div>
                        &nbsp;
                        <input
                            type="text"
                            defaultValue={props.title}
                            onChange={handleUpdateTitle}
                        />
                    </Flex>
                    &nbsp;
                    <Flex>
                        <div>Rows: </div>
                        &nbsp;
                        <input
                            type="number"
                            defaultValue={props.grid.size}
                            onChange={handleChangeRows}
                            onInput={(e) => e.preventDefault()}
                            onKeyDown={(e) => e.preventDefault()}
                        />
                    </Flex>
                    &nbsp;
                    <Flex>
                        <div>Columns: </div>
                        &nbsp;
                        <input
                            type="number"
                            defaultValue={props.grid.size}
                            onChange={handleChangeColumns}
                            onInput={(e) => e.preventDefault()}
                            onKeyDown={(e) => e.preventDefault()}
                        />
                    </Flex>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default FullScreenModal;
