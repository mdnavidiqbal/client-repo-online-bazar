import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import axios from "axios";
import Swal from "sweetalert2";

export default function MyOrders() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/orders?userEmail=${user.email}`, { withCredentials: true })
      .then(res => setOrders(res.data));
  }, []);

  const handlePayment = async (order) => {
    // redirect to Stripe payment page
    Swal.fire("Info", `Implement Stripe payment for order: ${order._id}`, "info");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map(o => (
          <div key={o._id} className="border p-4 rounded-lg">
            <p><b>Meal:</b> {o.mealName}</p>
            <p><b>Price:</b> ${o.price}</p>
            <p><b>Quantity:</b> {o.quantity}</p>
            <p><b>Status:</b> {o.orderStatus}</p>
            <p><b>Delivery:</b> {o.userAddress}</p>
            {o.orderStatus === "accepted" && o.paymentStatus === "pending" && (
              <button onClick={() => handlePayment(o)} className="bg-blue-600 text-white px-3 py-1 rounded mt-2">Pay</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
