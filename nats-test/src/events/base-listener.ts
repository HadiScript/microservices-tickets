import { Stan, Message } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects,
  data: any
}


export abstract class Listener<T extends Event>{
  abstract subject: T['subject']
  abstract queueGroupName: string;
  abstract onMessage(data: T['data'], msg: Message): void;
  private client: Stan;
  protected ackWait = 5 * 1000;


  constructor(client: Stan) {
    this.client = client;
  }


  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable() // get all messages
      .setManualAckMode(true)
      .setAckWait(this.ackWait) // ack wait upto 5sec
      .setDurableName(this.queueGroupName); // getting one event to each listen
  }


  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on('message', (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === 'string'
      ? JSON.parse(data)
      : JSON.parse(data.toString('utf8'));
  }
};