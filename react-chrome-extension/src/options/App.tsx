// This app is the settings page where users can enter their info, and tweak general options about the extension

import React from 'react';
import {Container, Form, Button} from 'react-bootstrap';
import {useEffect, useState} from 'react';
  
function EasyAppOptions() {

    // Sets initial state of form fields
    const [FormData, setFormData] = useState([
        {key:"firstName", value:'', label:"First Name", type:"input"},
        {key:"lastName", value:'', label:"Last Name", type:"input"},
        {key:"email", value:'', label:"Email", type:"input"},
        {key:"phoneNumber", value:'', label:"Phone Number", type:"input"},

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
          FormData.forEach((data, index) => {
              chrome.storage.sync.get([data.key], function(result) {
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

    const handleSubmit = () => {
        let dataToSave: { [key: string]: string } = {};
        FormData.forEach((data) => {
            dataToSave[data.key] = data.value.trim();
        });

        chrome.storage.sync.set(dataToSave, function() {
            console.log('Data saved to chrome.storage.sync.');
            handleFormDataLoad();
        });
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


    return (
        <Container>
            <h2 className="text-center mb-4">EasyApp Options</h2>

            <Form>

                {FormData.map((data, index) => (
                    <Form.Group key={index}>
                        <Form.Label>{data.label}</Form.Label>
                        <Form.Control
                            as = {(index<2)?"input":"textarea"}
                            // placeholder = {data.key}
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
                    <Form.Control type="file" name="Cover Letter" />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Upload CV:</Form.Label>
                    <Form.Control type="file" name="CV" />
                </Form.Group>

                 <Button onClick={handleSubmit} >Submit</Button>{' '}
            </Form>
        </Container>
    );
}

export default EasyAppOptions;
