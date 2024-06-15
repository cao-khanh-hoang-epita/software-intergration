const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const rewire = require('rewire');
const mongoose = require('mongoose');

const User = require('../models/user'); // Assuming you have a User model in a separate file

describe('User Service', () => {
  let userService;
  let user;
  let req;
  let res;
  let statusStub;
  let jsonStub;
  let findOneStub;
  let createStub;
  let findByIdAndDeleteStub;

  beforeEach(async () => {
    user = {
      email: 'test@email.com',
      name: 'Test User',
      password: 'testpassword',
    };

    statusStub = sinon.stub();
    jsonStub = sinon.stub();

    res = {
      status: statusStub.returnsThis(), // Ensure it returns `res`
      json: jsonStub,
    };

    req = {
      body: user,
      params: { id: new mongoose.Types.ObjectId() },
    };

    findOneStub = sinon.stub(User, 'findOne');
    createStub = sinon.stub(User, 'create');
    findByIdAndDeleteStub = sinon.stub(User, 'findByIdAndDelete');

    userService = rewire('../services/user.service');

    // Insert the user into the database before each test
    await User.create(user);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('Signup', () => {
    it('should create a new user', async () => {
      createStub.resolves(user);

      await userService.signup(req, res);

      expect(createStub).to.have.been.calledWith(sinon.match(user));
      expect(statusStub).to.have.been.calledWith(201);
      expect(jsonStub).to.have.been.calledWith({ user });
    });

    it('should return an error if there is an error creating a user', async () => {
      const errorMessage = 'Error creating user';
      createStub.throws(new Error(errorMessage));

      await userService.signup(req, res);

      expect(createStub).to.have.been.calledWith(sinon.match(user));
      expect(statusStub).to.have.been.calledWith(500);
      expect(jsonStub).to.have.been.calledWith({ error: errorMessage });
    });
  });

  describe('Login', () => {
    it('should login a user', async () => {
      findOneStub.resolves(user);

      await userService.login(req, res);

      expect(findOneStub).to.have.been.calledWith({ email: user.email, password: user.password });
      expect(statusStub).to.have.been.calledWith(200);
      expect(jsonStub).to.have.been.calledWith({ user });
    });

    it('should return an error if there is an error logging in a user', async () => {
      const errorMessage = 'Error logging in user';
      findOneStub.throws(new Error(errorMessage));

      await userService.login(req, res);

      expect(findOneStub).to.have.been.calledWith({ email: user.email, password: user.password });
      expect(statusStub).to.have.been.calledWith(500);
      expect(jsonStub).to.have.been.calledWith({ error: errorMessage });
    });
  });

  describe('GetUserById', () => {
    it('should get a user by id', async () => {
      findOneStub.resolves(user);

      await userService.getUserById(req, res);

      expect(findOneStub).to.have.been.calledWith({ _id: req.params.id });
      expect(statusStub).to.have.been.calledWith(200);
      expect(jsonStub).to.have.been.calledWith({ user });
    });

    it('should return an error if there is an error getting a user by id', async () => {
      const errorMessage = 'Error getting user by id';
      findOneStub.throws(new Error(errorMessage));

      await userService.getUserById(req, res);

      expect(findOneStub).to.have.been.calledWith({ _id: req.params.id });
      expect(statusStub).to.have.been.calledWith(500);
      expect(jsonStub).to.have.been.calledWith({ error: errorMessage });
    });
  });

  describe('DeleteUserById', () => {
    it('should delete a user by id', async () => {
      findByIdAndDeleteStub.resolves(user); // Ensure it resolves to a valid user

      await userService.deleteUserById(req, res);

      expect(findByIdAndDeleteStub).to.have.been.calledWith(req.params.id);
      expect(statusStub).to.have.been.calledWith(200);
      expect(jsonStub).to.have.been.calledWith({ message: 'User deleted successfully' });
    });

    it('should return an error if there is an error deleting a user by id', async () => {
      const errorMessage = 'Error deleting user by id';
      findByIdAndDeleteStub.throws(new Error(errorMessage));

      await userService.deleteUserById(req, res);

      expect(findByIdAndDeleteStub).to.have.been.calledWith(req.params.id);
      expect(statusStub).to.have.been.calledWith(500);
      expect(jsonStub).to.have.been.calledWith({ error: errorMessage });
    });
  });
});
