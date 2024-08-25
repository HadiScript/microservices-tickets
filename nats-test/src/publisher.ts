import nats from 'node-nats-streaming';
import { Publisher } from './events/base-publisher';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';


console.clear();

// client but convention called stan
// arguments
const stan = nats?.connect('ticketing', 'abc', {
  url: "http://localhost:4222"
});


// after connect stan 
// emit an connect event
stan.on('connect', async () => {
  // called this after successfully connected
  console.log('Publisher connected to NATS');


  const publisher = new TicketCreatedPublisher(stan)
  try {
    await publisher.publish({
      id: '123',
      title: 'concert',
      price: 20,
    });
  } catch (err) {
    console.error(err);
  }





  // const data = JSON.stringify({
  //   id: '123',
  //   title: 'concert',
  //   price: 20,
  // });


  // // // data refer as message in NAT's world
  // // ticket:created is a channel 
  // // data 
  // // then console.
  // stan.publish('ticket:created', data, () => {
  //   console.log('Event published');
  // });



});

