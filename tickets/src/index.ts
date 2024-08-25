import mongoose from 'mongoose';

import { app } from './app';
import { natsWrapper } from './nats-wrapper';

const startUp = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('Mongo URI must be defined');
  }
  try {
    await natsWrapper.connect('ticketing', 'asdasdasdasd', 'http://nats-srv:4222');
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());


    await mongoose.connect(process.env.MONGO_URI)
    console.log('connected')
  } catch (error) {
    console.log(error)
  }
  app.listen(3000, () => {
    console.log('Listening on port 3000!!!!!!!!');
  });
}

startUp();


