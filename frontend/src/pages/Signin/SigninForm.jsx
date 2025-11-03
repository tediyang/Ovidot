import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaEye, FaEyeSlash, FaExclamationCircle } from "react-icons/fa";
import NotificationToast from "../../components/NotificationToast";
import { apiService } from "../../services/api";
import { tokenStorage } from "../../services/storage";

const Form = () => {
  const [formData, setFormData] = useState({
    email_or_phone: "",
    password: "",
  });
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validation, setValidation] = useState(false);
  const [help, setHelp] = useState("");
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

  const timeOutMessage = () => {
    setTimeout(() => {
      setSubmissionMessage("");
    }, 2000);
  };

  // handle password validation
  const handlePasswordValidation = (password) => {
    if (
      password.length < 6 ||
      !/(?=.*[a-zA-Z])/.test(password) ||
      !/(?=.*\d)/.test(password) ||
      !/(?=.*[^a-zA-Z0-9])/.test(password)
    ) {
      setPasswordMessage(
        "Password must be at least 6 characters long, contains at least one letter, one number, and one special character."
      );
      setPasswordValid(false);
    } else {
      setPasswordMessage("");
      setPasswordValid(true);
    }
  };

  const displayHelp = () => {
    setHelp("Login with phone? include country code e.g +2347023400000");

    setTimeout(() => {
      setHelp("");
    }, 4000);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    setValidation(true);
    setSubmissionInProgress(true);

    // Basic validation
    if (!formData.email_or_phone || !formData.password) {
      setSubmissionMessage("Please fill in all required fields.");
      timeOutMessage();
      setSubmissionInProgress(false);
      return;
    }

    // Setup API call
    const sendRequest = async () => {
      try {
        const response = await apiService.login(formData);
        if (response && response.message.includes("successful")) {
          // Optionally redirect to another page or reset the form
          // For example, redirect to sign-in page after successful signup
          setTimeout(() => {
            tokenStorage.setTokens(
              response.tokens.accessToken,
              response.tokens.refreshToken
            );

            setSubmissionMessage("Login Successful!");

            // reset form
            setFormData({
              email_or_phone: "",
              password: "",
            });
            setSubmissionInProgress(false);

            navigate("/dashboard");
          }, 2000); // Redirect after 2 seconds
        } else {
          setSubmissionMessage(response.message || "An error occurred!");
          setSubmissionInProgress(false);
          return;
        }
      } catch (error) {
        if (error && error?.message.includes("deactivated")) {
          setSubmissionMessage(
            "Account deactivated! Please use forget password to activate."
          );
          setSubmissionInProgress(false);
        } else if (error && error?.message.includes("password")) {
          setSubmissionMessage(
            `${error?.message} attempts left: ${error.remainingAttempts}`
          );
          setSubmissionInProgress(false);
          console.log(error);
          return;
        } else {
          setSubmissionMessage(
            error?.message || "An error occurred during submission."
          );
          setSubmissionInProgress(false);
          timeOutMessage();
          return;
        }
      }
    };
    sendRequest();

    // Rest values
    setValidation(false);
    setPasswordMessage("");

    // Reset submission message after a delay
    timeOutMessage();
  };

  return (
    <div className="absolute lg:relative basis-1/2 flex flex-col lg:justify-center gap-4 max-h-full overflow-y-auto lg:min-h-[42.5rem] w-full lg:max-w-[50rem] xl:rounded-tr-3xl xl:rounded-br-3xl lg:bg-white p-4 sm:px-8 lg:py-8 font-['Cabin'] z-10">
      <Link
        to="/"
        className="w-8 text-white hover:text-primary lg:text-primary lg:hover:text-[#757575] transition-colors"
      >
        <FaHome className="w-8 h-8" />
      </Link>
      <hgroup className="text-white">
        <h2 className="text-3xl font-bold lg:text-[#1E1E1E] text-center mb-2">
          Welcome Back
        </h2>
        <h4 className="lg:text-[#757575] mb-4 text-center">
          Experience the convenience of a modern period tracker.
        </h4>
      </hgroup>
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-wrap justify-between gap-y-3"
      >
        <div className="basis-full">
          <label
            htmlFor="email_or_phone"
            className="block text-sm font-medium text-[#FFFFFF] lg:text-[#757575] mb-1"
          >
            Email or Phone{" "}
            <span className="relative top-1 text-red-500">*</span>
            <FaExclamationCircle
              className="relative top-[0.2rem] inline ml-1 text-white lg:text-primary"
              onClick={displayHelp}
            />
          </label>
          <input
            type="text"
            id="email_or_phone"
            name="email_or_phone"
            value={formData.email_or_phone}
            onChange={handleChange}
            className={`${
              validation && !formData.email_or_phone && "border-red-500"
            } border-solid border-[#C9CCCF] rounded-[10px] h-12 p-3 w-full`}
            placeholder="e.g. john.doe@example.com"
            autoComplete="email"
            required
          />
          <p
            className={`text-sm ${
              help ? "text-white lg:text-black" : "text-red-500"
            }`}
          >
            {help || (submissionMessage.includes("email") && submissionMessage)}
          </p>
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
                  (validation && !formData.password)) &&
                "border-red-500"
              } border-solid border-[#C9CCCF] rounded-[10px] h-12 p-3 w-full`}
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
          <p className="text-sm text-red-500">
            {passwordMessage ||
              (submissionMessage.includes("password") &&
                `${submissionMessage}`)}
          </p>
          <p className="text-sm text-[#FFFFFF99] lg:text-[#757575] mt-3">
            Forgotten password?{" "}
            <Link
              to="/forget-password"
              className="text-white lg:text-primary lg:hover:text-[#757575]"
            >
              Forget Password
            </Link>
          </p>
        </div>
        <div className="basis-full mt-4 text-center">
          <button
            type="submit"
            disabled={submissionInProgress}
            className={`${
              submissionInProgress && "opacity-50 cursor-not-allowed"
            } w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-primary hover:bg-primary/95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 ease-in-out transform hover:-translate-y-0.5`}
          >
            Submit
          </button>
        </div>
      </form>
      <p className="text-sm text-[#FFFFFF99] lg:text-[#757575] -mt-1">
        Don&apos;t have an account?{" "}
        <Link
          to="/sign-up"
          className="text-white lg:text-primary lg:hover:text-[#757575]"
        >
          Signup
        </Link>
      </p>

      {/* Display submission message */}
      {submissionMessage &&
        !submissionMessage.includes("incorrect") &&
        NotificationToast({ submissionMessage })}
    </div>
  );
};

export default Form;
