// This app is the settings page where users can enter their info, and tweak general options about the extension

import React from 'react';
import { Container, Form, Button, Dropdown } from 'react-bootstrap';
import { useForm} from 'react-hook-form';

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
                    <Form.Label>Gender:</Form.Label>
                    <Form.Check type="radio" label="Male" value="male" {...register('Gender')} />
                    <Form.Check type="radio" label="Female" value="female" {...register('Gender')} />
                    <Form.Check type="radio" label="Other" value="other" {...register('Gender')} />
                </Form.Group>

                
                <Form.Group>
                    <Form.Label>Disabled Status:</Form.Label>
                    <Form.Check type="radio" label="Yes" value="yes" {...register('disabledStatus')} />
                    <Form.Check type="radio" label="No" value="no" {...register('disabledStatus')} />
                    <Form.Check type="radio" label="No Answer" value="no answer" {...register('disabledStatus')} />
                </Form.Group>

                
                <Form.Group>
                    <Form.Label>Veteran Status:</Form.Label>
                    <Form.Check type="radio" label="Yes" value="yes" {...register('veteranStatus')} />
                    <Form.Check type="radio" label="No" value="no" {...register('veteranStatus')} />
                    <Form.Check type="radio" label="No Answer" value="no answer" {...register('veteranStatus')} />
                </Form.Group>
                
                <Form.Group>
                    <Form.Label>Ethnicity:</Form.Label>
                    <Form.Check type="radio" label="White" value="white" {...register('ethnicity')} />
                    <Form.Check type="radio" label="Black" value="black" {...register('ethnicity')} />
                    <Form.Check type="radio" label="Asian" value="asian" {...register('ethnicity')} />
                    <Form.Check type="radio" label="Arab" value="arab" {...register('ethnicity')} />
                    <Form.Check type="radio" label="Hispanic/Latino" value="hispanic-latino" {...register('ethnicity')} />
                    <Form.Check type="radio" label="Mixed or Multiple ethnic groups" value="multiple" {...register('ethnicity')} />
                    <Form.Check type="radio" label="No Answer" value="no answer" {...register('ethnicity')} />
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
