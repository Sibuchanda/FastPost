import axios from "axios";
import { ArrowRight, ChevronLeft, Loader2} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppData, user_service } from "../context/AppContext";
import Loading from "../verify/Loading";

const VerifyOtp = () => {
  const { isAuth, loading: userLoading } = useAppData();
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState<string>("");
  const [resendLoading, setResendLoading] = useState<boolean>(false);
  const [timer, setTimer] = useState(60);
  const [redirecting, setRedirecting] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const navigateTo = useNavigate();

  const [searchParams] = useSearchParams();
  const email: string = searchParams.get("email") || "";
   const mode = (searchParams.get("mode") as "signup" | "forgot") || "signup";

  // Handle redirect when user is already authenticated
  useEffect(() => {
    if (isAuth && !userLoading) {
      setRedirecting(true);
      const timer = setTimeout(() => {
        navigateTo("/chat");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isAuth, userLoading, navigateTo]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleInputChange = (index: number, value: string): void => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLElement>
  ): void => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const patedData = e.clipboardData.getData("text");
    const digits = patedData.replace(/\D/g, "").slice(0, 6);
    if (digits.length === 6) {
      const newOtp = digits.split("");
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please Enter all 6 digits");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const endpoint = mode === "signup" ? `${user_service}/api/v1/verify` : `${user_service}/api/v1/verifyforgototp`;
      const { data } = await axios.post(endpoint, {
        email,
        otp: otpString,
      });
      toast.success(data.message);
      if (mode === "signup") {
        navigateTo("/login");
      } else {
        navigateTo(`/resetpassword?email=${encodeURIComponent(email)}`);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // --- Handling Resend OTP ---
const handleResendOtp = async () => {
  setResendLoading(true);
  setError("");
  try {
    const endpoint = mode === "signup" ? `${user_service}/api/v1/resendotp` : `${user_service}/api/v1/resendforgotpassotp`;
    const { data } = await axios.post(endpoint, { email });
    toast.success(data.message);
    setTimer(60);
  } catch (error: any) {
    setError(error.response?.data?.message || "Resend failed");
  } finally {
    setResendLoading(false);
  }
};

  if (userLoading || redirecting) {
    return <Loading />;
  }
  if (isAuth) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8 relative">
            <button
              className="absolute top-0 left-0 p-2 text-gray-500 hover:text-blue-600"
              onClick={() => navigateTo("/login")}
            >
              <ChevronLeft className="w-6 h-6 cursor-pointer" />
            </button>
            <div className="mx-auto w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
              <img src="/appLogo.png" alt="App Logo" className="w-12 h-12 object-contain" />
            </div>
            <h1 className="text-4xl font-bold text-blue-700 mb-3">Verify Your Email</h1>
            <p className="text-gray-600 text-lg">We have sent a 6-digit code to</p>
            <p className="text-blue-600 font-medium">{email}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                Enter your 6 digit OTP
              </label>
              <div className="flex justify-center space-x-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el: HTMLInputElement | null) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                  />
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-300 rounded-lg p-3">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifying...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Verify</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm mb-4">Didn’t receive the code?</p>
            {timer > 0 ? (
              <p className="text-gray-500 text-sm">Resend code in {timer} seconds</p>
            ) : (
              <button
                className="text-blue-600 hover:text-blue-700 font-medium text-sm disabled:opacity-50 cursor-pointer"
                disabled={resendLoading}
                onClick={handleResendOtp}
              >
                {resendLoading ? "Sending..." : "Resend Code"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;