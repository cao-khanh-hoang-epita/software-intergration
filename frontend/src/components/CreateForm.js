// CreateForm.js

import React, { useState } from 'react';
import axios from 'axios';

const CreateForm = ({ onUserCreated }) => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/users', userData); // Adjust URL as per your backend
      onUserCreated(response.data.user); // Pass newly created user back to parent component
      setUserData({ name: '', email: '', password: '' }); // Clear form fields
    } catch (error) {
      console.error('Error creating user:', error);
      // Handle error state or display error message to user
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Name" value={userData.name} onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" value={userData.email} onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" value={userData.password} onChange={handleChange} required />
      <button type="submit">Create User</button>
    </form>
  );
};

export default CreateForm;
