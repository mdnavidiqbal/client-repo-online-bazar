import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";

export default function Statistics() {
  const [payments, setPayments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState(0);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/admin/statistics`, { withCredentials: true })
      .then(res => {
        setPayments(res.data.payments);
        setOrders(res.data.orders);
        setUsers(res.data.users);
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Platform Statistics</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <BarChart width={500} height={300} data={payments}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month"/>
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#8884d8" />
        </BarChart>

        <PieChart width={400} height={300}>
          <Pie data={orders} dataKey="value" nameKey="status" cx="50%" cy="50%" outerRadius={80} fill="#82ca9d" label>
            {orders.map((entry, index) => <Cell key={index} fill={["#0088FE","#00C49F","#FFBB28"][index % 3]} />)}
          </Pie>
        </PieChart>
      </div>
      <p className="mt-6 font-semibold">Total Users: {users}</p>
    </div>
  );
}
