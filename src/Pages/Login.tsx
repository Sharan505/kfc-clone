import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();
    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }

        if (!formData.password.trim()) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                throw new Error(`Expected JSON, got: ${text.substring(0, 100)}...`);
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            login({
                _id: data.user._id,
                email: data.user.email,
                firstName: data.user.firstName,
                lastName: data.user.lastName,
                mobileNo: data.user.mobileNo,
                address: data.user.address,
            });
            navigate("/");
        } catch (error) {
            setErrors(prev => ({
                ...prev,
                form: error instanceof Error ? error.message : "Login failed"
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section>
            <div className="grid grid-cols-12">
                <div className="col-span-3"></div>

                <div className="col-span-6 h-screen flex justify-center items-center flex-col">
                    <img
                        className="w-24 mb-8"
                        src="https://login.kfc.co.in/auth/resources/jdsrg/login/kfcIndiaLoginUIDev_04_07_2025_15_05/images/KFC_logo.svg"
                        alt=""
                    />

                    <p className="text-2xl font-bold font-oswald">WELCOME BACK!</p>
                    <p className="text-lg font-sans">Login to continue ordering your favorite meals.</p>
                    <div className="w-full flex justify-center mt-4">
                        <p className="text-gray-600">
                            New User?{' '}
                            <Link to="/signup" className="text-red-600 hover:underline">
                                Signup
                            </Link>
                        </p>
                    </div>
                    <form className="flex flex-col w-full" onSubmit={handleSubmit}>
                        {/* Email */}
                        <div className="w-full my-4">
                            <input
                                name="email"
                                type="email"
                                onChange={handleChange}
                                className="w-full bg-transparent font-sans text-lg text-black placeholder:text-black border border-x-0 border-t-0 border-b-black pt-2 pb-1 px-2 outline-none"
                                placeholder="Email ID*"
                            />
                            {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div className="w-full my-4">
                            <input
                                name="password"
                                type="password"
                                onChange={handleChange}
                                className="w-full bg-transparent font-sans text-lg text-black placeholder:text-black border border-x-0 border-t-0 border-b-black pt-2 pb-1 px-2 outline-none"
                                placeholder="Password*"
                            />
                            {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
                        </div>

                        {/* Error message */}
                        {errors.form && (
                            <p className="text-red-600 text-center mt-2">{errors.form}</p>
                        )}

                        {/* Login button */}
                        <div className="w-full flex justify-center">
                            <button
                                className="mt-8 cursor-pointer bg-red-600 w-40 text-white py-2 px-4 rounded-lg"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Logging in..." : "Login"}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="col-span-3"></div>
            </div>
        </section>
    );
}

export default Login;
