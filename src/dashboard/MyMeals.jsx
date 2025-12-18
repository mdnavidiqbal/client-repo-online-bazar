import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import axios from "axios";
import Swal from "sweetalert2";

export default function MyMeals() {
  const { user } = useContext(AuthContext);
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/meals?userEmail=${user.email}`, { withCredentials: true })
      .then(res => setMeals(res.data));
  }, []);

  const handleDelete = async (id) => {
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/meals/${id}`, { withCredentials: true });
    setMeals(prev => prev.filter(m => m._id !== id));
    Swal.fire("Deleted", "Meal deleted successfully!", "success");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Meals</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {meals.map(m => (
          <div key={m._id} className="border p-4 rounded">
            <img src={m.foodImage} alt={m.foodName} className="h-40 w-full object-cover rounded"/>
            <p><b>Name:</b> {m.foodName}</p>
            <p><b>Price:</b> ${m.price}</p>
            <p><b>Rating:</b> {m.rating}</p>
            <button onClick={() => handleDelete(m._id)} className="bg-red-600 text-white px-3 py-1 rounded mt-2">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
