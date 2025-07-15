"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const phoneSchema = z.object({
  countryCode: z.string().min(1, "Select a country code"),
  phone: z
    .string()
    .min(7, "Phone number too short")
    .max(15, "Phone number too long")
    .regex(/^\d+$/, "Phone number must be digits only"),
});

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits").regex(/^\d+$/, "OTP must be digits only"),
});

type PhoneFormData = z.infer<typeof phoneSchema>;
type OtpFormData = z.infer<typeof otpSchema>;

export default function AuthPage() {
  const router = useRouter();
  const [countries, setCountries] = useState<{ name: string; code: string; dial: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<"phone" | "otp" | "success">("phone");
  const [otpError, setOtpError] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [phoneData, setPhoneData] = useState<PhoneFormData | null>(null);

  const {
    register: registerPhone,
    handleSubmit: handleSubmitPhone,
    formState: { errors: phoneErrors },
  } = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
  });

  const {
    register: registerOtp,
    handleSubmit: handleSubmitOtp,
    formState: { errors: otpErrors },
    reset: resetOtp,
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
  });

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          setCountries([
            { name: "India", code: "IN", dial: "+91" },
            { name: "United States", code: "US", dial: "+1" },
            { name: "United Kingdom", code: "GB", dial: "+44" },
            { name: "Canada", code: "CA", dial: "+1" },
            { name: "Australia", code: "AU", dial: "+61" },
            { name: "Germany", code: "DE", dial: "+49" },
          ]);
          setLoading(false);
          return;
        }
        const countryList = data
          .map((c: any) => ({
            name: c.name?.common || "",
            code: c.cca2 || "",
            dial: c.idd?.root && c.idd?.suffixes?.length
              ? `${c.idd.root}${c.idd.suffixes[0]}`
              : "",
          }))
          .filter((c: any) => c.dial && c.name && c.code);
        setCountries(countryList.sort((a: any, b: any) => a.name.localeCompare(b.name)));
        setLoading(false);
      })
      .catch((err) => {
        setCountries([
          { name: "India", code: "IN", dial: "+91" },
          { name: "United States", code: "US", dial: "+1" },
          { name: "United Kingdom", code: "GB", dial: "+44" },
          { name: "Canada", code: "CA", dial: "+1" },
          { name: "Australia", code: "AU", dial: "+61" },
          { name: "Germany", code: "DE", dial: "+49" },
        ]);
        setLoading(false);
        console.error("Failed to fetch countries:", err);
      });
  }, []);

  const onSubmitPhone = (data: PhoneFormData) => {
    setSendingOtp(true);
    toast.success("OTP sent!");
    setTimeout(() => {
      setSendingOtp(false);
      setStep("otp");
      setPhoneData(data);
    }, 1500); // Simulate OTP send delay
  };

  const onSubmitOtp = (data: OtpFormData) => {
    if (data.otp === "123456") {
      setStep("success");
      setOtpError("");
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } else {
      setOtpError("Invalid OTP. Try 123456.");
      resetOtp();
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--primary-bg)' }}
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'var(--gemini-gradient)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-light mb-2" style={{ color: 'var(--primary-text)' }}>
            Welcome to <span className="gradient-text">Gemini</span>
          </h1>
          <p style={{ color: 'var(--secondary-text)' }}>
            Sign in to continue to your conversations
          </p>
        </div>

        {/* Auth Card */}
        <div className="card animate-slide-in">
          {step === "phone" && (
            <form onSubmit={handleSubmitPhone(onSubmitPhone)} className="space-y-6">
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--primary-text)' }}
                >
                  Country Code
                </label>
                {loading ? (
                  <div className="animate-pulse h-12 rounded-lg" style={{ background: 'var(--secondary-bg)' }} />
                ) : (
                  <select
                    {...registerPhone("countryCode")}
                    className="input"
                    style={{
                      background: 'var(--secondary-bg)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--primary-text)'
                    }}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select country
                    </option>
                    {countries.map((c) => (
                      <option key={c.code} value={c.dial}>
                        {c.name} ({c.dial})
                      </option>
                    ))}
                  </select>
                )}
                {phoneErrors.countryCode && (
                  <p className="text-sm mt-1" style={{ color: 'var(--danger-text)' }}>
                    {phoneErrors.countryCode.message}
                  </p>
                )}
              </div>

              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--primary-text)' }}
                >
                  Phone Number
                </label>
                <input
                  {...registerPhone("phone")}
                  className="input"
                  style={{
                    background: 'var(--secondary-bg)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--primary-text)'
                  }}
                  placeholder="Enter phone number"
                  maxLength={15}
                />
                {phoneErrors.phone && (
                  <p className="text-sm mt-1" style={{ color: 'var(--danger-text)' }}>
                    {phoneErrors.phone.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={sendingOtp}
              >
                {sendingOtp ? (
                  <div className="flex items-center justify-center">
                    <div className="spinner mr-2"></div>
                    Sending OTP...
                  </div>
                ) : (
                  "Send OTP"
                )}
              </button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleSubmitOtp(onSubmitOtp)} className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ background: 'var(--active-bg)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <h2 className="text-xl font-medium mb-2" style={{ color: 'var(--primary-text)' }}>
                  Verify your phone
                </h2>
                <p className="text-sm" style={{ color: 'var(--secondary-text)' }}>
                  We sent a code to {phoneData?.countryCode} {phoneData?.phone}
                </p>
              </div>

              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--primary-text)' }}
                >
                  Enter verification code
                </label>
                <input
                  {...registerOtp("otp")}
                  className="input text-center tracking-widest text-lg"
                  style={{
                    background: 'var(--secondary-bg)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--primary-text)'
                  }}
                  placeholder="123456"
                  maxLength={6}
                  autoFocus
                />
                {otpErrors.otp && (
                  <p className="text-sm mt-1" style={{ color: 'var(--danger-text)' }}>
                    {otpErrors.otp.message}
                  </p>
                )}
                {otpError && (
                  <p className="text-sm mt-1" style={{ color: 'var(--danger-text)' }}>
                    {otpError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
              >
                Verify Code
              </button>

              <button
                type="button"
                className="btn btn-ghost w-full"
                onClick={() => {
                  setStep("phone");
                  setOtpError("");
                  setPhoneData(null);
                }}
              >
                Change phone number
              </button>
            </form>
          )}

          {step === "success" && (
            <div className="text-center space-y-6 animate-fade-in">
              <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center" style={{ background: 'var(--success-text)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <polyline points="20,6 9,17 4,12"></polyline>
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-medium mb-2" style={{ color: 'var(--primary-text)' }}>
                  Welcome back!
                </h2>
                <p style={{ color: 'var(--secondary-text)' }}>
                  You're successfully signed in as
                </p>
                <p className="font-medium mt-1" style={{ color: 'var(--accent-text)' }}>
                  {phoneData?.countryCode} {phoneData?.phone}
                </p>
              </div>
              <div className="animate-pulse">
                <p className="text-sm" style={{ color: 'var(--secondary-text)' }}>
                  Redirecting to dashboard...
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm" style={{ color: 'var(--tertiary-text)' }}>
            By continuing, you agree to our{' '}
            <a href="#" className="hover:underline" style={{ color: 'var(--accent-text)' }}>
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="hover:underline" style={{ color: 'var(--accent-text)' }}>
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}