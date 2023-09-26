// This app is the settings page where users can enter their info, and tweak general options about the extension

import React from 'react';
import { Container, Form, Button, Dropdown, DropdownButton, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import {useEffect, useState} from 'react';


function LoadingButton() {
    const [isLoading, setLoading] = React.useState(false);
  
    React.useEffect(() => {
      function simulateNetworkRequest() {
        return new Promise((resolve) => setTimeout(resolve, 1000));
      }
  
      if (isLoading) {
        simulateNetworkRequest().then(() => {
          setLoading(false);
        });
      }
    }, [isLoading]);
  
    const handleClick = () => setLoading(true);
  
    return (
      <button
        className="btn btn-primary"
        disabled={isLoading}
        onClick={!isLoading ? handleClick : undefined}
      >
        {isLoading ? 'Loading…' : 'Submit'}
      </button>
    );
  }


function EasyAppOptions() {
    const { register, handleSubmit } = useForm();

    const onSubmit = (data: any) => {
        console.log(data);
    };

    return (
        <Container>
            <h2 className="text-center mb-4">EasyApp Options</h2>
            
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group>
                    <Form.Control type="text" placeholder="Your Name" {...register('name')} />
                </Form.Group>

                <Form.Group>
                    <Form.Control type="text" placeholder="Your Major" {...register('major')} />
                </Form.Group>

                <Form.Group>
                    <Form.Control as="textarea" placeholder="Your Interests" {...register('interests')} />
                </Form.Group>
                
                <Form.Group>
                    <Form.Control as="textarea" placeholder="Skills" {...register('skills')} />
                </Form.Group>
                
                <Form.Group>
                    <Form.Control as="textarea" placeholder="Past Jobs/Experiences" {...register('jobs')} />
                </Form.Group>

                <Form.Group>
                    <Form.Control as="textarea" placeholder="LinkedIn/Github/Personal Websites" {...register('links')} />
                </Form.Group>

                <Form.Group>
                    <Form.Control as="textarea" placeholder="Supplementary Text" {...register('otherQuestions')} />
                </Form.Group>


                <Form.Group>
                    <Form.Label>Upload Resume:</Form.Label>
                    <Form.Control type="file" {...register('resume')} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Upload Cover Letter:</Form.Label>
                    <Form.Control type="file" {...register('coverLetter')} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Upload CV:</Form.Label>
                    <Form.Control type="file" {...register('cv')} />
                </Form.Group>
                <LoadingButton />
            </Form>
        </Container>
    );
}

export default EasyAppOptions;
