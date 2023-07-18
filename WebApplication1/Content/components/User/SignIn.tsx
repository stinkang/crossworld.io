import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from '../../store/firebase';
import 'firebase/compat/auth';
import './user.css'

import { Button, Modal } from 'react-bootstrap';
// ... other imports

const SignIn = () => {
    const [isSignedIn, setIsSignedIn] = useState(false); 
    const [show, setShow] = useState(false);
    const [username, setUsername] = useState("");
    const [uid, setUID] = useState("");
    const [userExists, setUserExists] = useState(false); // New state variable

    // Configure FirebaseUI.
    const uiConfig = {
        // Popup signIn flow rather than redirect flow.
        signInFlow: "popup",
        // We will display Google as auth provider.
        signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
        callbacks: {
            // Avoid redirects after sign-in.
            signInSuccessWithAuthResult: () => false
        }
    };

    const handleUsernameSubmit = () => {
        fetch('/Users/Create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Uid: uid,
                Username: username
            })
        })
        .then(async response => {
            if (response.status === 409) {
                // This means there was a conflict, likely because the username already exists.
                const data = await response.json();
                // Display the error message from the server to the user.
                alert(data.message);
            } else if (!response.ok) {
                // For other errors, throw an error to fall back to the catch block.
                throw new Error('Network response was not ok');
            } else {
                return response.json();
            }
        }).then(data => {
            console.log('Success:', data);
        }).catch(error => {
            console.error('Error:', error);
        });
    };

    const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    }

    // Listen to the Firebase Auth state and set the local state.
    useEffect(() => {
        const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
            setIsSignedIn(!!user);
            if (user) {
                setUID(user.uid);
                fetch(`/Users/GetByUID/${user.uid}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();  // Parses the JSON response
                })
                .then(data => {
                    // 'data' is the parsed JSON response from the server
                    setUserExists(data.exists); // Set the state based on the response from the server
                    if (!data.exists) {
                        setShow(true);
                    } else {
                        setUsername(data.username);
                        setUID(data.uid);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            }
        });

        return () => unregisterAuthObserver(); 
    }, []);

    // ... other code
    return (
        <div>
            <Button variant="primary" onClick={() => setShow(true)}>
                Sign In
            </Button>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Sign In</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {isSignedIn && !userExists ? 
                        // User doesn't exist, show form to choose a username
                        <form onSubmit={handleUsernameSubmit}>
                            <label>
                                Username:
                                <input type="text" value={username} onChange={handleUsernameChange} />
                            </label>
                            <input type="submit" value="Submit" />
                        </form>
                    : isSignedIn ?
                        <div className="signin-text">
                            Signed in as {username}
                        </div>
                        :
                        // Not logged in, show regular sign in component
                        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
                    }
                </Modal.Body>
            </Modal>
        </div>
    );

    // return (
    //     <div>
    //         {/* User is signed in, show their info */}
    //         {/* ... */}
    //     </div>
    // );
}

export default SignIn;

