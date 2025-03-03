require("dotenv").config();
const process = require('process')

if (!process.env ||
    !process.env.STRIPE_PUBLISHABLE_KEY ||
    !process.env.STRIPE_SECRET_KEY ||
    !process.env.CURRENCY ||
    !process.env.PAYMENT_METTHOD_TYPE ||
    !process.env.PAYMENT_METTHOD_TYPE.length
) {
    console.error("Missing environment variables")
    process.exit(1)
}

const fastify = require("fastify")({ logger: true });
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

fastify.get("/publishable-key", () => {
  return { publishable_key: process.env.STRIPE_PUBLISHABLE_KEY };
});

fastify.post("/create-payment", async (request, reply) => {
  const { amount } = request.body;
  if (!amount) {
    return reply.code(400).send({ error: "Amount is required" });
  }
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: process.env.CURRENCY,
    payment_method_types: process.env.PAYMENT_METTHOD_TYPE,
  });
  return { client_secret: paymentIntent.client_secret };
});

const start = async () => {
  const port = process.env.PORT_SERVER ? process.env.PORT_SERVER : 8080
  try {
    await fastify.listen({port});
    console.log(`Server listening on port ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(2);
  }
};

start();
