const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

const mongoose = require('mongoose');
const { createUser, getUsers, updateUser, deleteUser } = require('../routes/users.route'); // Adjust path as necessary

const User = require('../models/user'); // Assuming you have a User model in a separate file

describe('User Routes', () => {
  let req, res;
  let statusStub, jsonStub;

  beforeEach(() => {
    req = {};
    statusStub = sinon.stub();
    jsonStub = sinon.stub();
    res = {
      status: statusStub.returnsThis(),
      json: jsonStub
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const user = {
        email: 'test@email.com',
        name: 'Test User',
        password: 'testpassword'
      };

      const createUserStub = sinon.stub(User, 'create').resolves(user);

      req.body = user;

      await createUser(req, res);

      expect(createUserStub).to.have.been.calledOnceWith(req.body);
      expect(statusStub).to.have.been.calledWith(201);
      expect(jsonStub).to.have.been.calledWith({ user });
    });

    it('should handle errors when creating a user', async () => {
      const errorMessage = 'Error creating user';
      const createUserStub = sinon.stub(User, 'create').throws(new Error(errorMessage));

      req.body = {
        email: 'test@email.com',
        name: 'Test User',
        password: 'testpassword'
      };

      await createUser(req, res);

      expect(createUserStub).to.have.been.calledOnceWith(req.body);
      expect(statusStub).to.have.been.calledWith(500);
      expect(jsonStub).to.have.been.calledWith({ error: errorMessage });
    });
  });

  describe('GET /users', () => {
    it('should get all users', async () => {
      const users = [
        { name: 'User 1', email: 'user1@email.com' },
        { name: 'User 2', email: 'user2@email.com' }
      ];

      const findUsersStub = sinon.stub(User, 'find').resolves(users);

      await getUsers(req, res);

      expect(findUsersStub).to.have.been.calledOnce;
      expect(statusStub).to.have.been.calledWith(200);
      expect(jsonStub).to.have.been.calledWith({ users });
    });

    it('should handle errors when getting all users', async () => {
      const errorMessage = 'Error getting users';
      const findUsersStub = sinon.stub(User, 'find').throws(new Error(errorMessage));

      await getUsers(req, res);

      expect(findUsersStub).to.have.been.calledOnce;
      expect(statusStub).to.have.been.calledWith(500);
      expect(jsonStub).to.have.been.calledWith({ error: errorMessage });
    });
  });
  describe('PUT /users/:id', () => {
    it('should update a user by ID', async () => {
      const userId = new mongoose.Types.ObjectId();
      const updatedUser = {
        _id: userId,
        name: 'Updated Name',
        email: 'updated@email.com'
      };
  
      const updateUserStub = sinon.stub(User, 'findByIdAndUpdate').resolves(updatedUser);
  
      req.params = { id: userId }; // Set req.params.id correctly
      req.body = updatedUser;
  
      await updateUser(req, res);
  
      expect(updateUserStub).to.have.been.calledOnceWith(req.params.id, req.body);
      expect(statusStub).to.have.been.calledWith(200);
      expect(jsonStub).to.have.been.calledWith({ user: updatedUser });
    });
  
    it('should handle errors when updating a user by ID', async () => {
      const errorMessage = 'Error updating user';
      const userId = new mongoose.Types.ObjectId();
      const updateUserStub = sinon.stub(User, 'findByIdAndUpdate').throws(new Error(errorMessage));
  
      req.params = { id: userId }; // Set req.params.id correctly
      req.body = {
        name: 'Updated Name',
        email: 'updated@email.com'
      };
  
      await updateUser(req, res);
  
      expect(updateUserStub).to.have.been.calledOnceWith(req.params.id, req.body);
      expect(statusStub).to.have.been.calledWith(500);
      expect(jsonStub).to.have.been.calledWith({ error: errorMessage });
    });
  });
  

  describe('DELETE /users/:id', () => {
    it('should delete a user by ID', async () => {
      const userId = new mongoose.Types.ObjectId();
      const deleteUserStub = sinon.stub(User, 'findByIdAndDelete').resolves({ message: 'User deleted successfully' });
  
      req.params = { id: userId }; // Set req.params.id correctly
  
      await deleteUser(req, res);
  
      expect(deleteUserStub).to.have.been.calledOnceWith(req.params.id);
      expect(statusStub).to.have.been.calledWith(200);
      expect(jsonStub).to.have.been.calledWith({ message: 'User deleted successfully' });
    });
  
    it('should handle errors when deleting a user by ID', async () => {
      const errorMessage = 'Error deleting user';
      const userId = new mongoose.Types.ObjectId();
      const deleteUserStub = sinon.stub(User, 'findByIdAndDelete').throws(new Error(errorMessage));
  
      req.params = { id: userId }; // Set req.params.id correctly
  
      await deleteUser(req, res);
  
      expect(deleteUserStub).to.have.been.calledOnceWith(req.params.id);
      expect(statusStub).to.have.been.calledWith(500);
      expect(jsonStub).to.have.been.calledWith({ error: errorMessage });
    });
  });  
});
