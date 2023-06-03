import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Badge } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import { back_url } from '../common/backurl';

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
    back_url + 'api/tagpath/tag-children'
  );
  return response.data;
};

export const fetchTagChildren = async (
  tags: Tag[],
  new_t?: Tag
): Promise<Tag[]> => {
  const response = await axios.post<Tag[]>(
    back_url + 'api/tagpath/tag-children',
    { tags, new_t }
  );
  return response.data;
};

export const mergeTags = async (
  tags: Tag[],
  newTag: string
): Promise<Tag[]> => {
  const response = await axios.post<Tag[]>(back_url + 'api/tagpath/tag-merge', {
    tags,
  });
  return response.data;
};

export const fetchBooks = async (tags: Tag[]): Promise<Book[]> => {
  const response = await axios.post<Book[]>(
    back_url + 'api/book/books/filter_by_tags/',
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

  useEffect(() => {
    const updateData = async () => {
      await fetchBooks(selectedTags)
        .then((result) => setBooks(result))
        .catch((error) => console.error(error));
    };

    updateData();
  }, [selectedTags]);

  const selectTag = async (tag: Tag) => {
    const updatedSelectedTags = [...selectedTags, tag];
    setSelectedTags(updatedSelectedTags);

    const updatedUnselectedTags = unselectedTags.filter((t) => t.pk !== tag.pk);
    setUnselectedTags(updatedUnselectedTags);

    const merged = await mergeTags(updatedSelectedTags, tag.pk);
    setSelectedTags(merged);

    const updatedUnselected = await fetchTagChildren(merged, tag);
    setUnselectedTags(updatedUnselected);

    const updatedBooks = await fetchBooks(merged);
    setBooks(updatedBooks);
  };

  const deselectTag = async (tag?: Tag) => {
    const updatedSelectedTags = selectedTags.filter((t) => t.pk !== tag?.pk);
    setSelectedTags(updatedSelectedTags);

    const updatedUnselectedTags = tag
      ? [...unselectedTags, tag]
      : unselectedTags;
    setUnselectedTags(updatedUnselectedTags);

    const merged = await mergeTags(updatedSelectedTags, tag?.pk || '');
    setSelectedTags(merged);

    const updatedUnselected = await fetchTagChildren(merged);
    setUnselectedTags(updatedUnselected);

    const updatedBooks = await fetchBooks(merged);
    setBooks(updatedBooks);
  };

  return (
    <div>
      <p>Tags Selected</p>
      <div>
        {selectedTags.map((tag) => (
          <Badge key={tag.pk} onClick={() => deselectTag(tag)}>
            {tag.name}
          </Badge>
        ))}
      </div>
      <p>Tags Unselected</p>
      <div>
        {unselectedTags.map((tag) => (
          <Badge key={tag.pk} onClick={() => selectTag(tag)}>
            {tag.name}
          </Badge>
        ))}
      </div>
      <p>Filter list</p>
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
