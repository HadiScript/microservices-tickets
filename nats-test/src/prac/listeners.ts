import nats, { Message, Stan } from 'node-nats-streaming';
import { randomBytes } from 'crypto';


console.clear()

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: "http://localhost:4222"
});

// after connect stan 
// emit an connect event
stan.on('connect', () => {
  console.log('listener connected to NATS');




  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable() // by both (below one), we will sent all event when listener is ready 
    .setDurableName('accounting-service');

  // creating subscription
  // to the chanel from where we want to get data
  const subscription = stan.subscribe('ticket:created', 'queue-group-name', options)
  // by the queue group we will be able to sent event in any one listen if we have many listener of the same chanel
  // we can add other option also into subscriptions
  // ack knowledge manual-> when message rec we manualy say we collect that data 

  // getting data from that chanel,
  // type Message comming from Nats
  subscription.on('message', (msg: Message) => {
    // console.log('rec') // msg is raw data, JSON or Buffer
    // msg gives us many functionality like getData, getSequence

    const data = msg.getData();
    if (typeof data === 'string') { console.log(`Rec Events# ${msg.getSequence()}, with data: ${data}`) }


    msg.ack();
  })

  stan.on('close', () => {
    console.log('Am going to close !!');
    process.exit()
  })


})


process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());


// new TicketCreatedListener(stan).listen();





