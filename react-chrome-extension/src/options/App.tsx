// This app is the settings page where users can enter their info, and tweak general options about the extension

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
                    <Form.Label>Veteran Status (Optional)</Form.Label>
                    <Form.Control as="select" {...register('language')}>
                        <option value="">--Select--</option>
                        <option value="protected_veteran">I am a protected veteran</option>
                        <option value="not_protected_veteran">I am not a protected veteran</option>
                        <option value="unanswered_veteran">I prefer not to answer</option>
                    </Form.Control>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Disability Status (Optional)</Form.Label>
                    <Form.Control as="select" {...register('language')}>
                        <option value="">--Select--</option>
                        <option value="yes_disabled">Yes, I have a disability, or have had one in the past </option>
                        <option value="no_disabled">No, I do not have a disability and have not had one in the past</option>
                        <option value="unanswered_disabled">I do not want to answer</option>
                    </Form.Control>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Gender (Optional)</Form.Label>
                    <Form.Control as="select" {...register('language')}>
                        <option value="">--Select--</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="unanswered_gender">Prefer not to answer</option>
                    </Form.Control>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Ethnicity (Optional)</Form.Label>
                    <Form.Control as="select" {...register('language')}>
                        <option value="">--Select--</option>
                        <option value="African_American">African American or Black</option>
                        <option value="American_indian">American Indian or Alaska Native</option>
                        <option value="Asian">Asian</option>
                        <option value="hispanic-latinx">Hispanic or Latino(a)</option>
                        <option value="multi-racial">Multi-Racial</option>
                        <option value="hawaiian_PI">Native Hawaiian or Other Pacific Islander</option>
                        <option value="Caucasian">White</option>
                        <option value="unanswered_ethnicity">Prefer not to answer</option>
                    </Form.Control>
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
