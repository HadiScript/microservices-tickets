import nats from 'node-nats-streaming';


console.clear();

// client but convention called stan
// arguments
const stan = nats?.connect('ticketing', 'abc', {
  url: "http://localhost:4222"
});


// after connect stan 
// emit an connect event
stan.on('connect', () => {
  // called this after successfully connected
  console.log('Publisher connected to NATS');




  const data = JSON.stringify({
    id: '123',
    title: 'concert',
    price: 20,
  });


  // // data refer as message in NAT's world
  // ticket:created is a channel 
  // data 
  // then console.
  stan.publish('ticket:created', data, () => {
    console.log('Event published');
  });



});

