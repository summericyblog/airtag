import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { back_url } from '../common/backurl';
import { Container, Form, Button } from 'react-bootstrap';

const AuthorEditPage: React.FC = () => {
  const { pk } = useParams<{ pk: string }>();
  const [author, setAuthor] = useState<any | null>(null);
  const [name, setName] = useState('');
  const [fullName, setFullName] = useState('');
  const [chineseName, setChineseName] = useState('');
  const [nation, setNation] = useState('');
  const [gender, setGender] = useState('');
  const [born, setBorn] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const response = await fetch(back_url + `/api/book/authors/${pk}`);
        const data = await response.json();
        setAuthor(data);
        setName(data.name);
        setFullName(data.name_full);
        setChineseName(data.name_cn);
        setNation(data.nation);
        setGender(data.gender);
        setBorn(data.born);
      } catch (error) {
        console.error('Error fetching author:', error);
      }
    };

    fetchAuthor();
  }, [pk]);

  const handleUpdateAuthor = async () => {
    try {
      const response = await fetch(back_url + `/api/book/authors/${pk}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          name_full: fullName,
          name_cn: chineseName,
          nation,
          gender,
          born,
        }),
      });
      if (response.ok) {
        console.log('Author updated successfully!');
        navigate(`/authors/${pk}`);
      } else {
        console.error('Failed to update author:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating author:', error);
    }
  };

  if (!author) {
    return (
      <div className="container">
        <h4>Loading...</h4>
      </div>
    );
  }

  return (
    <Container>
      <h4>Edit Author</h4>
      <Form>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="fullName">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="chineseName">
          <Form.Label>Chinese Name</Form.Label>
          <Form.Control
            type="text"
            value={chineseName}
            onChange={(e) => setChineseName(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="nation">
          <Form.Label>Nation</Form.Label>
          <Form.Control
            type="text"
            value={nation}
            onChange={(e) => setNation(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="gender">
          <Form.Label>Gender</Form.Label>
          <Form.Select
            value={gender}
            onChange={(e) => setGender(e.target.value)}>
            <option value="">Select</option>
            <option value="M">M</option>
            <option value="F">F</option>
            <option value="O">O</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3" controlId="born">
          <Form.Label>Born</Form.Label>
          <Form.Control
            type="text"
            value={born}
            onChange={(e) => setBorn(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" onClick={handleUpdateAuthor}>
          Update
        </Button>
      </Form>
    </Container>
  );
};

export default AuthorEditPage;
