import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthorListPage from './pages/authors';
import AuthorDetailsPage from './pages/author';
import AuthorEditPage from './pages/author_edit';
import BookDetailsPage from './pages/book';
import BookListPage from './pages/books';
import MyPage from './pages/book_filter';

export interface IAppProps {}

const App: React.FunctionComponent<IAppProps> = (props) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/authors" element={<AuthorListPage />} />
        <Route path="/authors/:pk" element={<AuthorDetailsPage />} />
        <Route path="/authors/edit/:pk" element={<AuthorEditPage />} />
        <Route path="/books" element={<BookListPage />} />
        <Route path="/books/filter" element={<MyPage />} />
        <Route path="/books/:pk" element={<BookDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
