import amqp from "amqplib";

export default class Queue {
  async publish(exchange: string, data: any) {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    channel.assertExchange(exchange, "direct", { durable: true });
    channel.publish(exchange, "", Buffer.from(JSON.stringify(data)));
  }

  async consume(exchange: string, queue: string, callback: Function) {
    console.log("PAYMENT - Consuming queue...");
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    channel.assertQueue(queue, { durable: true });
    channel.assertExchange(exchange, "direct", { durable: true });
    channel.bindQueue(queue, exchange, "");
    channel.consume(queue, async (msg: any) => {
      const input = JSON.parse(msg.content.toString());
      try {
        await callback(input);
        channel.ack(msg);
      } catch (e) {
        console.log(e);
      }
    });
    console.log("Queue consumed!");
  }
}
