import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { back_url } from '../common/backurl';

const AuthorDetailsPage = () => {
  const { pk } = useParams();
  const [author, setAuthor] = useState<any | null>(null);
  const navigate = useNavigate();

  const handleEditAuthor = () => {
    navigate(`/authors/edit/${pk}`);
  };

  const handleDeleteAuthor = async () => {
    try {
      const response = await axios.delete(back_url + `/api/book/authors/${pk}`);
      if (response.status === 200 || response.status === 204) {
        console.log('Author deleted successfully!');
        navigate(`/authors`);
      } else {
        console.error('Failed to delete author:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting author:', error);
    }
  };

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const response = await axios.get(back_url + `/api/book/authors/${pk}`);
        const data = response.data;
        setAuthor(data);
      } catch (error) {
        console.error('Error fetching author:', error);
      }
    };

    fetchAuthor();
  }, [pk]);

  if (!author) {
    return (
      <div className="container">
        <h4>Loading...</h4>
      </div>
    );
  }

  return (
    <div className="container">
      <h4>{author.name}</h4>
      <div className="d-flex justify-content-between mb-3">
        <button className="btn btn-primary" onClick={handleEditAuthor}>
          Edit
        </button>
        <button className="btn btn-danger" onClick={handleDeleteAuthor}>
          Delete
        </button>
      </div>
      <p className="mb-2">Full Name: {author.name_full}</p>
      <p className="mb-2">Chinese Name: {author.name_cn}</p>
      <p className="mb-2">Nation: {author.nation}</p>
      <p className="mb-2">Gender: {author.gender}</p>
      <p className="mb-2">Born: {author.born}</p>

      <h6 className="mt-4">Books:</h6>
      <ul className="list-group">
        {author.books.map((book: any, index: number) => (
          <li className="list-group-item" key={index}>
            <a
              href={`/books/${book.url}`}
              target="_blank"
              rel="noopener noreferrer">
              {book.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AuthorDetailsPage;
