import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/users`, { withCredentials: true })
      .then(res => setUsers(res.data));
  }, []);

  const makeFraud = async (email) => {
    await axios.patch(`${import.meta.env.VITE_API_URL}/api/users/${email}`, { status: "fraud" }, { withCredentials: true });
    setUsers(prev => prev.map(u => u.email === email ? { ...u, status: "fraud" } : u));
    Swal.fire("Success", "User marked as fraud", "success");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
      <table className="table-auto w-full border">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td className="border p-2">{u.name}</td>
              <td className="border p-2">{u.email}</td>
              <td className="border p-2">{u.role}</td>
              <td className="border p-2">{u.status}</td>
              <td className="border p-2">
                {u.role !== "admin" && u.status !== "fraud" && (
                  <button className="bg-red-600 text-white px-2 py-1 rounded" onClick={() => makeFraud(u.email)}>Make Fraud</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
