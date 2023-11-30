import { any, number } from 'prop-types';
import React from 'react';
import { useEffect, useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';

export default function PersonalComp({ info, setInfo }) {
  const handleDataChange = (index, str) => {
    const updatedData = [...info];
    updatedData[index].value = str;
    setInfo(updatedData);
  };

  function Field(key) {
    return (
      <Form.Group>
        <Form.Control // OpenAi Key
          as={info[key].type}
          placeholder={info[key].key}
          defaultValue={info[key].value}
          value={info[key].value}
          onChange={(event) => handleDataChange(key, event.target.value)}
        />
      </Form.Group>
    );
  }

  return (
    <>
      <h2 className='text-center mb-3'>Personal Information</h2>
      <Row>{Field(0) /* OpenAi Key */}</Row>

      <Row>
        <Col>{Field(1) /* First Name */}</Col>

        <Col>{Field(2) /* Middle Name */}</Col>

        <Col>{Field(3) /* Last Name */}</Col>
      </Row>

      <Row>
        <Col>{Field(4) /* Email */}</Col>

        <Col>{Field(5) /* Mobile Phone Number */}</Col>

        <Col>{Field(6) /* Work Phone Number */}</Col>
      </Row>

      <Row>{Field(7) /* Address */}</Row>

      <Row>
        <Col>{Field(8) /* Country */}</Col>

        <Col>{Field(9) /* State */}</Col>

        <Col>{Field(10) /* City */}</Col>

        <Col>{Field(11) /* Zip Code */}</Col>
      </Row>
    </>
  );
}
