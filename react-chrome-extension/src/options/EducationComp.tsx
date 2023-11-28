import {useState} from "react"
import {Row, Col, Form, Button} from 'react-bootstrap';

export default function EducationComp() {

    const degreeOptions =
        [ {name: "High School", value: "Highschool"},
            {name: "Associate's Degree", value: "Associates"},
            {name: "Bachelor's Degree", value: "Bachelors"},
            {name: "Master's Degree", value: "Masters"},
            {name: "Master of Business Administration (M.B.A)", value: "MBA"},
            {name: "Juris Doctor (J.D.)", value: "JD"},
            {name: "Doctor of Medicine (M.D.)", value: "MD"},
            {name: "Doctor of Philosophy (Ph.D.)", value: "PHD"}
        ]

    interface Education {
        edu_name: string;
        edu_degree: string;
        edu_major: string;
        edu_location: string;
        edu_gpa: string;
        edu_from: string;
        edu_to: string;
        edu_current: boolean;
    }
    const [education, setEducation] = useState([
        {
            edu_name: '',
            edu_degree: '',
            edu_major: '',
            edu_location: '',
            edu_gpa: '',
            edu_from: '',
            edu_to: '',
            edu_current: false
        }
    ]);

    const handleAddEducation = () => {
        setEducation([...education, { edu_name: '', edu_degree: '', edu_major: '', edu_location: '', edu_gpa: '', edu_from: '', edu_to: '', edu_current: false }]);
    };

    const handleRemoveEducation = (index: number) => {
        const updatedEducation = [...education];
        updatedEducation.splice(index, 1);
        setEducation(updatedEducation);
    };

    const handleEducationChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedEducation = [...education];
        const {name, value, type, checked} = event.target;

        if (type == "checkbox"){
            (updatedEducation[index] as any)[name] = checked;
        }else{
            (updatedEducation[index] as any)[name] = value;
        }
        setEducation(updatedEducation);
    };

    return (
        <>
            {education.map((edu, index) => (
                <div key={index}>
                    <Form.Group as={Row}>
                        <Form.Label column sm={2}>
                            School:
                        </Form.Label>
                        <Col sm={4}>
                            <Form.Control
                                type="text"
                                name="school"
                                value={edu.edu_name}
                                onChange={(e) => handleEducationChange(index, e)}
                            />
                        </Col>
                        <Form.Label column sm={2}>
                            Degree:
                        </Form.Label>
                        <Col sm={4}>
                            <Form.Select aria-label="degree">
                                <option key={0} value="none">Select a Degree</option>
                                {degreeOptions.map((option, index) => (
                                    <option key={index + 1} value={option.value}> {option.name} </option>
                                ))}
                            </Form.Select>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="pb-3">
                        <Form.Label column sm={2}>
                            Major:
                        </Form.Label>
                        <Col sm={4}>
                            <Form.Control
                                type="text"
                                name="major"
                                value={edu.major}
                                onChange={(e) => handleEducationChange(index, e)}
                            />
                        </Col>

                        <Form.Label column sm={2}>
                            Graduation Date:
                        </Form.Label>
                        <Col sm={4}>
                            <Form.Control
                                type="date"
                                name="graduationMonth"
                                value={edu.graduation}
                                onChange={(e) => handleEducationChange(index, e)}
                            />
                        </Col>
                    </Form.Group>

                    {index > 0 && (
                        <Button variant="danger" onClick={() => handleRemoveEducation(index)}>
                            Remove
                        </Button>
                    )}

                </div>
            ))}
            <Button variant="primary" className="mt-2" onClick={handleAddEducation}>
                Add Education
            </Button>
        </>
    )
}