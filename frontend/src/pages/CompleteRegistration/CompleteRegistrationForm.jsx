import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import NotificationToast from "../../components/NotificationToast";
import { apiService } from "../../services/api";
import config from '../../config';
import { tokenStorage } from "../../services/storage";

const Form = () => {
  const [formData, setFormData] = useState({
    uuid: "",
    phone: "",
    dob: "",
    google: true
  });
  const [validation, setValidation] = useState(false);
  const navigate = useNavigate();

  // State to manage form submission status or messages
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [submissionInProgress, setSubmissionInProgress] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState("");

  // Handle input changes and update the form data state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const timeOutMessage = () => {
    setTimeout(() => {
      setSubmissionMessage("");
    }, 2000);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    setValidation(true);
    setSubmissionInProgress(true);

    // Basic validation
    if (!formData.phone || !formData.dob) {
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

    // add unique id to form
    const registrationKey = tokenStorage.getRegistrationKey();
    formData.uuid = registrationKey;

    // Setup API call
    const sendRequest = async () => {
      try {
        const response = await apiService.postData(
          config.apiEndpoints.general.completeRegistration, 
          formData
        );

        if (response && response.data.message.includes("successful")) {
          // Optionally redirect to another page or reset the form
          // For example, redirect to sign-in page after successful signup
          tokenStorage.setTokens(
            response.data.tokens.accessToken,
            response.data.tokens.refreshToken
          );
          
          setSubmissionMessage("Registration Successful! Redirecting to dashboard...");
          setSubmissionInProgress(false);
          
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000); // Redirect after 2 seconds
        } else {
          setSubmissionMessage(response.message || "An error occurred!");
        }
        setSubmissionInProgress(false);
        return;
      } catch (error) {
        if (error?.message && error.message.includes("Registration session expired")) {
          setSubmissionMessage(error.message);
          timeOutMessage();

          setTimeout(() => {
            navigate("/sign-up");
          }, 2000);
          return;
        }
        setSubmissionMessage(
          error?.message || "An error occurred during submission."
        );

        setSubmissionInProgress(false);
        timeOutMessage();
        return;
      }
    };

    sendRequest();

    // Rest values
    setValidation(false);

    // Reset submission message after a delay
    timeOutMessage();
  };

  return (
    <div className="absolute lg:relative basis-1/2 flex flex-col lg:justify-center gap-4 max-h-full overflow-y-auto lg:min-h-[47.5rem] w-full lg:max-w-[50rem] xl:rounded-tr-3xl xl:rounded-br-3xl lg:bg-white p-4 sm:px-8 lg:py-8 font-['Cabin'] z-10">
      <Link
        to="/sign-up"
        className="w-8 text-white hover:text-primary lg:text-primary lg:hover:text-[#757575] transition-colors"
      >
        <FaArrowLeft className="w-8 h-8" />
      </Link>
      <hgroup className="text-white">
        <h2 className="text-3xl font-bold lg:text-[#1E1E1E] text-center mb-2">
          Complete Registration
        </h2>
        <h4 className="lg:text-[#757575] mb-4 text-center">
          Provide the data below to complete registration
        </h4>
      </hgroup>
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-wrap justify-between gap-y-3"
      >
        <div className="basis-full">
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-[#FFFFFF] lg:text-[#757575] mb-1"
          >
            Phone{" "}
            <span className="relative top-1 text-red-500">*</span>
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`${
              validation && !formData.phone && "border-red-500"
            } border-solid border-[#C9CCCF] rounded-[10px] h-12 p-3 w-full`}
            placeholder="e.g. 07012300000"
            autoComplete="phone"
            required
          />
        </div>
        <div className="basis-full">
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
            } w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-primary hover:bg-primary/95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 ease-in-out transform hover:-translate-y-0.5`}
          >
            Submit
          </button>
        </div>
      </form>
      {/* Display submission message */}
      {submissionMessage &&
        !submissionMessage.includes("incorrect") &&
        NotificationToast({ submissionMessage })}
    </div>
  );
};

export default Form;
