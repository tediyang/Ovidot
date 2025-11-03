import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FaHome, FaEye, FaEyeSlash } from "react-icons/fa";
import NotificationToast from "../../components/NotificationToast";

const Form = (props) => {
  const [formData, setFormData] = useState({
    email: "",
    new_password: "",
    confirm_password: "",
  });
  const [ passwordValid, setPasswordValid ] = useState(false);
  const [ passwordMessage, setPasswordMessage ] = useState("");
  const [ showPassword, setShowPassword ] = useState(false);
  const [ validation, setValidation ] = useState(false);

  // State to manage form submission status or messages
  const [submissionMessage, setSubmissionMessage] = useState("");

  const { currentView } = props;

  // Handle input changes and update the form data state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (name === "new_password") {
      handlePasswordValidation(value);
    }
    if (name === "confirm_password") {
      if (value !== formData.new_password) {
        setPasswordMessage("Passwords do not match.");
        setPasswordValid(false);
      } else {
        setPasswordMessage("");
        setPasswordValid(true);
      }
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

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    setValidation(true);

    // If current view is forgetPassword, we only need email
    if (currentView === "forgetPassword") {
      if (!formData.email) {
        setSubmissionMessage("Please fill in all required fields.");
        timeOutMessage();
        return;
      }
      // Simulate an API call to check if the email exists


      setSubmissionMessage("Successful, Please check your mail!");
      // Rest values
      setFormData({
        email: "",
      });
      setValidation(false);
    }

    // If current view is resetPassword, we need new_password and confirm_password
    if (currentView === "resetPassword") {
      if (!formData.new_password || !formData.confirm_password) {
        setSubmissionMessage("Please fill in all required fields.");
        timeOutMessage();
        return;
      }
      if (formData.new_password !== formData.confirm_password) {
        setPasswordMessage("Passwords do not match.");
        setPasswordValid(false);
        return;
      }
      if (!passwordValid) {
        setSubmissionMessage(
          "Please ensure your password meets the requirements."
        );
        timeOutMessage();
        return;
      }
      // Simulate an API call to reset the password


      setSubmissionMessage("Password Reset Successful!");
      // Rest values
      setFormData({
        new_password: "",
        confirm_password: "",
      });
      setValidation(false);
      setPasswordMessage("");
    }

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
          {currentView === "forgetPassword"
            ? "Forget Password"
            : "Reset Password"}
        </h2>
        <h4 className="lg:text-[#757575] mb-4 text-center">
          {currentView === "forgetPassword"
            ? "We'll email you instructions to reset your password if the provided email exist."
            : "Enter your new password."}
        </h4>
      </hgroup>
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-wrap justify-between gap-y-3"
      >
        {currentView === "forgetPassword" ? (
          <div className="basis-full">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#FFFFFF] lg:text-[#757575] mb-1"
            >
              Email <span className="relative top-1 text-red-500">*</span>
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`${
                validation && !formData.email && "border-red-500"
              } border-solid border-[#C9CCCF] rounded-[10px] h-12 p-3 w-full`}
              placeholder="e.g. john.doe@example.com"
              autoComplete="email"
              required
            />
            <p className="text-sm text-red-500">
              {submissionMessage.includes("not found") && submissionMessage}
            </p>
          </div>
        ) : (
          <>
            <div className="basis-full">
              <label
                htmlFor="new_password"
                className="block text-sm font-medium text-[#FFFFFF] lg:text-[#757575] mb-1"
              >
                New Password{" "}
                <span className="relative top-1 text-red-500">*</span>
              </label>
              <div className="flex relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="new_password"
                  name="new_password"
                  value={formData.new_password}
                  onChange={handleChange}
                  className={`${
                    ((passwordMessage && !passwordValid) ||
                      (validation && !formData.new_password)) &&
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
                  {showPassword ? <FaEyeSlash className='w-4 h-4' /> : <FaEye className='w-4 h-4' />}
                </button>
              </div>
              <p className="text-sm text-red-500">
                {!passwordMessage.includes("not match") && passwordMessage}
              </p>
            </div>
            <div className="basis-full">
              <label
                htmlFor="confirm_password"
                className="block text-sm font-medium text-[#FFFFFF] lg:text-[#757575] mb-1"
              >
                Confirm New Password{" "}
                <span className="relative top-1 text-red-500">*</span>
              </label>
              <input
                type="password"
                id="confirm_password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                className={`${
                  ((passwordMessage &&
                    !passwordValid &&
                    formData.confirm_password) ||
                    (validation && !formData.confirm_password)) &&
                  "border-red-500"
                } border-solid border-[#C9CCCF] rounded-[10px] h-12 p-3 w-full`}
                required
              />
              <p className="text-sm text-red-500">
                {passwordMessage.includes("not match") && passwordMessage}
              </p>
            </div>
          </>
        )}
        <div className="basis-full mt-4 text-center">
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-primary hover:bg-primary/95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 ease-in-out transform hover:-translate-y-0.5"
          >
            Submit
          </button>
        </div>
      </form>
      {currentView === "forgetPassword" && (
        <p className="text-sm text-[#FFFFFF99] lg:text-[#757575] -mt-1">
          Return to{" "}
          <Link
            to="/sign-in"
            className="text-white lg:text-primary lg:hover:text-[#757575]"
          >
            Signin
          </Link>
        </p>
      )}

      {/* Display submission message */}
      {submissionMessage &&
        !submissionMessage.includes("not found") &&
        NotificationToast({ submissionMessage })}
    </div>
  );
};

Form.propTypes = {
  currentView: PropTypes.string.isRequired, // ForgetPassword, ResetPassword
};

export default Form;
