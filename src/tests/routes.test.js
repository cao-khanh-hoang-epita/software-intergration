const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const supertest = require('supertest');
const mongoose = require('mongoose');
const rewire = require('rewire');

const app = rewire('../app'); // Ensure this points to your Express app
const User = require('../models/user'); // Assuming you have a User model in a separate file

describe('User Routes', () => {
  let request;
  let user;
  let userId;

  before(async () => {
    request = supertest(app);

    user = new User({
      email: 'test@email.com',
      name: 'Test User',
      password: 'testpassword',
    });

    await User.deleteMany({}); // Clean up the database before running tests
    const savedUser = await user.save();
    userId = savedUser._id;
  });

  after(async () => {
    await mongoose.connection.close();
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const newUser = {
        email: 'newuser@example.com',
        name: 'New User',
        password: 'newpassword',
      };

      const res = await request
        .post('/users')
        .send(newUser)
        .expect(201);

      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('email', newUser.email);
      expect(res.body).to.have.property('name', newUser.name);
    });

    it('should return an error if user creation fails', async () => {
      const newUser = {
        email: 'newuser@example.com',
        name: 'New User',
        password: 'newpassword',
      };

      // Simulate an error by making the email unique
      await new User(newUser).save();

      const res = await request
        .post('/users')
        .send(newUser)
        .expect(500);

      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('error');
    });
  });

  describe('GET /users', () => {
    it('should get all users', async () => {
      const res = await request
        .get('/users')
        .expect(200);

      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.greaterThan(0);
    });
  });

  describe('PUT /users/:id', () => {
    it('should update a user', async () => {
      const updatedUser = {
        email: 'updateduser@example.com',
        name: 'Updated User',
      };

      const res = await request
        .put(`/users/${userId}`)
        .send(updatedUser)
        .expect(200);

      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('email', updatedUser.email);
      expect(res.body).to.have.property('name', updatedUser.name);
    });

    it('should return an error if update fails', async () => {
      const updatedUser = {
        email: 'updateduser@example.com',
        name: 'Updated User',
      };

      const invalidId = new mongoose.Types.ObjectId();

      const res = await request
        .put(`/users/${invalidId}`)
        .send(updatedUser)
        .expect(500);

      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('error');
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete a user', async () => {
      const res = await request
        .delete(`/users/${userId}`)
        .expect(200);

      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('message', 'User successfully deleted');
    });

    it('should return an error if deletion fails', async () => {
      const invalidId = new mongoose.Types.ObjectId();

      const res = await request
        .delete(`/users/${invalidId}`)
        .expect(500);

      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('error');
    });
  });
});
