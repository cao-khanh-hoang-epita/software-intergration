// App.js

import React, { useState } from 'react';
import CreateForm from './components/CreateForm';
import UserList from './components/UserList';
import UpdateForm from './components/UpdateForm';
import DeleteButton from './components/DeleteButton';

const App = () => {
  const [users, setUsers] = useState([]);

  const handleUserCreated = (newUser) => {
    setUsers([...users, newUser]);
  };

  const handleUserUpdated = (updatedUser) => {
    const updatedUsers = users.map((user) => (user._id === updatedUser._id ? updatedUser : user));
    setUsers(updatedUsers);
  };

  const handleUserDeleted = (userId) => {
    const updatedUsers = users.filter((user) => user._id !== userId);
    setUsers(updatedUsers);
  };

  return (
    <div>
      <CreateForm onUserCreated={handleUserCreated} />
      <UserList users={users} />
      {users.map((user) => (
        <div key={user._id}>
          <UpdateForm userId={user._id} initialUserData={user} onUpdate={handleUserUpdated} />
          <DeleteButton userId={user._id} onDelete={handleUserDeleted} />
        </div>
      ))}
    </div>
  );
};

export default App;
