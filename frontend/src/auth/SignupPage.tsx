import axios from "axios";
import { ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppData, user_service } from "../context/AppContext";
import Loading from "../verify/Loading";
import ReCAPTCHA from "react-google-recaptcha";

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
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const { isAuth, loading: userLoading } = useAppData();
  const navigateTo = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // --- Handling CAPTCHA ----
  const handleCaptcha = (token: string | null) => {
    setCaptchaToken(token);
  };

  // --- Handling Submit ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords and Confirm Password must be same.");
      return;
    }
    if (!captchaToken) {
      alert("Please complete the CAPTCHA!");
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.post(`${user_service}/api/v1/signup`, {
        name: form.name,
        email: form.email,
        password: form.password,
        gender: form.gender,
        captcha: captchaToken,
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative w-full max-w-4xl">
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2 min-h-[600px]">
            {/* Left Side */}
            <div className="bg-gradient-to-br from-white via-blue-50 to-blue-100 p-8 lg:p-12 flex flex-col justify-center items-center text-gray-800 relative overflow-hidden">
              <div className="relative z-10 text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-2xl flex items-center justify-center shadow-inner">
                  <img
                    src="/appLogo.png"
                    alt="App Logo"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-blue-700">
                  Welcome!
                </h1>
                <p className="text-lg lg:text-xl text-gray-600 mb-8 leading-relaxed">
                  Connect, share, and discover new conversations.
                </p>
                <div className="flex flex-col items-center space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Secure & Private</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Real-time Messaging</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Global Community</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="max-w-sm mx-auto w-full">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Create Account
                  </h2>
                  <p className="text-gray-600">
                    Fill your details to get started
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <input
                      type="text"
                      name="name"
                      placeholder="Username"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                    />

                    <input
                      type="email"
                      name="email"
                      placeholder="Email address"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                    />

                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-white"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                    />

                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  {/* reCAPTCHA Widget */}
                  <div className="flex justify-center py-2">
                    <div className="transform scale-90 origin-center">
                      <ReCAPTCHA
                        sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                        onChange={handleCaptcha}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Creating account...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <span>Create Account</span>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    )}
                  </button>
                </form>

                {/* Switch to Sign In */}
                <div className="mt-6 text-center">
                  <p className="text-slate-600">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200"
                    >
                      Sign In
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
