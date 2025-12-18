import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { app } from "../firebase/firebase.config";
import axios from "axios";
import Swal from "sweetalert2";

const auth = getAuth(app);

export default function Register() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      // Firebase registration
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      await updateProfile(userCredential.user, { displayName: data.name, photoURL: data.profileImage });

      // Save user to backend
      await axios.post(`${import.meta.env.VITE_API_URL}/api/users/register`, {
        name: data.name,
        email: data.email,
        profileImage: data.profileImage,
        address: data.address,
        role: "user",
        status: "active"
      }, { withCredentials: true });

      Swal.fire("Success", "Registration successful!", "success");
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      Swal.fire("Error", err.message, "error");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 border p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <input {...register("name", { required: true })} placeholder="Full Name" className="border p-2 rounded" />
        {errors.name && <span className="text-red-500">Name is required</span>}

        <input {...register("email", { required: true })} placeholder="Email" className="border p-2 rounded" />
        {errors.email && <span className="text-red-500">Email is required</span>}

        <input {...register("profileImage")} placeholder="Profile Image URL" className="border p-2 rounded" />

        <input {...register("address", { required: true })} placeholder="Address" className="border p-2 rounded" />
        {errors.address && <span className="text-red-500">Address is required</span>}

        <input type="password" {...register("password", { required: true, minLength: 6 })} placeholder="Password" className="border p-2 rounded" />
        {errors.password && <span className="text-red-500">Password must be at least 6 characters</span>}

        <input type="password" {...register("confirmPassword", { validate: value => value === password })} placeholder="Confirm Password" className="border p-2 rounded" />
        {errors.confirmPassword && <span className="text-red-500">Passwords must match</span>}

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-2">Register</button>
      </form>
    </div>
  );
}
