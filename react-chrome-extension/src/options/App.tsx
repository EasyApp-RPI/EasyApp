// This app is the settings page where users can enter their info, and tweak general options about the extension

import React from 'react';
import {Container, Form, Button} from 'react-bootstrap';
import {useEffect, useState, ChangeEvent} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const openDB = (): Promise<IDBDatabase> => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = window.indexedDB.open('FilesDB', 1);

    request.onerror = (event: Event) => {
      reject('Error opening database');
    };

    request.onsuccess = (event: Event) => {
      const target = event.target as IDBOpenDBRequest;
      const db = target.result as IDBDatabase;
      if (db) {
        resolve(db);
      } else {
        reject('Failed to open database');
      }
    };

    request.onupgradeneeded = (event: Event) => {
      const target = event.target as IDBOpenDBRequest;
      const db = target.result as IDBDatabase;
      db.createObjectStore('files', { keyPath: 'id' });
    };
  });
};
  
  const saveFile = (file: File, key: string) => {
    return openDB().then((db) => {
      return new Promise((resolve, reject) => {
        removeFile(key) // Remove existing file with the same key
          .then(() => {
            const transaction = db.transaction('files', 'readwrite');
            const objectStore = transaction.objectStore('files');
            const request = objectStore.add({ id: key, file });
  
            request.onsuccess = () => {
              resolve('File saved successfully');
            };
  
            request.onerror = () => {
              reject('Error saving file');
            };
          })
          .catch((error) => {
            reject(error);
          });
      });
    });
  };
  
  
  const getAllFiles = () => {
    return openDB().then((db) => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction('files', 'readonly');
        const objectStore = transaction.objectStore('files');
        const request = objectStore.getAll();
  
        request.onsuccess = () => {
          resolve(request.result);
        };
  
        request.onerror = () => {
          reject('Error getting files');
        };
      });
    });
  };


  const removeFile = (fileKey: string) => {
    return openDB().then((db) => {
      return new Promise<string>((resolve, reject) => {
        const transaction = db.transaction('files', 'readwrite');
        const objectStore = transaction.objectStore('files');
        const request = objectStore.delete(fileKey);
  
        request.onsuccess = () => {
          resolve('File removed successfully');
        };
  
        request.onerror = () => {
          reject('Error removing file');
        };
      });
    });
  };
