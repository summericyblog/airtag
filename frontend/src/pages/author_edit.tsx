import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { back_url } from '../common/backurl';

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
    <div className="container">
      <h4>Edit Author</h4>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Name
        </label>
        <input
          type="text"
          className="form-control"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="fullName" className="form-label">
          Full Name
        </label>
        <input
          type="text"
          className="form-control"
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="chineseName" className="form-label">
          Chinese Name
        </label>
        <input
          type="text"
          className="form-control"
          id="chineseName"
          value={chineseName}
          onChange={(e) => setChineseName(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="nation" className="form-label">
          Nation
        </label>
        <input
          type="text"
          className="form-control"
          id="nation"
          value={nation}
          onChange={(e) => setNation(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="gender" className="form-label">
          Gender
        </label>
        <input
          type="text"
          className="form-control"
          id="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="born" className="form-label">
          Born
        </label>
        <input
          type="text"
          className="form-control"
          id="born"
          value={born}
          onChange={(e) => setBorn(e.target.value)}
        />
      </div>
      <button className="btn btn-primary" onClick={handleUpdateAuthor}>
        Update
      </button>
    </div>
  );
};

export default AuthorEditPage;
