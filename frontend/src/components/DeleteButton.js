// DeleteButton.js

import React from 'react';
import axios from 'axios';

const DeleteButton = ({ userId, onDelete }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/users/${userId}`); // Adjust URL as per your backend
      onDelete(userId); // Notify parent component that user has been deleted
    } catch (error) {
      console.error('Error deleting user:', error);
      // Handle error state or display error message to user
    }
  };

  return (
    <button onClick={handleDelete}>Delete</button>
  );
};

export default DeleteButton;
