import { useState } from "react";
import { account as clientAccount } from "../appwrite/config";
import { Client, Account } from "appwrite";
import { login } from "../appwrite/Auth";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import LoginToggle from "../components/Slider";
import { useStore } from "../store/store";

const Login = () => {
  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser);
  // const userType = useStore((state) => state.type);
  // const setType = useStore((state) => state.setType);
  const globalUser = useStore((state) => state.User);

  const [form, setForm] = useState({ email: "", password: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleUserType = () => {
  // const newType = userType === "Client" ? "Professional" : "Client";
  // setType(newType);
  // localStorage.setItem("type", newType); // Update localStorage on toggle
};

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // localStorage.setItem("type", userType);
    const userType = localStorage.getItem("type")
    try {
      if (userType === "Client") {
        await login(form.email, form.password);
        const user = await clientAccount.get();

        setUser({
          id: user.$id,
          name: user.name,
          email: user.email,
          password: form.password,
          isLoggedIn: true
        });
        //console.log(user)
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        // For Professionals
        const profClient = new Client();
        profClient
          .setEndpoint("https://fra.cloud.appwrite.io/v1")
          .setProject("6826c7d8002c4477cb81");

        const profAccount = new Account(profClient);
        await profAccount.createEmailPasswordSession(form.email, form.password);
        const { jwt } = await profAccount.createJWT(); // 🔄 Use correct profAccount
        localStorage.setItem("token", jwt);
        // const proffesionaluser = await clientAccount.get();
        // //console.log(proffesionaluser) 

        toast.success("Login successful!");
        navigate("/mentorsdashboard");
      }
    } catch (error) {
  console.error("Login failed:", error);
  
  const errorMessage = error?.response?.data?.message || error?.message || error.toString();

  if (errorMessage.includes("Creation of a session is prohibited when a session is active")) {
    toast.error("Already logged in on another device");
  } else {
    toast.error("Login failed. Please try again.");
  }
}

  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#e9ecf4] via-[#f2edf8] to-[#eaf6eb] flex flex-col items-center justify-center px-4 py-6">
        <div className="mb-6">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-500">
            MoodMigo
          </h1>
        </div>

        <LoginToggle onChange={toggleUserType} />

        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center mb-4 text-gray-900">
            Welcome Back{globalUser?.name ? `, ${globalUser.name}` : ""}!
          </h2>

          <p className="text-sm text-center text-gray-600 mb-6">
            Log in to continue your mental wellness journey.
          </p>

          <form onSubmit={handleFormSubmit}>
            <div className="mb-4 text-left">
              <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div className="mb-4 text-left">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-sm font-medium mb-1 text-gray-700">
                  Password
                </label>
                <Link to="/forgot" className="text-sm text-purple-500 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-purple-500 text-white font-semibold py-2 rounded-md hover:bg-purple-600 transition duration-200"
            >
              Sign In
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-700">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-purple-600 font-semibold hover:underline">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
