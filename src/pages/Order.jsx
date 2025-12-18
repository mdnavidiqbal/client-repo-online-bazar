import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import Swal from "sweetalert2";

const stripePromise = loadStripe("pk_test_xxxxx");

export default function OrderPage({ meal }) {
  const { user } = useContext(AuthContext);
  const [quantity, setQuantity] = useState(1);

  const totalPrice = meal.price * quantity;

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm meal={meal} user={user} totalPrice={totalPrice} />
    </Elements>
  );
}

function CheckoutForm({ meal, user, totalPrice }) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/payments/create-payment-intent`, { totalPrice }, { withCredentials: true });
    const clientSecret = data.clientSecret;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement) }
    });

    if (result.error) {
      Swal.fire("Error", result.error.message, "error");
    } else {
      if (result.paymentIntent.status === "succeeded") {
        Swal.fire("Success", "Payment successful!", "success");
        // Update order paymentStatus in server
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">{meal.foodName}</h2>
      <p>Price: ${meal.price}</p>
      <input type="number" value={1} min={1} onChange={e => setQuantity(e.target.value)} className="border p-2 my-2 w-full" />
      <CardElement className="border p-2 rounded mb-4" />
      <button className="bg-blue-600 text-white px-4 py-2 rounded">Pay ${meal.price * 1}</button>
    </form>
  );
}
