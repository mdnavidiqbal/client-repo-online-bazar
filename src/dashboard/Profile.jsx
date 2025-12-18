import { useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import axios from "axios";
import Swal from "sweetalert2";

export default function Profile() {
  const { user, refetchUser } = useContext(AuthContext);

  const handleRoleRequest = async (roleType) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/requests`, {
        userName: user.displayName || user.email,
        userEmail: user.email,
        requestType: roleType,
        requestStatus: "pending"
      }, { withCredentials: true });

      Swal.fire("Success", `Request for ${roleType} sent successfully!`, "success");
    } catch (err) {
      console.log(err);
      Swal.fire("Error", "Something went wrong!", "error");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6 border p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      <img src={user.photoURL || "https://i.ibb.co/sample-user.jpg"} alt="profile" className="w-24 h-24 rounded-full mb-4" />
      <p><b>Name:</b> {user.displayName}</p>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Role:</b> {user.role || "user"}</p>
      <p><b>Status:</b> {user.status || "active"}</p>
      {!user.role || user.role === "user" ? (
        <button onClick={() => handleRoleRequest("chef")} className="mt-3 bg-blue-600 text-white px-4 py-2 rounded mr-2">Be a Chef</button>
      ) : null}
      {!user.role || user.role !== "admin" ? (
        <button onClick={() => handleRoleRequest("admin")} className="mt-3 bg-green-600 text-white px-4 py-2 rounded">Be an Admin</button>
      ) : null}
    </div>
  );
}
