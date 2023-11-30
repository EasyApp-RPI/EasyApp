// This app is the settings page where users can enter their info, and tweak general options about the extension

// React and Bootstrap imports
import React from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// Component Imports
import PersonalComp from './PersonalComp';
import WorkComp from './WorkComp';
import EducationComp from './EducationComp';
import InterestComp from './InterestsComp';
import SkillsComp from './SkillsComp';

// openDB function returns a Promise that resolves to an IndexedDB database instance
const openDB = (): Promise<IDBDatabase> => {
  // Return a Promise that wraps the logic for opening or upgrading the IndexedDB database
  return new Promise<IDBDatabase>((resolve, reject) => {
    // Use window.indexedDB to open the 'FilesDB' database with version 1
    const request = window.indexedDB.open('FilesDB', 1);

    // Handle errors that may occur during the attempt to open the database
    request.onerror = (event: Event) => {
      reject('Error opening database');
    };

    // Handle successful opening of the database
    request.onsuccess = (event: Event) => {
      // Extract the result from the event and cast it to an IDBDatabase instance
      const target = event.target as IDBOpenDBRequest;
      const db = target.result as IDBDatabase;

      // Check if the database instance is valid and resolve the Promise with it
      if (db) {
        resolve(db);
      } else {
        // Reject the Promise if the database instance is not valid
        reject('Failed to open database');
      }
    };

    // Handle the case where the database version needs an upgrade
    request.onupgradeneeded = (event: Event) => {
      // Extract the result from the event and cast it to an IDBDatabase instance
      const target = event.target as IDBOpenDBRequest;
      const db = target.result as IDBDatabase;

      // Create an object store named 'files' with 'id' as the key path
      db.createObjectStore('files', { keyPath: 'id' });
    };
  });
};

// saveFile function saves a file to the 'files' object store in the IndexedDB database
const saveFile = (file: File, key: string) => {
  // Use the openDB function to get the database instance in a Promise chain
  return openDB().then((db) => {
    // Return a new Promise that wraps the logic for saving the file
    return new Promise((resolve, reject) => {
      // Call the removeFile function to remove any existing file with the same key
      removeFile(key)
        .then(() => {
          // Begin a 'readwrite' transaction on the 'files' object store
          const transaction = db.transaction('files', 'readwrite');
          // Get the object store within the transaction
          const objectStore = transaction.objectStore('files');
          // Use the add method to add a new entry with the specified key and file
          const request = objectStore.add({ id: key, file });

          // Handle the success event when adding the file is successful
          request.onsuccess = () => {
            resolve('File saved successfully');
          };

          // Handle the error event when adding the file encounters an error
          request.onerror = () => {
            reject('Error saving file');
          };
        })
        .catch((error) => {
          // Reject the Promise if an error occurs during the removeFile operation
          reject(error);
        });
    });
  });
};

// getAllFiles function retrieves all files from the 'files' object store in the IndexedDB database
const getAllFiles = () => {
  // Use the openDB function to get the database instance in a Promise chain
  return openDB().then((db) => {
    // Return a new Promise that wraps the logic for getting all files
    return new Promise((resolve, reject) => {
      // Start a 'readonly' transaction on the 'files' object store
      const transaction = db.transaction('files', 'readonly');
      // Get the object store within the transaction
      const objectStore = transaction.objectStore('files');
      // Use the getAll method to retrieve all files from the object store
      const request = objectStore.getAll();

      // Handle the success event when retrieving files is successful
      request.onsuccess = () => {
        resolve(request.result);
      };

      // Handle the error event when an error occurs during the retrieval of files
      request.onerror = () => {
        reject('Error getting files');
      };
    });
  });
};

// removeFile function removes a file from the 'files' object store in the IndexedDB database
const removeFile = (fileKey: string) => {
  // Use the openDB function to get the database instance in a Promise chain
  return openDB().then((db) => {
    // Return a new Promise that wraps the logic for removing the file
    return new Promise<string>((resolve, reject) => {
      // Start a 'readwrite' transaction on the 'files' object store
      const transaction = db.transaction('files', 'readwrite');
      // Get the object store within the transaction
      const objectStore = transaction.objectStore('files');
      // Use the delete method to remove the file with the specified key from the object store
      const request = objectStore.delete(fileKey);

      // Handle the success event when removing the file is successful
      request.onsuccess = () => {
        resolve('File removed successfully');
      };

      // Handle the error event when an error occurs during the removal of the file
      request.onerror = () => {
        reject('Error removing file');
      };
    });
  });
};

