import React from 'react';
import { useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';

export default function EducationComp({ info, setInfo }) {
  const handleDataChange = (index, str, section) => {
    const updatedData = [...info];
    switch (section) {
      case 1:
        updatedData[index].School.value = str;
        break;
      case 2:
        updatedData[index].Degree.value = str;
        break;
      case 3:
        updatedData[index].Major.value = str;
        break;
      case 4:
        updatedData[index].Start.value = str;
        break;
      case 5:
        updatedData[index].End.value = str;
        break;
      default:
        break;
    }
    setInfo(updatedData);
  };

  const handleDataAdd = () => {
    setInfo([
      ...info,
      {
        key: 'Education',
        School: { key: 'School', value: '', label: 'School', type: 'input' },
        Degree: { key: 'Degree', value: '', label: 'Degree', type: 'input' },
        Major: { key: 'Major', value: '', label: 'Major', type: 'input' },
        Start: {
          key: 'Start Year',
          value: '',
          label: 'Start Year',
          type: 'input',
        },
        End: { key: 'End Year', value: '', label: 'End Year', type: 'input' },
      },
    ]);
  };

  const handleRemoveEducation = (index) => {
    const updatedEducation = [...info];
    updatedEducation.splice(index, 1);
    setInfo(updatedEducation);
  };

  function Field(key) {
    return (
      <>
        <Row>
          <Col>
            <Form.Group>
              <Form.Control
                as={info[key].School.type}
                placeholder={info[key].School.key}
                defaultValue={info[key].School.value}
                value={info[key].School.value}
                onChange={(event) =>
                  handleDataChange(key, event.target.value, 1)
                }
              />
            </Form.Group>
          </Col>
          <Col xs='auto'>
            <Button variant='danger' onClick={() => handleRemoveEducation(key)}>
              Delete
            </Button>
          </Col>
        </Row>

        <Row className='mb-3'>
          <Col sm={4}>
            <Form.Group>
              <Form.Control
                as={info[key].Degree.type}
                placeholder={info[key].Degree.key}
                defaultValue={info[key].Degree.value}
                value={info[key].Degree.value}
                onChange={(event) =>
                  handleDataChange(key, event.target.value, 2)
                }
              />
            </Form.Group>
          </Col>

          <Col sm={4}>
            <Form.Group>
              <Form.Control
                as={info[key].Major.type}
                placeholder={info[key].Major.key}
                defaultValue={info[key].Major.value}
                value={info[key].Major.value}
                onChange={(event) =>
                  handleDataChange(key, event.target.value, 3)
                }
              />
            </Form.Group>
          </Col>

          <Col sm={2}>
            <Form.Group>
              <Form.Control
                as={info[key].Start.type}
                placeholder={info[key].Start.key}
                defaultValue={info[key].Start.value}
                value={info[key].Start.value}
                onChange={(event) =>
                  handleDataChange(key, event.target.value, 4)
                }
              />
            </Form.Group>
          </Col>

          <Col sm={2}>
            <Form.Group>
              <Form.Control
                as={info[key].End.type}
                placeholder={info[key].End.key}
                defaultValue={info[key].End.value}
                value={info[key].End.value}
                onChange={(event) =>
                  handleDataChange(key, event.target.value, 5)
                }
              />
            </Form.Group>
          </Col>
        </Row>
      </>
    );
  }

  return (
    <>
      <Row>
        <Col xs='auto'>
          <Button variant='success' onClick={handleDataAdd}>
            Add
          </Button>
        </Col>
        <Col>
          <h2 className='text-center mb-3'>Education</h2>
        </Col>
      </Row>
      {info.map((data, index) => {
        return Field(index);
      })}
    </>
  );
}
