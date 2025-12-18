import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Home() {
  const [meals, setMeals] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    axios.get(`${import.meta.env.VITE_API_URL}/api/meals?page=${page}&limit=10`)
      .then(res => {
        setMeals(res.data.meals || []);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch(err => {
        console.error("Error fetching meals:", err);
        setError("Failed to load meals. Please try again.");
        setMeals([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page]);

  // Loading state
  if (loading) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Delicious Meals</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <p className="mt-4 text-gray-600">Loading meals...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Delicious Meals</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Delicious Meals</h1>
      
      {meals.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No meals available at the moment.</p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meals.map(meal => (
              <div 
                key={meal._id} 
                className="border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow bg-white"
              >
                <div className="relative overflow-hidden rounded-lg h-48">
                  <img 
                    src={meal.foodImage} 
                    alt={meal.foodName} 
                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                    }}
                  />
                </div>
                <h2 className="font-bold text-xl mt-3 text-gray-800">{meal.foodName}</h2>
                <p className="text-gray-600 mt-1">
                  <span className="font-medium">Chef:</span> {meal.chefName}
                </p>
                <div className="flex justify-between items-center mt-3">
                  <p className="text-blue-600 font-bold text-lg">${meal.price}</p>
                  <Link 
                    to={`/meals/${meal._id}`} 
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(prev => prev - 1)}
                className={`px-4 py-2 rounded-lg ${page === 1 
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              >
                Previous
              </button>
              
              {[...Array(totalPages)].map((_, i) => {
                const pageNumber = i + 1;
                // Show only nearby pages for better UX
                if (
                  pageNumber === 1 || 
                  pageNumber === totalPages || 
                  (pageNumber >= page - 1 && pageNumber <= page + 1)
                ) {
                  return (
                    <button
                      key={i}
                      className={`px-4 py-2 rounded-lg ${page === pageNumber 
                        ? "bg-blue-600 text-white" 
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                      onClick={() => setPage(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  );
                }
                return null;
              })}
              
              <button
                disabled={page === totalPages}
                onClick={() => setPage(prev => prev + 1)}
                className={`px-4 py-2 rounded-lg ${page === totalPages 
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}