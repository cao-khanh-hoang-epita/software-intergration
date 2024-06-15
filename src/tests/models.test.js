const chai = require('chai');
const expect = chai.expect;
const mongoose = require('mongoose');
const User = require('../models/user');

// Connect to the in-memory MongoDB server before running tests
before(async () => {
  const mongoURI = 'mongodb://127.0.0.1:27017/testdb';
  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Clean up the database after each test
afterEach(async () => {
  await User.deleteMany({});
});

// Disconnect from MongoDB after all tests are done
after(async () => {
  await mongoose.disconnect();
});

describe('User Model', () => {

  it('should create a new user', async () => {
    const userData = {
      name: 'Test User',
      email: 'testuser@example.com',
    };
    
    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser._id).to.exist;
    expect(savedUser.name).to.equal(userData.name);
    expect(savedUser.email).to.equal(userData.email);
  });

  it('should read a user by email', async () => {
    const userData = {
      name: 'Test User',
      email: 'testuser@example.com',
    };

    const user = new User(userData);
    await user.save();

    const foundUser = await User.findOne({ email: userData.email });

    expect(foundUser).to.exist;
    expect(foundUser.name).to.equal(userData.name);
    expect(foundUser.email).to.equal(userData.email);
  });

  it('should update a user', async () => {
    const userData = {
      name: 'Test User',
      email: 'testuser@example.com',
    };

    const user = new User(userData);
    await user.save();

    const updatedData = {
      name: 'Updated User',
      email: 'updateduser@example.com',
    };

    const updatedUser = await User.findByIdAndUpdate(user._id, updatedData, { new: true });

    expect(updatedUser).to.exist;
    expect(updatedUser.name).to.equal(updatedData.name);
    expect(updatedUser.email).to.equal(updatedData.email);
  });

  it('should delete a user', async () => {
    const userData = {
      name: 'Test User',
      email: 'testuser@example.com',
    };

    const user = new User(userData);
    await user.save();

    await User.findByIdAndDelete(user._id);

    const deletedUser = await User.findById(user._id);

    expect(deletedUser).to.not.exist;
  });
});
