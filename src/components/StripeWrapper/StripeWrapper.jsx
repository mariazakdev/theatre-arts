import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY).catch(error => {
    console.error("Stripe initialization error:", error);
  });
  
  const StripeWrapper = ( { children}) =>{
    return <Elements stripe={stripePromise} > { children} </Elements>
}

export default StripeWrapper;