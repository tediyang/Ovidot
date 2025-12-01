import { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaEye, FaEyeSlash } from "react-icons/fa";
import NotificationToast from "../../components/NotificationToast";
import { apiService } from "../../services/api";
import { useNavigate } from "react-router-dom";

const Form = () => {
  let errorMessage;

  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    dob: "",
    username: "",
    phone: "",
    password: "",
  });
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validation, setValidation] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const navigate = useNavigate();

  // State to manage form submission status or messages
  const [submissionInProgress, setSubmissionInProgress] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState("");

  // Handle input changes and update the form data state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "password") {
      handlePasswordValidation(value);
    }
  };

  // handle password validation
  const handlePasswordValidation = (password) => {
    if (
      password.length < 8 ||
      !/(?=.*[a-z])/.test(password) || // At least one lowercase letter
      !/(?=.*[A-Z])/.test(password) || // At least one uppercase letter
      !/(?=.*\d)/.test(password) || // At least one digit
      !/(?=.*[^a-zA-Z0-9])/.test(password) // At least one special character
    ) {
      setPasswordMessage(
        "Password must be at least 8 characters long, contains at least one letter (inclusive Uppercase), one number, and one special character."
      );
      setPasswordValid(false);
    } else {
      setPasswordMessage("Password looks good.");
      setPasswordValid(true);
    }
  };

  const timeOutMessage = () => {
    setTimeout(() => {
      setSubmissionMessage("");
    }, 2000);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    setSubmissionInProgress(true);
    setValidation(true);

    // Basic validation
    if (
      !formData.fname ||
      !formData.lname ||
      !formData.email ||
      !formData.dob ||
      !formData.phone
    ) {
      setSubmissionMessage("Please fill in all required fields.");
      timeOutMessage();
      setSubmissionInProgress(false);
      return;
    }

    // Check if terms are accepted
    if (!acceptTerms) {
      setSubmissionMessage("You must accept the terms and conditions.");
      timeOutMessage();
      setSubmissionInProgress(false);
      return;
    }

    if (!passwordValid) {
      setSubmissionMessage(errorMessage);
      timeOutMessage();
      setSubmissionInProgress(false);
      return;
    }

    const formToSend = { ...formData };

    // remove username from formData if not given
    if (!formToSend.username) {
      delete formToSend.username;
    }

    // Send Request
    // ---- Send request to backend or API here ----
    const sendRequest = async () => {
      try {
        const response = await apiService.register(formToSend);
        if (response) {
          // Optionally redirect to another page or reset the form
          // For example, redirect to sign-in page after successful signup
          setTimeout(() => {
            setSubmissionMessage(response.message);

            // reset form
            setFormData({
              fname: "",
              lname: "",
              email: "",
              dob: "",
              username: "",
              phone: "",
              password: "",
            });
            setSubmissionInProgress(false);

            navigate("/sign-in");
          }, 2000); // Redirect after 2 seconds
        } else {
          setSubmissionMessage(response.message || "An error occurred!");
          setSubmissionInProgress(false);
          return;
        }
      } catch (error) {
        setSubmissionMessage(
          error.message || "An error occurred during submission."
        );
        setSubmissionInProgress(false);
        timeOutMessage();
        return;
      }
    };
    sendRequest();

    setValidation(false);
    setPasswordMessage("");

    // Reset submission message after a delay
    timeOutMessage();
  };

  return (
    <div className="absolute lg:relative basis-1/2 flex flex-col lg:justify-center gap-4 max-h-full overflow-y-auto lg:min-h-[42.5rem] lg:max-w-[50rem] xl:rounded-tr-3xl xl:rounded-br-3xl lg:bg-white p-4 sm:px-8 lg:py-8 font-['Cabin'] z-10">
      <Link
        to="/"
        className="w-8 text-white hover:text-primary lg:text-primary lg:hover:text-[#757575] transition-colors"
      >
        <FaHome className="w-8 h-8" />
      </Link>
      <hgroup className="text-white">
        <h2 className="text-3xl font-bold lg:text-[#1E1E1E] text-center mb-2">
          Sign Up
        </h2>
        <h4 className="lg:text-[#757575] mb-4 text-center">
          Hello, Please fill the form below to get started.
        </h4>
      </hgroup>
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-wrap justify-between gap-y-3"
      >
        <div className="basis-[45%]">
          <label
            htmlFor="fname"
            className="block text-sm font-medium text-[#FFFFFF] lg:text-[#757575] mb-1"
          >
            First Name <span className="relative top-1 text-red-500">*</span>
          </label>
          <input
            type="text"
            id="fname"
            name="fname"
            value={formData.fname}
            onChange={handleChange}
            className={`${
              validation && !formData.fname && "border-red-500"
            } border-solid border-[#C9CCCF] rounded-[10px] h-12 lg:h-10 p-3 w-full`}
            placeholder="e.g. John"
            autoCapitalize="given-name"
            required
          />
        </div>
        <div className="basis-[45%]">
          <label
            htmlFor="lname"
            className="block text-sm font-medium text-[#FFFFFF] lg:text-[#757575] mb-1"
          >
            Last Name <span className="relative top-1 text-red-500">*</span>
          </label>
          <input
            type="text"
            id="lname"
            name="lname"
            value={formData.lname}
            onChange={handleChange}
            className={`${
              validation && !formData.lname && "border-red-500"
            } border-solid border-[#C9CCCF] rounded-[10px] h-12 lg:h-10 p-3 w-full`}
            placeholder="e.g. Doe"
            autoComplete="family-name"
            required
          />
        </div>
        <div className="basis-full lg:basis-[45%]">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[#FFFFFF] lg:text-[#757575] mb-1"
          >
            Email <span className="relative top-1 text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`${
              validation && !formData.email && "border-red-500"
            } border-solid border-[#C9CCCF] rounded-[10px] h-12 lg:h-10 p-3 w-full`}
            placeholder="e.g. john.doe@example.com"
            autoComplete="email"
            required
          />
        </div>
        <div className="basis-full lg:basis-[45%]">
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-[#FFFFFF] lg:text-[#757575] mb-1"
          >
            Phone <span className="relative top-1 text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`${
              validation && !formData.phone && "border-red-500"
            } border-solid border-[#C9CCCF] rounded-[10px] h-12 lg:h-10 p-3 w-full`}
            placeholder="7065651224"
            autoComplete="tel"
            required
          />
        </div>
        <div className="basis-[45%]">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-[#FFFFFF] lg:text-[#757575] mb-1"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="border-solid border-[#C9CCCF] rounded-[10px] h-12 lg:h-10 p-3 w-full"
            placeholder="e.g. john_doe"
            autoComplete="username"
          />
        </div>
        <div className="basis-[45%]">
          <label
            htmlFor="dob"
            className="block text-sm font-medium text-[#FFFFFF] lg:text-[#757575] mb-1"
          >
            Date of Birth <span className="relative top-1 text-red-500">*</span>
          </label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            max={new Date().toISOString().split("T")[0]} // Set max date to today
            className={`${
              validation && !formData.dob && "border-red-500"
            } border-solid border-[#C9CCCF] rounded-[10px] h-12 lg:h-10 p-3 w-full`}
            required
          />
        </div>
        <div className="basis-full">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-[#FFFFFF] lg:text-[#757575] mb-1"
          >
            Password <span className="relative top-1 text-red-500">*</span>
          </label>
          <div className="flex relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`${
                ((passwordMessage && !passwordValid) ||
                  (validation && !passwordValid)) &&
                "border-red-500"
              } border-solid border-[#C9CCCF] rounded-[10px] h-12 lg:h-10 p-3 w-full`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 inset-y-2 border-0 bg-transparent"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <FaEyeSlash className="w-4 h-4" />
              ) : (
                <FaEye className="w-4 h-4" />
              )}
            </button>
          </div>
          <p
            className={`text-sm ${
              passwordValid ? "text-green-500" : "text-red-500"
            }`}
          >
            {passwordMessage}
          </p>
        </div>
        {/* terms and condition check */}
        <div className="basis-full">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              onChange={(e) => setAcceptTerms(e.target.checked)}
              required
              className="form-checkbox h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-opacity-50"
            />
            <span className="ml-2 text-sm text-[#FFFFFF99] lg:text-[#807d7d]">
              I agree to the{" "}
              <Link
                to="/terms"
                className="text-white lg:text-primary lg:hover:text-[#757575]"
              >
                Terms and Conditions
              </Link>
            </span>
          </label>
        </div>
        <div className="basis-full mt-4 text-center">
          <button
            type="submit"
            disabled={submissionInProgress}
            className={`${
              submissionInProgress && "opacity-50 cursor-not-allowed"
            } w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-primary hover:bg-[#4D0B5E90] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 ease-in-out transform hover:-translate-y-0.5`}
          >
            Submit
          </button>
        </div>
      </form>
      <p className="text-sm text-[#FFFFFF99] lg:text-[#757575] -mt-2">
        Already have an account?{" "}
        <Link
          to="/sign-in"
          className="text-white lg:text-primary lg:hover:text-[#a7a7a7]"
        >
          Signin
        </Link>
      </p>

      {/* Display submission message */}
      {submissionMessage && NotificationToast({ submissionMessage })}
    </div>
  );
};

export default Form;
