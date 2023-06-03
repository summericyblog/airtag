import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { back_url } from '../common/backurl';
import { Badge, Container, Row, Col } from 'react-bootstrap';
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

const BookDetailPage = () => {
  const [book, setBook] = useState<Book | null>(null);
  const { pk } = useParams();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(back_url + `api/book/books/${pk}`);
        setBook(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBook();
  }, [pk]);

  if (!book) {
    return <p>Loading...</p>;
  }
  console.log(book.tags);

  return (
    <Container fluid>
      <Row>
        <Col>
          <h2>{book.name}</h2>
          <p>Name (Chinese): {book.name_cn}</p>
          <p>Rating: {book.rating}</p>
          <p>Publisher: {book.publisher}</p>
          <p>Publication Date: {book.publication_date}</p>
          <p>Summary: {book.summary}</p>
          <p>ISBN: {book.isbn}</p>
          <p>Pages: {book.pages}</p>
          <p>Language: {book.language}</p>
          <p>Cover Image: {book.cover_image}</p>
          <p>Path: {book.path}</p>
          <p>Series: {book.series}</p>
          <p>Series Number: {book.series_number}</p>

          <p>Authors:</p>
          <div>
            {book.authors.map((author, index) => (
              <span key={index}>
                <a href={`/authors/${author.url}`}>{author.name}</a>
                {index !== book.authors.length - 1 && ' ; '}
              </span>
            ))}
          </div>

          <p>Tags:</p>
          <div>
            {book.tags.map((tag, index) => (
              <Badge key={index} bg="primary" className="me-2">
                {tag.name}
              </Badge>
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default BookDetailPage;
