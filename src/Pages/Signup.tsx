import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobileNo: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.mobileNo.trim()) newErrors.mobileNo = "Mobile number is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData
        }),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Expected JSON, got: ${text.substring(0, 100)}...`);
      }
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }


      navigate('/login');
    } catch (error) {
      console.log(error);
      setErrors(prev => ({
        ...prev,
        form: error instanceof Error ? error.message : 'Registration failed. Please try again.'
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
          <img className="w-24 mb-8" src="https://login.kfc.co.in/auth/resources/jdsrg/login/kfcIndiaLoginUIDev_04_07_2025_15_05/images/KFC_logo.svg" alt="" />
          <p className="text-2xl font-bold font-oswald">LET'S CREATE AN ACCOUNT FOR YOU!</p>
          <p className="text-lg font-sans">Sign up to order food from your favorite restaurants in just a few clicks.</p>
          <p className="text-gray-600 mt-8">
            Already a user?{' '}
            <Link to="/login" className="text-red-600 hover:underline">
              Login
            </Link>
          </p>
          <form className="flex flex-col w-full" onSubmit={handleSubmit}>
            <div className="w-full flex justify-between my-4">
              <input name="firstName" onChange={handleChange} className="w-1/2 bg-transparent font-sans text-lg text-black placeholder:text-black border border-x-0 border-t-0 border-b-black pt-2 pb-1 px-2 outline-none" type="text" placeholder="First Name*" />
              <input name="lastName" onChange={handleChange} className="w-1/2 mx-10 bg-transparent font-sans text-lg text-black placeholder:text-black border border-x-0 border-t-0 border-b-black pt-2 pb-1 px-2 outline-none" type="text" placeholder="Last Name*" />
            </div>
            <div className="w-full flex justify-between my-4">
              <input name="mobileNo" onChange={handleChange} className="w-1/2 bg-transparent font-sans text-lg text-black placeholder:text-black border border-x-0 border-t-0 border-b-black pt-2 pb-1 px-2 outline-none" type="number" placeholder="Mobile No.*" />
              <input name="email" onChange={handleChange} className="w-1/2 mx-10 bg-transparent font-sans text-lg text-black placeholder:text-black border border-x-0 border-t-0 border-b-black pt-2 pb-1 px-2 outline-none" type="email" placeholder="Email ID*" />
            </div>
            <div className="w-full flex justify-between my-4">
              <input name="address" onChange={handleChange} className="w-full mr-10 bg-transparent font-sans text-lg text-black placeholder:text-black border border-x-0 border-t-0 border-b-black pt-2 pb-1 px-2 outline-none" type="text" placeholder="Address*" />
            </div>
            <div className="w-full flex justify-between my-4">
              <input name="password" onChange={handleChange} className="w-1/2 bg-transparent font-sans text-lg text-black placeholder:text-black border border-x-0 border-t-0 border-b-black pt-2 pb-1 px-2 outline-none" type="password" placeholder="Password*" />
              <input name="confirmPassword" onChange={handleChange} className="w-1/2 mx-10 bg-transparent font-sans text-lg text-black placeholder:text-black border border-x-0 border-t-0 border-b-black pt-2 pb-1 px-2 outline-none" type="password" placeholder="Confirm Password*" />
            </div>
            <div className="w-full flex justify-center">
              <button className="mt-8 cursor-pointer bg-red-600 w-40 text-white py-2 px-4 rounded-lg" onClick={handleSubmit}>Create Account</button>
            </div>
          </form>
        </div>
        <div className="col-span-3"></div>
      </div>
    </section>
  );
}

export default Signup;