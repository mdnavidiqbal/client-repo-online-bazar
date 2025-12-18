import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function ManageRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/requests`, { withCredentials: true })
      .then(res => setRequests(res.data));
  }, []);

  const handleAction = async (id, action) => {
    await axios.patch(`${import.meta.env.VITE_API_URL}/api/requests/${id}`, { action }, { withCredentials: true });
    setRequests(prev => prev.map(r => r._id === id ? { ...r, requestStatus: action } : r));
    Swal.fire("Success", `Request ${action}`, "success");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Requests</h2>
      <table className="table-auto w-full border">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(r => (
            <tr key={r._id}>
              <td className="border p-2">{r.userName}</td>
              <td className="border p-2">{r.userEmail}</td>
              <td className="border p-2">{r.requestType}</td>
              <td className="border p-2">{r.requestStatus}</td>
              <td className="border p-2 flex gap-2">
                {r.requestStatus === "pending" && (
                  <>
                    <button onClick={() => handleAction(r._id, "approved")} className="bg-green-600 text-white px-2 py-1 rounded">Approve</button>
                    <button onClick={() => handleAction(r._id, "rejected")} className="bg-red-600 text-white px-2 py-1 rounded">Reject</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
