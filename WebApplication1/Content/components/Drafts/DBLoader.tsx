import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';

import * as WordDB from '../../lib/WordDB';
import { useWordDB } from '../../lib/WordDB';
import { getStorage } from '../../store/firebaseConfig';
import { getDownloadURL, ref } from 'firebase/storage';

export const LoadButton = (props: {
  buttonText: string;
  onClick?: () => void;
  onComplete: () => void;
}): JSX.Element => {
  const [dlInProgress, setDlInProgress] = useState<boolean>(false);
  const [validating, setValidating] = useState<boolean>(false);
  const [error, setError] = useState('');

  const startBuild = () => {
    if (props.onClick) {
      props.onClick();
    }
    setDlInProgress(true);
    const storage = getStorage();
    const wordlistRef = ref(storage, 'worddb.json');
    getDownloadURL(wordlistRef)
      .then(function (url: string) {
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.onload = async () => {
          setDlInProgress(false);
          setValidating(true);
          return WordDB.validateAndSet(xhr.response).then(() => {
            setValidating(false);
            props.onComplete();
          });
        };
        xhr.open('GET', url);
        xhr.send();
      })
      .catch(function () {
        setError('Error downloading word list, please try again');
      });
  };

  if (error) {
    return <p>Something went wrong: {error}</p>;
  } else if (dlInProgress || validating) {
    return (
      <>
        {dlInProgress ? (
          <p>Downloading word database...</p>
        ) : (
          <p>Downloaded, validating database...</p>
        )}
        <p>
          Please be patient and keep this window open, this can take a while.
        </p>
      </>
    );
  }
  return (
    <Button onClick={startBuild}>
      Download word DB
    </Button>
  );
};

export const DBLoader = (): JSX.Element => {
  const [ready, error, loading, setLoaded] = useWordDB();

  if (loading) {
    // initial loading
    return (
      <div>
        Checking for / validating existing database, this can take a minute...
      </div>
    );
  }

  return (
    <>
      <div css={{ margin: '1em' }}>
        <h2>Database Rebuilder</h2>
        {error ? <p>Error loading existing database.</p> : ''}
        {ready ? (
          <p>Found an existing database.</p>
        ) : (
          <p>No existing database found.</p>
        )}
        <LoadButton
          buttonText={'Build Database'}
          onComplete={() => setLoaded()}
        />
      </div>
    </>
  );
};
