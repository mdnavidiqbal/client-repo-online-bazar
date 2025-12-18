import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-4">Oops! Page not found.</p>
      <Link to="/" className="px-4 py-2 bg-blue-600 text-white rounded">Go Home</Link>
    </div>
  );
}
