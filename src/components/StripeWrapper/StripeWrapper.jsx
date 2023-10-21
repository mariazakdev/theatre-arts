import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromises = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
const StripeWrapper = ( { children}) =>{
    return <Elements stripe={stripePromises} > { children} </Elements>
}

export default StripeWrapper;