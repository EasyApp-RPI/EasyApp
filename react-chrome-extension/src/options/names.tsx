import React from 'react';
import { useEffect, useState, ChangeEvent } from 'react';
import Container from 'react-bootstrap/Container'; // Add this import
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form'; // Add this import



export default function Names(){
    const [FormData, setFormData] = useState([
        { key: 'First name', value: '', label: 'First Name', type: 'input', required: true },
    { key: 'middle name', value: '', label: 'Middle Name', type: 'input', required: false },
    { key: 'last name', value: '', label: 'Last Name', type: 'input', required: true },
    { key: 'gender', value: '', label: 'Gender', type: 'select',required: true },
    { key: 'sexual orientation', value: '', label: 'Sexual Orientation',type: 'select', required: false},
    { key: 'race', value: '', label: 'Race', type: 'select',required: false },
    ]);

    const handleFormDataLoad = () => {
        FormData.forEach((data, index) => {
          chrome.storage.sync.get([data.key], function (result) {
            if (result[data.key] !== undefined) {
              data.value = result[data.key];
              handleFormDataChange(index, data.value);
            }
          });
        });
      };
      useEffect(() => {
        handleFormDataLoad();
      }, []);
    const handleFormDataChange = (index: any, str: any) => {
        const updatedData = [...FormData];
        updatedData[index].value = str;
        setFormData(updatedData);
      };
    const sectionStyle = {
        border: '1px solid #ccc',
        padding: '15px',
        borderRadius: '5px',
        marginBottom: '15px',
      };
      const genderOptions = ['Male', 'Female', 'Other'];
      const sexualOrientationOptions = ['Heterosexual', 'Homosexual', 'Bisexual', 'Other'];
      const raceOptions = ['Caucasian', 'African American', 'Asian', 'Hispanic', 'Other'];
    return (
        <Container>
          <Col style={sectionStyle}>
            <Row>
              <Col>
                <Form.Group controlId={FormData[0].key}>
                  <Form.Label>{FormData[0].label}</Form.Label>
                  <Form.Control
                    type={FormData[0].type}
                    placeholder={FormData[0].key}
                    value={FormData[0].value}
                    onChange={(event) => handleFormDataChange(0, event.target.value)}
                    required={FormData[0].required}
                  />
                </Form.Group>
              </Col>

              <Col>
                <Form.Group controlId={FormData[1].key}>
                  <Form.Label>{FormData[1].label}</Form.Label>
                  <Form.Control
                    type = {FormData[1].type}
                    placeholder={FormData[1].key}
                    value={FormData[1].value}
                    onChange={(event) => handleFormDataChange(1, event.target.value)}
                    required={FormData[1].required}
                  />
                </Form.Group>
              </Col>

              <Col>
                <Form.Group controlId={FormData[2].key}>
                  <Form.Label>{FormData[2].label}</Form.Label>
                  <Form.Control
                    type={FormData[2].type}
                    placeholder={FormData[2].key}
                    value={FormData[2].value}
                    onChange={(event) => handleFormDataChange(2, event.target.value)}
                    required={FormData[2].required}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group controlId={FormData[3].key}>
                  <Form.Label>{FormData[3].label}</Form.Label>
                  <Form.Select
                    value={FormData[3].value}
                    onChange={(event) => handleFormDataChange(3, event.target.value)}
                    required={FormData[3].required}
                  >
                    <option value="">Select Gender</option>
                    {genderOptions.map((option, index) => (
                      <option key={index} value={option.toLowerCase()}>
                        {option}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col>
                <Form.Group controlId={FormData[4].key}>
                  <Form.Label>{FormData[4].label}</Form.Label>
                  <Form.Select
                    value={FormData[4].value}
                    onChange={(event) => handleFormDataChange(4, event.target.value)}
                    required={FormData[4].required}
                  >
                    <option value="">Select Sexual Orientation</option>
                    {sexualOrientationOptions.map((option, index) => (
                      <option key={index} value={option.toLowerCase()}>
                        {option}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col>
                <Form.Group controlId={FormData[5].key}>
                  <Form.Label>{FormData[5].label}</Form.Label>
                  <Form.Select
                    value={FormData[5].value}
                    onChange={(event) => handleFormDataChange(5, event.target.value)}
                    required={FormData[5].required}
                  >
                    <option value="">Select Race</option>
                    {raceOptions.map((option, index) => (
                      <option key={index} value={option.toLowerCase()}>
                        {option}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Col>
          </Container>
    )
}