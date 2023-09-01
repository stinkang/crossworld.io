import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './css/crosswords.css';

export interface LoginModalProps {
    // Additional props if needed
}

export const LoginModal = (props: LoginModalProps) => {
    const [show, setShow] = useState(true); // Control whether the modal is shown

    const handleClose = () => setShow(false); // Function to close the modal

    return (
        <Modal show={show} onHide={handleClose} className={"login-modal"}>
            <Modal.Header closeButton className={"login-modal-header"}>
                <Modal.Title>Welcome to CrossWorld!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="form-group">
                    <a href={"/Account/Login"}>Log in</a> or <a href={"/Account/Register"}>Sign up </a>
                    to record your leaderboard times and publish your own crosswords!
                </div>
            </Modal.Body>
            <Modal.Footer className={"login-modal-footer"}>
                <Button variant="secondary" className="skip-button" onClick={handleClose}>
                    Skip
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
