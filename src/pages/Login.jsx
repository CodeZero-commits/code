import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../services/ApiService";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await ApiService.login({
        usuario: username,
        password: password,
      });

      if (res.success) {
        // Guardar token y usuario en localStorage
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));

        navigate("/dashboard");
      } else {
        setError(res.error || "Error en inicio de sesión");
      }
    } catch (err) {
      console.error("❌ Error login:", err);
      setError("Error en el servidor");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-10 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Iniciar Sesión
        </h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-300 mb-2">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-full hover:shadow-lg transition-all duration-200"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
