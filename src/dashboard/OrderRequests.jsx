import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import axios from "axios";
import Swal from "sweetalert2";

export default function OrderRequests() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/orders?chefEmail=${user.email}`, { withCredentials: true })
      .then(res => setOrders(res.data));
  }, []);

  const updateStatus = async (id, status) => {
    await axios.patch(`${import.meta.env.VITE_API_URL}/api/orders/${id}`, { status }, { withCredentials: true });
    setOrders(prev => prev.map(o => o._id === id ? { ...o, orderStatus: status } : o));
    Swal.fire("Success", `Order ${status}`, "success");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Order Requests</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {orders.map(o => (
          <div key={o._id} className="border p-4 rounded">
            <p><b>Meal:</b> {o.mealName}</p>
            <p><b>Quantity:</b> {o.quantity}</p>
            <p><b>Status:</b> {o.orderStatus}</p>
            <div className="flex gap-2 mt-2">
              <button onClick={() => updateStatus(o._id, "cancelled")} disabled={o.orderStatus !== "pending"} className="bg-red-600 text-white px-2 py-1 rounded">Cancel</button>
              <button onClick={() => updateStatus(o._id, "accepted")} disabled={o.orderStatus !== "pending"} className="bg-blue-600 text-white px-2 py-1 rounded">Accept</button>
              <button onClick={() => updateStatus(o._id, "delivered")} disabled={o.orderStatus !== "accepted"} className="bg-green-600 text-white px-2 py-1 rounded">Deliver</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
