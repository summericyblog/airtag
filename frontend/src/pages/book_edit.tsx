import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { back_url } from '../common/backurl';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

interface Book {
  name: string;
  name_cn: string;
  authors: { name: string; url: string }[];
  tags: { name: string; url: string }[];
  url: string;
  rating: number | null;
  publisher: string | null;
  publication_date: string | null;
  summary: string | null;
  isbn: string | null;
  pages: number | null;
  language: string | null;
  cover_image: string | null;
  path: string | null;
  series: string | null;
  series_number: number | null;
}

const BookEditPage = () => {
  const [book, setBook] = useState<Book | null>(null);
  const [modifiedBook, setModifiedBook] = useState<Book | null>(null);
  const { pk } = useParams();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(back_url + `api/book/books/${pk}`);
        setBook(response.data);
        setModifiedBook(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBook();
  }, [pk]);

  if (!book || !modifiedBook) {
    return <p>Loading...</p>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(back_url + `api/book/books/${pk}/`, modifiedBook);
      alert('Changes submitted!');
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setModifiedBook({ ...modifiedBook, [e.target.name]: e.target.value });
  };

  return (
    <Container fluid>
      <Row>
        <Col>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>Book Name:</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={modifiedBook.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formNameCN">
              <Form.Label>Name (Chinese):</Form.Label>
              <Form.Control
                type="text"
                name="name_cn"
                value={modifiedBook.name_cn}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formUrl">
              <Form.Label>URL:</Form.Label>
              <Form.Control
                type="text"
                name="url"
                value={modifiedBook.url}
                onChange={handleChange}
              />
            </Form.Group>

            {/* Add other form fields similarly */}

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default BookEditPage;