function EasyAppOptions() {
  // Personal Information Form Data
  const [PersonalInfo, setPersonalInfo] = useState([
    {
      key: 'OpenAI Key',
      value: '',
      label: 'OpenAI Key',
      type: 'input',
      required: true,
    },
    {
      key: 'First name',
      value: '',
      label: 'First Name',
      type: 'input',
      required: true,
    },
    {
      key: 'Middle name',
      value: '',
      label: 'Middle Name',
      type: 'input',
      required: false,
    },
    {
      key: 'Last name',
      value: '',
      label: 'Last Name',
      type: 'input',
      required: true,
    },
    { key: 'Email', value: '', label: 'Email', type: 'input', required: true },
    {
      key: 'Mobile Number',
      value: '',
      label: 'Mobile Number',
      type: 'input',
      required: false,
    },
    {
      key: 'Phone Number',
      value: '',
      label: 'Phone Number',
      type: 'input',
      required: false,
    },
    {
      key: 'Address',
      value: '',
      label: 'Address',
      type: 'input',
      required: false,
    },
    {
      key: 'Country',
      value: '',
      label: 'Country',
      type: 'input',
      required: false,
    },
    { key: 'State', value: '', label: 'State', type: 'input', required: false },
    { key: 'City', value: '', label: 'City', type: 'input', required: false },
    {
      key: 'Zip Code',
      value: '',
      label: 'Zip Code',
      type: 'input',
      required: false,
    },
  ]);

  const [Education, setEducation] = useState([
    {
      key: 'Education',
      School: { key: 'School', value: '', label: 'School', type: 'input' },
      Degree: { key: 'Degree', value: '', label: 'Degree', type: 'input' },
      Major: { key: 'Major', value: '', label: 'Major', type: 'input' },
      Start: {
        key: 'Start Year',
        value: '',
        label: 'Start Year',
        type: 'input',
      },
      End: { key: 'End Year', value: '', label: 'End Year', type: 'input' },
    },
  ]);

  const [WorkExp, setWorkExp] = useState([
    {
      key: 'WorkExp',
      Company: { key: 'Company', value: '', label: 'Company', type: 'input' },
      Title: {
        key: 'Position Title',
        value: '',
        label: 'Title',
        type: 'input',
      },
      Description: {
        key: 'Description',
        value: '',
        label: 'Description',
        type: 'textarea',
      },
    },
  ]);

  const [Interests, setInterests] = useState([
    {
      key: 'Interest',
      value: '',
      label: 'Interest',
      type: 'input',
      required: false,
    },
  ]);

  const [Skills, setSkills] = useState([
    { key: 'Skill', value: '', label: 'Skill', type: 'input', required: false },
  ]);

  // Loads data from local storage into the stateful FormData variable
  const handleFormDataLoad = () => {
    PersonalInfo.forEach((data, index) => {
      chrome.storage.sync.get([data.key], function (result) {
        if (result[data.key] !== undefined) {
          data.value = result[data.key];
          handleFormDataChange(index, data.value, 'Personal');
        }
      });
    });

    chrome.storage.sync.get(['WorkExp'], function (result) {
      if (result['WorkExp'] !== undefined) {
        setWorkExp(result['WorkExp']);
      }
    });

    chrome.storage.sync.get(['Education'], function (result) {
      if (result['Education'] !== undefined) {
        setEducation(result['Education']);
      }
    });

    chrome.storage.sync.get(['Interests'], function (result) {
      if (result['Interests'] !== undefined) {
        setInterests(result['Interests']);
      }
    });

    chrome.storage.sync.get(['Skills'], function (result) {
      if (result['Skills'] !== undefined) {
        setSkills(result['Skills']);
      }
    });
  };

  // Updates FormData on change to any form field
  const handleFormDataChange = (index: any, str: any, section: any) => {
    if (section === 'Personal') {
      const updatedData = [...PersonalInfo];
      updatedData[index].value = str;
      setPersonalInfo(updatedData);
    }
  };

  // Stores current FormData in the local storage

  const handleClear = () => {
    // Just go back to blank states then run call submission
  };

  // Limit the size of the file uploaded
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];

    if (selectedFile) {
      // Adjust the maximum file size (in bytes) as needed
      const maxSize = 1024 * 1024 * 10; // 10 MB

      if (selectedFile.size > maxSize) {
        setErrorMessage('File size exceeds the limit (10MB)');
        event.target.value = ''; // Clear the file input
        alert('File size exceeds the limit (10MB)');
      } else {
        // File size is within the limit
        setErrorMessage('');
      }
    }
  };

  // traverseFileInputs function processes file inputs on the document
  const traverseFileInputs = () => {
    // Select all file input elements on the document
    const fileInputs = document.querySelectorAll('input[type="file"]');
    console.log(fileInputs);

    // Iterate over each file input
    fileInputs.forEach((input) => {
      // Check if the element is an instance of HTMLInputElement and has files
      if (
        input instanceof HTMLInputElement &&
        input.files &&
        input.files.length > 0
      ) {
        // Get the first file from the input's files array
        const file = input.files[0];
        // Use the input's name attribute as the key (assuming it is used as the key)
        const key = input.name;

        // Call the saveFile function to save the file with the specified key
        saveFile(file, key)
          .then((message) => console.log(message))
          .catch((error) => console.error(error));
      }
    });
  };

  const handleRetrieveFiles = async () => {
    const files = await getAllFiles();
    console.log(files); // You can handle these files as needed (e.g., display in the UI)
  };

  useEffect(() => {
    handleFormDataLoad();
    handleFileChange;
  }, []);

  // handleSubmit function handles the submission of form data
  const handleSubmit = () => {
    // Traverse file inputs to save files to IndexedDB
    traverseFileInputs();

    // Initialize an object to store form data
    let dataToSave = {};

    // Iterate over Personal Info and trim values
    PersonalInfo.forEach((data) => {
      dataToSave[data.key] = data.value.trim();
    });

    let WorkExpArray = [];
    WorkExp.forEach((data) => {
      WorkExpArray.push(data);
    });
    dataToSave['WorkExp'] = WorkExpArray;

    let EducationArray = [];
    Education.forEach((data) => {
      EducationArray.push(data);
    });
    dataToSave['Education'] = EducationArray;

    // Iterates over all Interests and Adds them to array
    let InterestsArray = [];
    Interests.forEach((data) => {
      InterestsArray.push(data);
    });
    dataToSave['Interests'] = InterestsArray;

    // Iterates over all Interests and Adds them to array
    let SkillsArray = [];
    Skills.forEach((data) => {
      SkillsArray.push(data);
    });
    dataToSave['Skills'] = SkillsArray;

    // Save the form data to chrome.storage.sync
    chrome.storage.sync.set(dataToSave, function () {
      // Log a success message to the console
      console.log('Data saved to chrome.storage.sync.');

      // Trigger a function to handle loading form data (assuming it is defined)
      handleFormDataLoad();
    });
  };

  const temp = 'Test';
  return (
    <>
      <Container>
        <h1 className='text-center mb-4 mt-4'>EasyApp Options</h1>

        <Form>
          <hr />
          <Row className='mb-3'>
            <PersonalComp info={PersonalInfo} setInfo={setPersonalInfo} />
          </Row>
          <hr />
          <Row className='mb-3'>
            <WorkComp info={WorkExp} setInfo={setWorkExp} />
          </Row>
          <hr />
          <Row className='mb-3'>
            <EducationComp info={Education} setInfo={setEducation} />
          </Row>
          <hr />
          <Row className='mb-3'>
            <Col>
              <InterestComp info={Interests} setInfo={setInterests} />
            </Col>

            <Col>
              <SkillsComp info={Skills} setInfo={setSkills} />
            </Col>
          </Row>
          <hr />
          <h2 className='text-center mb-3'>Files</h2>
          <Form.Group>
            <Form.Label>Upload Resume:</Form.Label>
            <Form.Control
              type='file'
              accept='.pdf, .doc, .docx, .tex'
              name='resume'
              onChange={handleFileChange}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Upload Cover Letter:</Form.Label>
            <Form.Control
              type='file'
              accept='.pdf, .doc, .docx, .tex'
              name='coverletter'
              onChange={handleFileChange}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Upload CV:</Form.Label>
            <Form.Control
              type='file'
              accept='.pdf, .doc, .docx, .tex'
              name='cv'
              onChange={handleFileChange}
            />
          </Form.Group>
          <Button onClick={handleRetrieveFiles}>Retrieve Files</Button>
          <Container>
            <Row>
              <Col>
                <Button variant='primary' onClick={handleSubmit}>
                  Submit
                </Button>{' '}
              </Col>
              <Col>
                <Button variant='danger' onClick={handleClear}>
                  Clear
                </Button>{' '}
              </Col>
            </Row>
          </Container>
        </Form>
      </Container>
    </>
  );
}

export default EasyAppOptions;
