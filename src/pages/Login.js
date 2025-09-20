import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PathologyLogin = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // new state
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Login failed");
      } else {
        setMessage(`Welcome ${data.name}! Login successful.`);

        if (rememberMe) {
          localStorage.setItem("userEmail", data.email);
          localStorage.setItem("userName", data.username);
        } else {
          sessionStorage.setItem("userEmail", data.email);
          sessionStorage.setItem("userName", data.username);
        }

        setTimeout(() => navigate("/patient-form"), 3000);
      }
    } catch (err) {
      setMessage("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[var(--background-color)] text-[var(--text-primary)]"
      style={{
        "--brand-color": "#008080",
        "--background-color": "#f0f2f5",
        "--card-background-color": "#ffffff",
        "--text-primary": "#1a202c",
        "--text-secondary": "#4a5568",
        "--input-background": "#ffffff",
        "--input-placeholder": "#a0aec0",
        "--border-color": "#D3D3D3",
        fontFamily: "'Public Sans', sans-serif",
      }}
    >
      {/* Logo and Title */}
      <div className="absolute top-8 left-8">
        <a className="flex items-center gap-3 text-[var(--text-primary)]" href="#">
          {/* svg logo here */}
          <h1 className="text-xl font-bold tracking-tight">Pathology Services Co.</h1>
        </a>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md space-y-8 rounded-xl bg-[var(--card-background-color)] p-10 shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-[var(--text-primary)]">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-[var(--text-secondary)]">
            Securely log in to your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4 rounded-md">
            <div>
              <label className="sr-only" htmlFor="login">
                Username or Email address
              </label>
              <input
                id="login"
                name="login"
                type="text"
                autoComplete="username"
                required
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="Enter User Name or Email address"
                className="relative block w-full appearance-none rounded-md border border-[var(--border-color)] bg-[var(--input-background)] px-3 py-3 text-[var(--text-primary)] placeholder-[var(--input-placeholder)] focus:z-10 focus:border-[var(--brand-color)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-color)] sm:text-sm"
              />
            </div>
            <div className="relative">
              <label className="sr-only" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"} // dynamic type here
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="relative block w-full appearance-none rounded-md border border-[var(--border-color)] bg-[var(--input-background)] px-3 py-3 text-[var(--text-primary)] placeholder-[var(--input-placeholder)] focus:pr-10 focus:border-[var(--brand-color)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-color)] sm:text-sm"
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg className="h-5 w-5" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="none">
                    <path fill="#535358" d="M22 16a1 1 0 10-2 0h2zm-6 4a1 1 0 100 2v-2zm-6-4a1 1 0 102 0h-2zm6-4a1 1 0 100-2v2zm-2.776 11.68a1 1 0 00-.448 1.95l.448-1.95zm-7.9-2.007a1 1 0 001.351-1.475l-1.35 1.475zM19.242 8.436a1 1 0 00.518-1.932l-.518 1.932zm7.358 1.822a1 1 0 10-1.34 1.484l1.34-1.484zM28 16c0 .464-.243 1.203-.853 2.116-.593.888-1.471 1.845-2.578 2.727C22.351 22.611 19.314 24 16 24v2c3.866 0 7.329-1.611 9.816-3.593 1.246-.993 2.271-2.099 2.994-3.18C29.515 18.172 30 17.037 30 16h-2zM4 16c0-.464.243-1.203.853-2.116.593-.888 1.471-1.845 2.578-2.727C9.649 9.389 12.686 8 16 8V6c-3.866 0-7.329 1.611-9.816 3.593-1.246.993-2.271 2.098-2.994 3.18C2.485 13.828 2 14.963 2 16h2zm16 0a4 4 0 01-4 4v2a6 6 0 006-6h-2zm-8 0a4 4 0 014-4v-2a6 6 0 00-6 6h2zm4 8c-.952 0-1.881-.114-2.776-.32l-.448 1.95c1.031.236 2.111.37 3.224.37v-2zm0-16c1.118 0 2.205.158 3.24.436l.52-1.932A14.489 14.489 0 0016 6v2zm9.258 3.742c.899.812 1.6 1.655 2.071 2.427.482.79.671 1.423.671 1.831h2c0-.928-.389-1.93-.963-2.872-.586-.962-1.42-1.95-2.438-2.87l-1.34 1.484zM6.675 20.198c-.878-.804-1.563-1.636-2.021-2.395C4.184 17.024 4 16.403 4 16H2c0 .917.38 1.906.941 2.836.573.95 1.389 1.926 2.384 2.837l1.35-1.475z"/>
                    <path stroke="#535358" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 25L25 7"/>
                  </svg>
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M5.20513 12.5C6.66296 14.7936 8.9567 16.9 12.5 16.9C16.0433 16.9 18.3371 14.7936 19.7949 12.5C18.3371 10.2064 16.0433 8.1 12.5 8.1C8.9567 8.1 6.66296 10.2064 5.20513 12.5ZM3.98551 12.1913C5.53974 9.60093 8.20179 6.9 12.5 6.9C16.7982 6.9 19.4603 9.60093 21.0145 12.1913L21.1997 12.5L21.0145 12.8087C19.4603 15.3991 16.7982 18.1 12.5 18.1C8.20179 18.1 5.53974 15.3991 3.98551 12.8087L3.80029 12.5L3.98551 12.1913ZM12.5 9.4C10.7879 9.4 9.4 10.7879 9.4 12.5C9.4 14.2121 10.7879 15.6 12.5 15.6C14.2121 15.6 15.6 14.2121 15.6 12.5C15.6 10.7879 14.2121 9.4 12.5 9.4Z" fill="#121923"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-[var(--border-color)] text-[var(--brand-color)] focus:ring-[var(--brand-color)]"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-[var(--text-secondary)]"
              >
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="font-medium text-[var(--brand-color)] hover:text-teal-600"
              >
                Forgot your password?
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-[var(--brand-color)] py-3 px-4 text-sm font-semibold text-white hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-[var(--brand-color)] focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </div>
        </form>

        {message && (
          <div
            className={`mt-4 text-center text-sm ${
              message.toLowerCase().includes("success") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default PathologyLogin;
