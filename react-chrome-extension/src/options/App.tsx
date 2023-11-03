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
        const objectStore = db.createObjectStore('files', { autoIncrement: true });
        objectStore.createIndex('name', 'name', { unique: false });
      };
    });
  };
  
  const saveFile = (file:File) => {
    return openDB().then((db) => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction('files', 'readwrite');
        const objectStore = transaction.objectStore('files');
        const request = objectStore.add(file);
  
        request.onsuccess = () => {
          resolve('File saved successfully');
        };
  
        request.onerror = () => {
          reject('Error saving file');
        };
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
function EasyAppOptions() {

    // Sets initial state of form fields
    const [FormData, setFormData] = useState([
        {key:"First name", value:'', label:"First Name", type:"input"},
        {key:"middle name", value:'', label:"Middle Name", type:"input"},
        {key:"last name", value:'', label:"Last Name", type:"input"},
        {key:"gender", value:'', label:"Gender", type:"IDK"},
        {key:"sexual orientation", value:'', label:"Sexual Orientation", type:"IDK"},
        {key:"race", value:'', label:"Race", type:"IDK"},


        {key:"email", value:'', label:"Email", type:"input"},
        //{key:"work phone", value:'', label:"Work Phone", type:"input"},
        //{key:"mobile phone", value:'', label:"Mobile Phone", type:"input"},
        //{key:"fax", value:'', label:"Pager", type:"input"},
        //{key:"pager", value:'', label:"Pager", type:"input"},
        //{key:"home phone", value:'', label:"Home Phone", type:"input"},
        //{key:"other phone", value:'', label:"Mobile Phone", type:"input"},


        {key:"country", value:'', label:"Country", type:"input"},
        {key:"street", value:'', label:"Street", type:"input"},
        {key:"town", value:'', label:"Town", type:"input"},
        {key:"zip code", value:'', label:"Zip Code", type:"input"},
        {key:"state", value:'', label:"State", type:"input"},


        {key:"company", value:'', label:"Company", type:"input"},
        {key:"title", value:'', label:"Title", type:"input"},
        {key:"from", value:'', label:"From", type:"input"},
        {key:"to", value:'', label:"To", type:"input"},
        {key:"description", value:'', label:"Description", type:"input"},




        {key:"major", value:'', label:"Major", type:"input"},
        {key:"interests", value:'', label:"Interests", type:"textarea"},
        {key:"skills", value:'', label:"Skills", type:"textarea"},
        {key:"experience", value:'', label:"Experience", type:"textarea"},
        {key:"links", value:'', label:"Links", type:"textarea"},
        {key:"supplement", value:'', label:"SupplementaryText", type:"textarea"},
    ]);

    // On page load/refresh it loads local storage data into the value of the form field.
    useEffect(() => {
        handleFormDataLoad();
        handleFileChange;
    },[])

    // Loads data from local storage into the stateful FormData variable
    const handleFormDataLoad = () => {
        FormData.map((data, index) => {
            const value : any  = localStorage.getItem(data.key);
            if(value !== null){
                data.value = value;
                handleFormDataChange(index, data.value);
            }
        })
    }

    // Updates FormData on change to any form field
    const handleFormDataChange = (index : number, str : string) => {
        const updatedData = [...FormData];
        updatedData[index].value = str;
        setFormData(updatedData);
    }
    // Stores current FormData in the local storage
    const handleSubmit = () => {
        FormData.map((data: {key:string, value:string}) => {
            localStorage.setItem(data.key, data.value.trim())
        });
        handleFormDataLoad;
        console.log(FormData);
    }


    const handleClear = () => {
        FormData.map((data: {key:string, value:string}) => {
            localStorage.setItem(data.key, '')
        });
        location.reload();
        handleFormDataLoad;
    }

    // Limit the size of the file uploaded
    const [errorMessage, setErrorMessage] = useState('');

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target && e.target.files && e.target.files.length > 0) {
          const file = e.target.files[0];
          await saveFile(file);
        }
      };

      const handleRetrieveFiles = async () => {
        const files = await getAllFiles();
        console.log(files); // You can handle these files as needed (e.g., display in the UI)
      };



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
                    <Form.Control type="file" accept=".pdf, .doc, .docx, .tex" name="Resume" onChange={handleFileChange}/>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Upload Cover Letter:</Form.Label>
                    <Form.Control type="file" accept=".pdf, .doc, .docx, .tex" name="Cover Letter" onChange={handleFileChange}/>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Upload CV:</Form.Label>
                    <Form.Control type="file" accept=".pdf, .doc, .docx, .tex" name="CV" onChange={handleFileChange}/>
                </Form.Group>
                <Button onClick={handleRetrieveFiles}>Retrieve Files</Button>

                <Container>
                    <Row>
                        <Col>
                            <Button onClick={handleSubmit} >Submit</Button>{' '}
                        </Col>
                        <Col>
                            <Button style={{backgroundColor: '#FF0000'}} onClick={handleClear} >Clear</Button>{' '}
                        </Col>
                    </Row>
                </Container>

            </Form>
        </Container>
        </>

    );
}

export default EasyAppOptions;
