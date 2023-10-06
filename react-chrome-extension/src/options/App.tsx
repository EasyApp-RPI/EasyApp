// This app is the settings page where users can enter their info, and tweak general options about the extension

import React from 'react';
import {Container, Form, Button, Dropdown, DropdownButton, ToggleButton, ToggleButtonGroup} from 'react-bootstrap';
import {useForm} from 'react-hook-form';
import {useEffect, useState} from 'react';
import {ChangeEvent} from 'react';




  
function EasyAppOptions() {

 
    const {register, handleSubmit} = useForm();
    const [formData, setFormData] = useState({
      });
    const [storedValues, setStoredValues] = useState('');

    useEffect(() => {
        chrome.storage.local.get(null, (result) => {
            console.log("All stored data:", result);
            console.log(result.key.name);
            setStoredValues(result.key.name);
          });
    },[]);
    const onSubmit = (data: any) => {
        chrome.storage.local.set({ key: data }).then(() => {
            console.log("Value is set");
            console.log(data);
          });
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

            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group>
                    <Form.Control type="text" placeholder="Your Name" value={storedValues} {...register('name')} />
                </Form.Group>

                <Form.Group>
                    <Form.Control type="text" placeholder="Your Major" {...register('major')} />
                </Form.Group>

                <Form.Group>
                    <Form.Control as="textarea" placeholder="Your Interests" {...register('interests')} />
                </Form.Group>

                <Form.Group>
                    <Form.Control as="textarea" placeholder="Skills" {...register('skills')}/>
                </Form.Group>

                <Form.Group>
                    <Form.Control as="textarea" placeholder="Past Jobs/Experiences" {...register('jobs')} />
                </Form.Group>

                <Form.Group>
                    <Form.Control as="textarea"
                                  placeholder="LinkedIn/Github/Personal Websites" {...register('links')} />
                </Form.Group>

                <Form.Group>
                    <Form.Control as="textarea" placeholder="Supplementary Text" {...register('otherQuestions')} />
                </Form.Group>


                <Form.Group>
                    <Form.Label>Upload Resume:</Form.Label>
                    <Form.Control type="file" accept=".pdf, .doc, .docx, .tex" {...register('resume')} onChange={handleFileChange}/>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Upload Cover Letter:</Form.Label>
                    <Form.Control type="file" {...register('coverLetter')} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Upload CV:</Form.Label>
                    <Form.Control type="file" {...register('cv')} />
                </Form.Group>

                 <Button type="submit">Submit</Button>{' '}
            </Form>
        </Container>
    );
}

export default EasyAppOptions;
