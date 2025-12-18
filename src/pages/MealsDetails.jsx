import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../contexts/AuthProvider";
import Swal from "sweetalert2";

export default function MealDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [meal, setMeal] = useState({});
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/meals/${id}`)
      .then(res => setMeal(res.data));

    axios.get(`${import.meta.env.VITE_API_URL}/api/reviews/${id}`)
      .then(res => setReviews(res.data));
  }, [id]);

  const handleSubmit = async () => {
    if (!user) return;
    const data = {
      foodId: id,
      reviewerName: user.displayName || user.email,
      reviewerImage: user.photoURL || "https://i.ibb.co/sample-user.jpg",
      rating,
      comment
    };
    await axios.post(`${import.meta.env.VITE_API_URL}/api/reviews`, data, { withCredentials: true });
    Swal.fire("Success", "Review submitted successfully!", "success");
    setReviews(prev => [...prev, data]);
    setComment("");
    setRating(5);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{meal.foodName}</h1>
      <img src={meal.foodImage} alt={meal.foodName} className="w-full h-60 object-cover mt-4 rounded" />
      <p className="mt-2">Chef: {meal.chefName}</p>
      <p>Price: ${meal.price}</p>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Reviews</h2>
        {reviews.map((rev, i) => (
          <div key={i} className="border p-2 rounded my-2">
            <p><b>{rev.reviewerName}</b> ({rev.rating}⭐)</p>
            <p>{rev.comment}</p>
          </div>
        ))}

        <div className="mt-4">
          <textarea
            placeholder="Your review"
            className="border p-2 w-full"
            value={comment}
            onChange={e => setComment(e.target.value)}
          ></textarea>
          <input type="number" min="1" max="5" value={rating} onChange={e => setRating(e.target.value)} className="border p-2 mt-2 w-20" />
          <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded ml-2">Submit</button>
        </div>
      </div>
    </div>
  );
}
