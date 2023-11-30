import React from 'react';
import {useState} from 'react';
import {Row, Col, Form, Button} from 'react-bootstrap';

export default function WorkComp({info, setInfo}){

  const handleDataChange = (index, str, section) => {
    const updatedData = [...info];
    switch (section) {
      case 1: updatedData[index].Company.value = str; break;
      case 2: updatedData[index].Title.value = str; break;
      case 3: updatedData[index].Description.value = str; break;
      default: break;
    }
    setInfo(updatedData);
  }

  const handleDataAdd = () => {
    setInfo([...info, { key:'WorkExp', Company:{key: 'Company', value: '' , label:'Company', type:'input'}, Title:{key: 'Position Title', value: '' , label:'Position Title', type:'input'}, Description: {key: 'Description', value: '' , label:'Description', type:'textarea'}, }]);
  };

  const handleRemoveExperience = (index) => {
    const updatedExperience = [...info];
    updatedExperience.splice(index, 1);
    setInfo(updatedExperience);
  };

  function Field(key){
    return(
      <>
        <Row>
          <Col>
            <Form.Group>
              <Form.Control 
              as = {info[key].Company.type}
              placeholder = {info[key].Company.key}
              defaultValue = {info[key].Company.value}
              value = {info[key].Company.value}
              onChange = {(event) => handleDataChange(key, event.target.value, 1)}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Control 
              as = {info[key].Title.type}
              placeholder = {info[key].Title.key}
              defaultValue = {info[key].Title.value}
              value = {info[key].Title.value}
              onChange = {(event) => handleDataChange(key, event.target.value, 2)}
              />
            </Form.Group>
          </Col>
          <Col xs="auto">
            <Button variant='danger' onClick={() => handleRemoveExperience(key)}>
              Delete
            </Button>
          </Col>
        </Row>
        <Row className='mb-3'>
          <Form.Group>
            <Form.Control 
            as = {info[key].Description.type}
            placeholder = {info[key].Description.key}
            defaultValue = {info[key].Description.value}
            value = {info[key].Description.value}
            onChange = {(event) => handleDataChange(key, event.target.value, 3)}
            />
          </Form.Group>
        </Row>
      </>
    )
  }

  return (
    <>
      <Row>
        <Col xs="auto">
          <Button variant='success' onClick={handleDataAdd}>Add</Button>
        </Col >
        <Col>
          <h2 className='text-center mb-3'>Work Experience</h2>
        </Col>
      </Row>
      {info.map((data,index) => {
        return Field(index);
      })}
    </>
  )
}