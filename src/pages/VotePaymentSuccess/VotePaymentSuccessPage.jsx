import PaymentSuccess2 from "../../components/PaymentSuccess/PaymentSuccessSingleVote";

const VotePaymentSuccessPage2 = ({ URL, API_KEY }) => {
  return (
    <div className="form-background">

    <PaymentSuccess2 URL={URL} API_KEY={API_KEY} />
    </div>
  )
};

export default VotePaymentSuccessPage2;
