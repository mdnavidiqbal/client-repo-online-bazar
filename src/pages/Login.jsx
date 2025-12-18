import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../firebase/firebase.config";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import Swal from "sweetalert2";

const auth = getAuth(app);

export default function Login() {
  const { setUser } = useContext(AuthContext);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const onSubmit = async (data) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      setUser(userCredential.user);
      Swal.fire("Success", "Login successful!", "success");
      navigate(from, { replace: true });
    } catch (err) {
      console.log(err);
      Swal.fire("Error", err.message, "error");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 border p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <input {...register("email", { required: true })} placeholder="Email" className="border p-2 rounded" />
        {errors.email && <span className="text-red-500">Email is required</span>}

        <input type="password" {...register("password", { required: true })} placeholder="Password" className="border p-2 rounded" />
        {errors.password && <span className="text-red-500">Password is required</span>}

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-2">Login</button>
      </form>
    </div>
  );
}
