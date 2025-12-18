import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Meals() {
  const [meals, setMeals] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/meals?page=${page}&limit=10`)
      .then(res => {
        setMeals(res.data.meals);
        setTotalPages(res.data.totalPages);
      });
  }, [page]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Meals</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {meals.map(meal => (
          <div key={meal._id} className="border p-4 rounded-lg">
            <img src={meal.foodImage} alt={meal.foodName} className="h-40 w-full object-cover rounded" />
            <h2 className="font-semibold mt-2">{meal.foodName}</h2>
            <p>Chef: {meal.chefName}</p>
            <p>Price: ${meal.price}</p>
            <Link to={`/meals/${meal._id}`} className="text-blue-600 mt-2 inline-block">See Details</Link>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6 gap-2">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`px-3 py-1 rounded ${page === i+1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setPage(i+1)}
          >
            {i+1}
          </button>
        ))}
      </div>
    </div>
  );
}
