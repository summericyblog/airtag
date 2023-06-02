import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Book {
  name: string;
  authors: { name: string; url: string }[];
}

const BookListPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          'http://127.0.0.1:8000/api/book/books/'
        );
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
      {books.map((book, index) => (
        <div key={index}>
          <h6>{book.name}</h6>

          <p>Authors:</p>
          <ul>
            {book.authors.map((author, authorIndex) => (
              <li key={authorIndex}>
                <a href={`/authors/${author.url}`}>{author.name}</a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default BookListPage;
