import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import { back_url } from '../common/backurl';

type Author = {
  name: string;
  url: string;
};

const AuthorList: React.FC = () => {
  const [authors, setAuthors] = useState<Author[]>([]);

  useEffect(() => {
    const fetchAuthors = async () => {
      const response = await axios.get(back_url + 'api/book/authors/');
      const authors = response.data.map((author: any) => ({
        name: author.name,
        image_url: author.image_url,
        url: author.url,
      }));
      setAuthors(authors);
    };

    fetchAuthors();
  }, []);

  return (
    <ul className="list-group">
      {authors.map((author) => (
        <li key={author.url} className="list-group-item">
          <div className="d-flex align-items-center">
            <div>
              <h5 className="mb-1">
                <a href={`/authors/${author.url}`}>{author.name}</a>
              </h5>
              <p className="mb-0">{author.url}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

const AuthorListPage: React.FC = () => {
  return (
    <Container fluid>
      <Row>
        <Col>
          <AuthorList />
        </Col>
      </Row>
    </Container>
  );
};

export default AuthorListPage;
