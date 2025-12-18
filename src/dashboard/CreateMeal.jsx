import { useForm } from "react-hook-form";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import Swal from "sweetalert2";

export default function CreateMeal() {
  const { user } = useContext(AuthContext);
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    data.userEmail = user.email;
    data.chefName = user.displayName;
    await axios.post(`${import.meta.env.VITE_API_URL}/api/meals`, data, { withCredentials: true });
    Swal.fire("Success", "Meal created successfully!", "success");
  };

  return (
    <div className="max-w-md mx-auto mt-6 border p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Create Meal</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <input {...register("foodName")} placeholder="Meal Name" className="border p-2 rounded"/>
        <input {...register("foodImage")} placeholder="Image URL" className="border p-2 rounded"/>
        <input type="number" {...register("price")} placeholder="Price" className="border p-2 rounded"/>
        <input type="number" {...register("rating")} placeholder="Rating" className="border p-2 rounded"/>
        <textarea {...register("ingredients")} placeholder="Ingredients (comma separated)" className="border p-2 rounded"/>
        <input {...register("estimatedDeliveryTime")} placeholder="Estimated Delivery Time" className="border p-2 rounded"/>
        <input {...register("chefExperience")} placeholder="Chef Experience" className="border p-2 rounded"/>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
      </form>
    </div>
  );
}
