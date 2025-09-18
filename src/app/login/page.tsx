"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Button from "@/components/Button/Button";
import Loader from "@/components/Loader/Loader";
import Input from "@/components/Inputs/Inputs";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginPage() {
  const { login, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
    }
  }

  const goToSignup = () => {
    router.push("/signup");
  }


  return (
    <div className="flex min-h-screen justify-center items-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-6 w-2xl space-y-4">

        <form role="form"
          onSubmit={handleSubmit}
        >
          <h1 className="text-xl font-bold mb-2 text-[#7b4cf2]">Login</h1>
          <Input
            type='email'
            name='email'
            id='email'
            value={email}
            onChange={(e) => {
              const value = e.target.value;
              setEmail(e.target.value)
              if (value.trim()) {
                setError("");
              }
            }}
            inputLabel={true}
            inputLabelName='Email'
            className={`w-full ${error ? 'border-red-500 bg-red-100' : 'border-gray-300 bg-white'}`}
            maxLength={30}
            labelStyle="mt-2"
            
          />

          <Input
            type={showPassword ? "text" : "password"}
            name='password'
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={showPassword ? <FaEyeSlash className="text-[#7b4cf2]" /> : <FaEye className="text-[#7b4cf2]" />}
            iconPosition='right'
            onClickIcon={() => setShowPassword((prev) => !prev)}
            inputLabel={true}
            inputLabelName='Password'
            maxLength={10}
            labelStyle="mt-2"
            isIconTestID="input-iconID"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex items-center justify-between w-full my-3">
            <Button children={"Login"} type="submit" arialabel="login-btn" variant={"primary"} className="bg-gray-600 px-5" />
          </div>
        </form>
        <div className="flex items-center">
          <p className="pr-1">Create New Account </p>
          <Button children={"Signup"} type="submit" arialabel="signup-btn" onButtonClick={goToSignup} className="textSignupBtn border-0" />
        </div>
      </div>
      {/* Loader */}
      <Loader loaderFullScreen={true} isLoading={loading} size="lg" />
    </div>
  );
}
