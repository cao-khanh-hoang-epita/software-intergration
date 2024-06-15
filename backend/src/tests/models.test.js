const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

const User = require('../models/user');

describe('User Model', () => {
  let createUserStub;

  beforeEach(() => {
    createUserStub = sinon.stub(User, 'create');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('Create User', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com'
      };

      // Stub the create method to resolve with the userData
      createUserStub.resolves(userData);

      const newUser = await User.create(userData);

      expect(createUserStub.calledOnce).to.be.true;
      expect(createUserStub.calledWith(userData)).to.be.true;
      expect(newUser.name).to.equal(userData.name);
      expect(newUser.email).to.equal(userData.email);
    });

    it('should handle errors when creating a user', async () => {
      const errorMessage = 'Error creating user';
      const userData = {
        name: 'Test User',
        email: 'test@example.com'
      };

      // Stub the create method to throw an error
      createUserStub.rejects(new Error(errorMessage));

      try {
        await User.create(userData);
        // Fail the test if createUser did not throw an error
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).to.equal(errorMessage);
        expect(createUserStub.calledOnce).to.be.true;
        expect(createUserStub.calledWith(userData)).to.be.true;
      }
    });
  });
});
