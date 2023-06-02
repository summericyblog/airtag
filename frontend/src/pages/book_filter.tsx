import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Badge } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';

interface Tag {
  name: string;
  pk: string;
}

interface Book {
  name: string;
  authors: { name: string; url: string }[];
}

export const fetchInitialTags = async (): Promise<Tag[]> => {
  const response = await axios.post<Tag[]>(
    'http://127.0.0.1:8000/api/tagpath/tag-children'
  );
  return response.data;
};

export const fetchTagChildren = async (tag: Tag): Promise<Tag[]> => {
  const response = await axios.post<Tag[]>(
    'http://127.0.0.1:8000/api/tagpath/tag-children',
    { tag }
  );
  return response.data;
};

export const mergeTags = async (
  tags: Tag[],
  newTag: string
): Promise<Tag[]> => {
  const response = await axios.post<Tag[]>(
    'http://127.0.0.1:8000/api/tagpath/tag-merge',
    { tags, new_t: newTag }
  );
  return response.data;
};

export const fetchBooks = async (tags: Tag[]): Promise<Book[]> => {
  const response = await axios.post<Book[]>(
    'http://127.0.0.1:8000/api/book/books/filter_by_tags/',
    { tags }
  );
  return response.data;
};

const MyPage = () => {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [unselectedTags, setUnselectedTags] = useState<Tag[]>([]);
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      const tags = await fetchInitialTags();
      setUnselectedTags(tags);
    };
    fetchTags();
  }, []);

  const selectTag = async (tag: Tag) => {
    const newSelectedTags = [...selectedTags, tag];
    setSelectedTags(newSelectedTags);
    setUnselectedTags(unselectedTags.filter((t) => t.pk !== tag.pk));
    const children = await fetchTagChildren(tag);
    setUnselectedTags([...unselectedTags, ...children]);
    const merged = await mergeTags(newSelectedTags, tag.pk);
    setSelectedTags(merged);
    updateBooks(newSelectedTags);
  };

  const deselectTag = (tag: Tag) => {
    const newSelectedTags = selectedTags.filter((t) => t.pk !== tag.pk);
    setSelectedTags(newSelectedTags);
    updateBooks(newSelectedTags);
  };

  const updateBooks = async (tags: Tag[]) => {
    const books = await fetchBooks(tags);
    setBooks(books);
  };

  return (
    <div>
      <p>1111111111111111111111</p>
      <div>
        {selectedTags.map((tag) => (
          <Badge key={tag.pk} onClick={() => deselectTag(tag)}>
            {tag.name}
          </Badge>
        ))}
      </div>
      <p>22222222222222222222222</p>
      <div>
        {unselectedTags.map((tag) => (
          <Badge key={tag.pk} onClick={() => selectTag(tag)}>
            {tag.name}
          </Badge>
        ))}
      </div>
      <p>3333333333333333333333</p>
      <div>
        {books.map((book) => (
          <Card key={book.name}>
            <Card.Title>{book.name}</Card.Title>
            <div>
              {book.authors.map((author) => (
                <a href={author.url} key={author.name}>
                  {author.name}
                </a>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyPage;
