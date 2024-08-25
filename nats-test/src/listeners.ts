import nats, { Message, Stan } from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';

// we can set listen like this to any service who want to listen some publisher
// so we can create class


console.clear()

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: "http://localhost:4222"
});

// after connect stan 
// emit an connect event
stan.on('connect', () => {
  console.log('listener connected to NATS');


  new TicketCreatedListener(stan).listen();

  stan.on('close', () => {
    console.log('Am going to close !!');
    process.exit()
  })


})


process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());


// new TicketCreatedListener(stan).listen();





