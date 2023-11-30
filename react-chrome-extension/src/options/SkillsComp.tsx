import React from 'react';
import { useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';

export default function SkillsComp({ info, setInfo }) {
  const handleDataChange = (index, str) => {
    const updatedData = [...info];
    updatedData[index].value = str;
    setInfo(updatedData);
  };

  const handleDataAdd = () => {
    setInfo([
      ...info,
      {
        key: 'Skill',
        value: '',
        label: 'Skill',
        type: 'input',
        required: false,
      },
    ]);
  };

  const handleRemoveExperience = (index) => {
    const updatedExperience = [...info];
    updatedExperience.splice(index, 1);
    setInfo(updatedExperience);
  };

  function Field(key) {
    return (
      <Row>
        <Col>
          <Form.Group>
            <Form.Control
              as={info[key].type}
              placeholder={info[key].key}
              defaultValue={info[key].value}
              value={info[key].value}
              onChange={(event) => handleDataChange(key, event.target.value)}
            />
          </Form.Group>
        </Col>
        <Col xs='auto'>
          <Button variant='danger' onClick={() => handleRemoveExperience(key)}>
            Delete
          </Button>
        </Col>
      </Row>
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
          <h2 className='text-center mb-3'>Skills</h2>
        </Col>
      </Row>
      {info.map((data, index) => {
        return Field(index);
      })}
    </>
  );
}
