import { useState } from "react";
import { api, setSession } from "../api";

export default function Login({ onLogin }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api(`/auth/${mode}`, {
        method: "POST",
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Algo salió mal");
      setSession(data.token, data.username);
      onLogin();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const input =
    "w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8 space-y-5"
      >
        <div>
          <h1 className="text-2xl font-bold">
            Invoice<span className="text-blue-600">App</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {mode === "login" ? "Inicia sesión para continuar" : "Crea tu cuenta"}
          </p>
        </div>

        <div>
          <label className="block text-sm mb-1">Usuario</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={input}
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={input}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? "…" : mode === "login" ? "Entrar" : "Registrarme"}
        </button>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "register" : "login");
            setError("");
          }}
          className="w-full text-sm text-gray-500 hover:text-gray-700"
        >
          {mode === "login"
            ? "¿No tienes cuenta? Crear una"
            : "¿Ya tienes cuenta? Inicia sesión"}
        </button>
      </form>
    </div>
  );
}
