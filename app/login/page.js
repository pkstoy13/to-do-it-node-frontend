"use client";
import { useEffect, useState } from "react";
import axios from "../../utils/axios"; // Adjust the import path if necessary
import Link from "next/link";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/todos");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/auth/login", {
        username,
        password,
      });

      // Log the entire response to confirm the structure
      console.log("Response from backend:", response.data);

      // Correctly extract the token from the response
      const token = response.data.token; // This should be correct based on your backend response
      console.log("Extracted token:", token);

      // Check if the token is valid before storing
      if (token) {
        localStorage.setItem("token", token); // Store the token in local storage
        console.log(
          "Token stored in localStorage:",
          localStorage.getItem("token")
        ); // Log to confirm it is stored
        router.push("/todos"); // Redirect to todos page
      } else {
        console.error("Token is undefined or null");
        setError("Login failed: token is undefined");
      }
    } catch (err) {
      // Handle errors appropriately
      setError(err.response?.data.error || "Login failed");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="flex flex-col justify-around items-center">
      <h1 className="text-3xl p-2">Login</h1>
      <form onSubmit={handleLogin} className="space-y-2">
        <div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Username"
            className="p-2 pr-24  rounded-md bg-zinc-200"
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
            className="p-2 pr-24 rounded-md bg-zinc-200"
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div className="flex justify-between">
          <button type="submit" className="hover:bg-slate-200 p-2">
            Login
          </button>
          <Link href="/" className="hover:bg-slate-200 p-2">
            Back
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
