import React, { useState } from 'react';
import Flex from 'react-flexview';
import { Modal, Button } from 'react-bootstrap';
import FileUploader from '../../components/Upload/FileUploader';

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

    const handleExportClick = () => {
        props.onExportClick();
    };

    const handleUploadSuccess = (puzzle, filename = '') => {
        props.onUploadSuccess(puzzle, filename);
    };

    const handleUploadFail = () => {
        props.onUploadFail();
    };

    return (
        <>
            <Button className="settings-button" variant="primary" onClick={handleShow}>
                Settings
            </Button>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Body style={{maxWidth: '25vw', margin: '0 auto'}}>
                    <Flex>
                        <FileUploader success={handleUploadSuccess} fail={handleUploadFail} v2 />
                    </Flex>
                    &nbsp;
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
                        />
                    </Flex>
                    &nbsp;
                    <Flex>
                        <Button variant="primary settings-button" onClick={handleExportClick}>
                            Export as .puz file
                        </Button>
                    </Flex>
                    {/* Place any additional inputs or components here */}
                </Modal.Body>
            </Modal>
        </>
    );
}

export default FullScreenModal;
