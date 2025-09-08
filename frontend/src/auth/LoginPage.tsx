import axios from "axios";
import { ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppData, user_service } from "../context/AppContext";
import Loading from "../verify/Loading";
import Cookies from "js-cookie";

interface SignInForm {
  email: string;
  password: string;
}

const LoginPage = () => {
  const [form, setForm] = useState<SignInForm>({ email: "", password: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const { isAuth, loading: userLoading, setIsAuth, setUser, fetchChats, fetchUsers } = useAppData();
  const navigateTo = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { data } = await axios.post(`${user_service}/api/v1/login`, form);
      Cookies.set("token", data.token, { expires: 15, secure: false, path: "/" });
      setUser(data.user);
      setIsAuth(true);
      await fetchChats();
      await fetchUsers();
      navigateTo("/chat");
      toast.success(data?.message || "Signed in successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Signin failed");
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) return <Loading />;
  if (isAuth) navigateTo("/chat");
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
              <img src="/appLogo.png" alt="App Logo" className="w-12 h-12 object-contain" />
            </div>
            <h1 className="text-4xl font-bold text-blue-700 mb-3">Welcome Back</h1>
            <p className="text-gray-600 text-lg">Sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
            />

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </button>
          </form>

          {/* Switch to Sign Up */}
          <div className="mt-6 space-y-2">
            <p className="text-gray-600 text-center">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
