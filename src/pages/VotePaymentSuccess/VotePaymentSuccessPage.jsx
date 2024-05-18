import PaymentSuccess from "../../components/PaymentSuccess/PaymentSuccess";

const VotePaymentSuccessPage = ({ URL, API_KEY }) => {
  return (
    <div className="form-background">

    <PaymentSuccess URL={URL} API_KEY={API_KEY} />
    </div>
  )
};

export default VotePaymentSuccessPage;
