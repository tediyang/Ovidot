import { formatDate } from "../../utility/helper";
import { apiService } from "../../services/api";
import DashboardToast from "./DashboadToast";
import { FaTimes, FaSpinner } from "react-icons/fa";
import { useState } from "react";

const CreateCycle = ({ user, setCreateCycle }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(false);
  const [formData, setFormData] = useState({
    startdate: formatDate(new Date()),
    period: user.period,
  });

  const timeOutMessage = () => {
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === "period") {
      // Ensure period is within the valid range
      let periodValue = parseInt(value, 10);
      if (isNaN(periodValue) || periodValue === "-" || periodValue === "+") {
        periodValue = "";
      } else if (periodValue < 2) {
        periodValue = 2;
      } else if (periodValue > 8) {
        periodValue = 8;
      }
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    setLoading(true);

    const toSubmit = {
      startdate: formData.startdate
    }

    if (formData.period) {
      toSubmit.period = formData.period
    }

    const sendRequest = async () => {
      try {
        const response = await apiService.postData(
          "/auth/cycles/create",
          toSubmit
        );
        if (response && response.data.message.includes("created")) {
          // Optionally redirect to another page or reset the form
          // For example, redirect to sign-in page after successful signup
          setMessage("Cycle Created");
          setLoading(false);
          // reload the page after a short delay to reflect new cycle
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          setMessage(response.message || "An error occurred!");
          setLoading(false);
        }
        timeOutMessage();
        return;
      } catch (error) {
        if (error && error?.message.includes("deactivated")) {
          setMessage(
            "Account deactivated! Please use forget password to activate."
          );
          setLoading(false);
        } else {
          setMessage(error?.message || "An error occurred during submission.");
          setLoading(false);
        }
        timeOutMessage();
        return;
      }
    };
    sendRequest();
  };

  return (
    <div className="fixed flex justify-center items-center h-[100dvh] w-full -mt-2 bg-white bg-opacity-90 z-10">
      <div className="flex flex-col h-[22rem] w-[20rem] bg-white rounded-xl p-4 shadow-lg">
        <FaTimes className="self-end cursor-pointer" onClick={setCreateCycle} />
        <h3 className="text-primary">Create Your Cycle</h3>
        <form
          className="flex flex-col gap-4 mt-4"
          noValidate
        >
          <div className="basis-[45%]">
            <label
              htmlFor="startdate"
              className="block text-sm font-medium text-black lg:text-[#757575] mb-1"
            >
              Start Date <span className="relative top-1 text-red-500">*</span>
            </label>
            <input
              type="date"
              id="startdate"
              name="startdate"
              value={formData.startdate}
              onChange={handleChange}
              max={new Date().toISOString().split("T")[0]} // Set max date to today
              className={`border-solid border-[#C9CCCF] rounded-[10px] h-12 lg:h-10 p-3 w-full`}
              required
            />
          </div>
          <div className="basis-[45%]">
            <label
              htmlFor="period"
              className="block text-sm font-medium text-black lg:text-[#757575] mb-1"
            >
              Period
            </label>
            <input
              type="number"
              name="period"
              value={formData.period}
              onChange={handleChange}
              className={`border-solid border-[#C9CCCF] rounded-[10px] h-12 lg:h-10 p-3 w-full`}
              min={2}
              max={8}
            />
          </div>
          <div className="basis-full mt-4 text-center">
            <button
              type="button"
              onClick={handleSubmit}
              className={`${
                loading && "opacity-50 cursor-not-allowed"
              } px-6 py-3 text-white bg-primary hover:bg-opacity-90 rounded border-0`}
              disabled={loading}
            >
              {loading ? (
                <FaSpinner className="animate-spin text-white" />
              ) : (
                "Create"
              )}
            </button>
          </div>
        </form>
        {message && (
          <DashboardToast message={message} setMessage={setMessage} />
        )}
      </div>
    </div>
  );
};

export default CreateCycle;
