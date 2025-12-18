import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import axios from "axios";
import Swal from "sweetalert2";

export default function Favorites() {
  const { user } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/favorites`, { withCredentials: true })
      .then(res => setFavorites(res.data));
  }, []);

  const handleDelete = async (mealId) => {
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/favorites/${mealId}`, { withCredentials: true });
    setFavorites(prev => prev.filter(f => f.mealId !== mealId));
    Swal.fire("Deleted", "Meal removed from favorites", "success");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Favorite Meals</h1>
      <table className="table-auto w-full border">
        <thead>
          <tr>
            <th className="border p-2">Meal Name</th>
            <th className="border p-2">Chef</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {favorites.map(fav => (
            <tr key={fav._id}>
              <td className="border p-2">{fav.mealName}</td>
              <td className="border p-2">{fav.chefName}</td>
              <td className="border p-2">${fav.price}</td>
              <td className="border p-2">
                <button className="bg-red-600 text-white px-2 py-1 rounded" onClick={() => handleDelete(fav.mealId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
