// UpdateForm.js

import React, { useState } from 'react';
import axios from 'axios';

const UpdateForm = ({ userId, initialUserData, onUpdate }) => {
  const [userData, setUserData] = useState(initialUserData);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:3000/users/${userId}`, userData); // Adjust URL as per your backend
      onUpdate(response.data.user); // Pass updated user back to parent component
    } catch (error) {
      console.error('Error updating user:', error);
      // Handle error state or display error message to user
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Name" value={userData.name} onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" value={userData.email} onChange={handleChange} required />
      <button type="submit">Update User</button>
    </form>
  );
};

export default UpdateForm;
