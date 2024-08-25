import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';


declare global {
  var signin: () => Promise<string[]>;
}


let mongo: any;

// first run before all the test
// its a hook function
beforeAll(async () => {
  process.env.JWT_KEY = 'asdfasdf'; // we have to add becouse we cant access env from kubernetes 
  // process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});


// hook func
// mean -> run before each of the test, goal is to reset database
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});


// hook func
// after all the test
// goal -> stop mongo server
afterAll(async () => {
  if (mongo) { // same mongo that we connect earlier
    await mongo.stop();
  }
  await mongoose.connection.close();
});


// here we make a global fuction to signup
global.signin = async () => {
  const email = 'test@test.com';
  const password = 'password';

  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email,
      password,
    })
    .expect(201);

  const cookie = response.get('Set-Cookie');

  return cookie;
};
