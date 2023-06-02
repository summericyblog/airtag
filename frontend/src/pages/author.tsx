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
      <p>Full Name: {author.name_full}</p>
      <p>Chinese Name: {author.name_cn}</p>
      <p>Nation: {author.nation}</p>
      <p>Gender: {author.gender}</p>
      <p>Born: {author.born}</p>

      <h6>Books:</h6>
      <ul className="list-group">
        {author.books.map((book: any, index: number) => (
          <li className="list-group-item" key={index}>
            <a href={book.url} target="_blank" rel="noopener noreferrer">
              {book.name}
            </a>
          </li>
        ))}
      </ul>
      <button className="btn btn-primary" onClick={handleEditAuthor}>
        Edit
      </button>
      <button className="btn btn-danger" onClick={handleDeleteAuthor}>
        Delete
      </button>
    </div>
  );
};

export default AuthorDetailsPage;
