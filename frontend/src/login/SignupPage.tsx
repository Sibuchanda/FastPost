import axios from "axios";
import { ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppData, user_service } from "../context/AppContext";
import Loading from "../verify/Loading";

type Gender = "male" | "female";

interface SignUpForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: Gender;
}

const SignUp = () => {
  const [form, setForm] = useState<SignUpForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "male",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const navigateTo = useNavigate();

  const { isAuth, loading: userLoading } = useAppData();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords and Confirm Password must be same.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(`${user_service}/api/v1/signup`, {
        name: form.name,
        email: form.email,
        password: form.password,
        gender: form.gender,
      });
      toast.success(data?.message || "OTP sent to your email");
      navigateTo(`/verify?email=${encodeURIComponent(form.email)}`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Signup failed");
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
            <h1 className="text-4xl font-bold text-white mb-3">Create Account</h1>
            <p className="text-gray-300 text-lg">Sign up to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Username"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
            />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
            />
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={form.confirmPassword}
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
                  Creating account...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Sign Up</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </button>
          </form>

          {/* Switch to Sign In */}
          <div className="mt-6 space-y-2">
            <p className="text-gray-400 text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-400 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
