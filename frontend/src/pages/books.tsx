import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { back_url } from '../common/backurl';
import { Card, Row, Col } from 'react-bootstrap';

interface Book {
  name: string;
  url: string;
  authors: { name: string; url: string }[];
}

const BookListPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(back_url + 'api/book/books/');
        setBooks(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBooks();
  }, []);

  if (books.length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Row>
        {books.map((book, index) => (
          <Col key={index} sm={12} md={6} lg={4} xl={3}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>
                  <a href={`books/${book.url}`}>{book.name}</a>
                </Card.Title>

                <Card.Text>Authors:</Card.Text>
                <div>
                  {book.authors.map((author, authorIndex) => (
                    <span key={authorIndex}>
                      <a href={`/authors/${author.url}`}>{author.name}</a>
                      {authorIndex !== book.authors.length - 1 && ' ; '}
                    </span>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default BookListPage;
