import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Book {
  name: string;
  authors: { name: string; url: string }[];
  tags: { name: string; id: string }[];
}

const BookDetailPage: React.FC = () => {
  const { pk } = useParams<{ pk: string }>();
  const [book, setBook] = useState<Book | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get<Book>(
          `http://127.0.0.1:8000/api/book/books/${pk}`
        );
        setBook(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBook();
  }, [pk]);

  if (!book) {
    return <h5>Loading...</h5>;
  }

  return (
    <div>
      <h4>{book.name}</h4>

      <h5>Authors:</h5>
      <ul>
        {book.authors.map((author, index) => (
          <li key={index}>
            <a href={`/authors/${author.url}`}>{author.name}</a>
          </li>
        ))}
      </ul>

      <h5>Tags:</h5>
      <ul>
        {book.tags.map((tag, index) => (
          <li key={index}>
            <a href={`/tag/${tag.id}`}>{tag.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookDetailPage;
