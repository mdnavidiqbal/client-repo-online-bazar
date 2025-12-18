import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import axios from "axios";
import Swal from "sweetalert2";

export default function MyReviews() {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/myreviews?userEmail=${user.email}`, { withCredentials: true })
      .then(res => setReviews(res.data));
  }, []);

  const handleDelete = async (id) => {
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/reviews/${id}`, { withCredentials: true });
    setReviews(prev => prev.filter(r => r._id !== id));
    Swal.fire("Deleted", "Review deleted successfully!", "success");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Reviews</h2>
      <div className="grid gap-4">
        {reviews.map(r => (
          <div key={r._id} className="border p-3 rounded">
            <p><b>Meal:</b> {r.mealName}</p>
            <p><b>Rating:</b> {r.rating}</p>
            <p><b>Comment:</b> {r.comment}</p>
            <button onClick={() => handleDelete(r._id)} className="bg-red-600 text-white px-3 py-1 rounded mt-2">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