function EasyAppOptions() {

    // Sets initial state of form fields
    const [FormData, setFormData] = useState([
        {key: "First name", value: '', label: "First Name", type: "input"},
        {key: "middle name", value: '', label: "Middle Name", type: "input"},
        {key: "last name", value: '', label: "Last Name", type: "input"},
        {key: "gender", value: '', label: "Gender", type: "IDK"},
        {key: "sexual orientation", value: '', label: "Sexual Orientation", type: "IDK"},
        {key: "race", value: '', label: "Race", type: "IDK"},


        {key: "email", value: '', label: "Email", type: "input"},
        //{key:"work phone", value:'', label:"Work Phone", type:"input"},
        //{key:"mobile phone", value:'', label:"Mobile Phone", type:"input"},
        //{key:"fax", value:'', label:"Pager", type:"input"},
        //{key:"pager", value:'', label:"Pager", type:"input"},
        //{key:"home phone", value:'', label:"Home Phone", type:"input"},
        //{key:"other phone", value:'', label:"Mobile Phone", type:"input"},


        {key: "country", value: '', label: "Country", type: "input"},
        {key: "street", value: '', label: "Street", type: "input"},
        {key: "town", value: '', label: "Town", type: "input"},
        {key: "zip code", value: '', label: "Zip Code", type: "input"},
        {key: "state", value: '', label: "State", type: "input"},


        {key: "company", value: '', label: "Company", type: "input"},
        {key: "comp_location", value: '', label: "Location", type: "input"},
        {key: "title", value: '', label: "Title", type: "input"},
        {key: "from", value: '', label: "From", type: "input"},
        {key: "to", value: '', label: "To", type: "input"},
        {key: "description", value: '', label: "Description", type: "input"},


        {key: "name", value: '', label: "Name", type: "input"},
        {key: "major", value: '', label: "Major", type: "input"},
        {key: "interests", value: '', label: "Interests", type: "textarea"},
        {key: "skills", value: '', label: "Skills", type: "textarea"},
        {key: "experience", value: '', label: "Experience", type: "textarea"},
        {key: "links", value: '', label: "Links", type: "textarea"},
        {key: "supplement", value: '', label: "SupplementaryText", type: "textarea"},

        // Education box
        {key: "edu_name", value: '', label: "School Name", type: "input"},
        {key: "edu_degree", value: '', label: "Degree", type: "dropdown"},
        {key: "edu_major", value: '', label: "Major", type: "input"},
        {key: "edu_location", value: '', label: "Location", type: "input"},
        {key: "edu_gpa", value: '', label: "GPA", type: "input"},
        {key: "edu_from", value: '', label: "From", type: "input"},
        {key: "edu_to", value: '', label: "To", type: "input"},
        {key: "edu_current", value: '', label: "Enrolling", type: "checkbox"},

        // Interests box
        {key: "interest_1", value: '', label: "Interest 1", type: "textarea"},

        // Skills box
        {key: "skill_1", value: '', label: "Skill 1", type: "textarea"},

        // File upload
        {key: "file_resume", value: '', label: "Upload Resume", type: "file"},
        {key: "file_CV", value: '', label: "Upload CV", type: "file"},
        {key: "file_resume", value: '', label: "Upload Resume", type: "file"},
        {key: "file_link", value: '', label: "Upload Cover Letter", type: "file"},
        {key: "file_link", value: '', label: "Links", type: "textarea"},

        // Other
        {key: "other_text", value: '', label: "Other", type: "textare"}

    ]);

    // On page load/refresh it loads local storage data into the value of the form field.

    // Loads data from local storage into the stateful FormData variable
    const handleFormDataLoad = () => {
        FormData.forEach((data, index) => {
            chrome.storage.sync.get([data.key], function (result) {
                if (result[data.key] !== undefined) {
                    data.value = result[data.key];
                    handleFormDataChange(index, data.value);
                }
            });
        });
    }

    // Updates FormData on change to any form field
    const handleFormDataChange = (index: any, str: any) => {
        const updatedData = [...FormData];
        updatedData[index].value = str;
        setFormData(updatedData);
    }

    // Stores current FormData in the local storage



    const handleClear = () => {
        FormData.map((data: { key: string, value: string }) => {
            localStorage.setItem(data.key, '')
        });
        location.reload();
        handleFormDataLoad;
    }

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
                alert("File size exceeds the limit (10MB)");

            } else {
                // File size is within the limit
                setErrorMessage('');
            }
        }
    };

    const traverseFileInputs = () => {
      const fileInputs = document.querySelectorAll('input[type="file"]');
      console.log(fileInputs);
    
      fileInputs.forEach((input) => {
        if (input instanceof HTMLInputElement && input.files && input.files.length > 0) {
          const file = input.files[0];
          const key = input.name; // Assuming the input's name attribute is used as the key
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
    }, [])

    const handleSubmit = () => {
        traverseFileInputs();
        let dataToSave: { [key: string]: string } = {};
        FormData.forEach((data) => {
            dataToSave[data.key] = data.value.trim();
        });

        chrome.storage.sync.set(dataToSave, function () {
            console.log('Data saved to chrome.storage.sync.');
            handleFormDataLoad();
        });
    }


        return (
            <>
                <style type="text/css">
                    {`
                .bgColor{
                    background-color: red; 
                    color: white;
                    }
                `}
            </style>
        <Container>
            <h2 className="text-center mb-4">EasyApp Options</h2>

            <Form>

                {FormData.map((data, index) => (
                    <Form.Group key={index}>
                        <Form.Control
                            as = {(index<2)?"input":"textarea"}
                            placeholder = {data.key}
                            defaultValue = {data.value}
                            value = {data.value}
                            onChange = {(event) => handleFormDataChange(index, event.target.value)}/>
                    </Form.Group>
                ))}


                <Form.Group>
                    <Form.Label>Upload Resume:</Form.Label>
                    <Form.Control type="file" accept=".pdf, .doc, .docx, .tex" name="resume" onChange={handleFileChange}/>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Upload Cover Letter:</Form.Label>
                    <Form.Control type="file" accept=".pdf, .doc, .docx, .tex" name="coverletter" onChange={handleFileChange}/>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Upload CV:</Form.Label>
                    <Form.Control type="file" accept=".pdf, .doc, .docx, .tex" name="cv" onChange={handleFileChange}/>
                </Form.Group>
                <Button onClick={handleRetrieveFiles}>Retrieve Files</Button>
                        <Container>
                            <Row>
                                <Col>
                                    <Button variant='primary'
                                            onClick={handleSubmit}>Submit</Button>{' '}
                                </Col>
                                <Col>
                                    <Button variant= 'danger'
                                            onClick={handleClear}>Clear</Button>{' '}
                                </Col>
                            </Row>
                        </Container>
                    </Form>
                </Container>
            </>

        );
    }

    export default EasyAppOptions;