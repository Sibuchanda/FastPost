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
  const navigateTo = useNavigate();

    const { isAuth, loading: userLoading, setIsAuth, setUser, fetchChats, fetchUsers } =  useAppData();

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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-gray-800 rounded-lg flex items-center justify-center mb-6">
              <img className="text-white rounded-2xl bg-white" src="/appLogo.png" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">Welcome Back</h1>
            <p className="text-gray-300 text-lg">Sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
            <p className="text-gray-400 text-center">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-blue-400 hover:underline">
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
