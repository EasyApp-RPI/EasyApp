import React from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

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

                <Button type="submit" className="mt-4">Save Options</Button>
            </Form>
        </Container>
    );
}

export default EasyAppOptions;
