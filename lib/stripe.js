import Stripe from "stripe";

// Khởi tạo Stripe SDK phía server (thanh toán checkout)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default stripe;
