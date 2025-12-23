import DashboardToast from "./DashboadToast";
import { apiService } from "../../services/api";
import { formatDate } from "../../utility/helper";
import { useState } from "react";
import { FaTimes, FaSpinner, FaPlus } from "react-icons/fa";

const ModifyCycle = ({ cycle, setModifyCycle }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(false);
  const [formData, setFormData] = useState({
    period: cycle.period,
    ovulation: formatDate(new Date(cycle.ovulation)),
  });
  const [periodLength, setPeriodLength] = useState(cycle.period);
  const minLength = 2;
  const maxLength = 8;

  const handleDeletePeriod = (e) => {
    e.preventDefault(); // Prevent form submission
    if (periodLength > minLength) {
      const newLength = periodLength - 1;
      setPeriodLength(newLength);
      setFormData((prev) => ({ ...prev, period: newLength })); // Also update formData
    }
  };

  const handleAddPeriod = (e) => {
    e.preventDefault(); // Prevent form submission
    if (periodLength < maxLength) {
      const newLength = periodLength + 1;
      setPeriodLength(newLength);
      setFormData((prev) => ({ ...prev, period: newLength })); // Also update formData
    }
  };

  const timeOutMessage = () => {
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true);

    const toSubmit = {
      ovulation: formData.ovulation,
      period: periodLength, // Use the current periodLength state
    };

    const sendRequest = async () => {
      try {
        const response = await apiService.putData(
          "/auth/cycles",
          cycle.id,
          toSubmit
        );
        if (response && response.status === 200) {
          setMessage("Cycle Updated");
          setLoading(false);
          // reload the page after a short delay to reflect update
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

  const handleDelete = (e) => {
    e.preventDefault(); // Prevent default behavior
    setLoading(true);

    const sendRequest = async () => {
      try {
        if (!window.confirm("Are you sure you want to delete this cycle?")) {
          setLoading(false);
          return;
        }
        const response = await apiService.deleteData("/auth/cycles", cycle.id);
        if (response && response.status === 204) {
          setMessage("Cycle Deleted");
          setLoading(false);
          // reload the page after a short delay to reflect deletion
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
      <div className="flex flex-col max-h-[34rem] w-[20rem] bg-white rounded-xl p-4 shadow-lg">
        <FaTimes
          className="self-end cursor-pointer h-[1rem]"
          onClick={setModifyCycle}
        />
        <h2 className="text-xl font-medium text-gray-800 mb-2">
          Edit your Period Days
        </h2>
        <p className="text-sm text-gray-500">
          If the ovulation or period days predicted are incorrect, you can
          modify them here.
        </p>
        <form
          className="flex flex-col gap-4 mt-4"
          onSubmit={handleUpdate}
          noValidate
        >
          <div>
            <h4 className="text-base font-semibold text-gray-700 mb-3 flex items-center">
              Select your Period Length
            </h4>
            <div className="flex flex-wrap justify-center gap-4 max-w-lg mb-2">
              {/* Period day boxes */}
              {Array.from({ length: periodLength }, (_, index) => (
                <div key={index} className="relative">
                  <div
                    className={`${
                      index === periodLength - 1
                        ? "bg-purple-900 text-white shadom-md"
                        : "shadow-sm bg-purple-200 text-purple-800 hover:bg-purple-300"
                    } w-10 h-10 flex items-center justify-center rounded-lg font-semibold cursor-pointer transition duration-150 relative`}
                  >
                    <span className="text-xl font-bold">{index + 1}</span>
                  </div>

                  {/* Delete button */}
                  {index === periodLength - 1 && periodLength > minLength && (
                    <button
                      type="button" // Add type="button" to prevent form submission
                      onClick={handleDeletePeriod}
                      className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 bg-white border-2 border-red-400 text-red-500 rounded-full hover:bg-red-50 transition-all duration-200 shadow-lg transform hover:scale-110"
                      title="Remove day"
                    >
                      <FaTimes className="text-sm" />
                    </button>
                  )}
                </div>
              ))}

              {/* Add button */}
              {periodLength < maxLength && (
                <button
                  type="button" // Add type="button" to prevent form submission
                  onClick={handleAddPeriod}
                  className="flex items-center justify-center w-10 h-10 bg-white border-2 border-green-400 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 group"
                  title="Add day"
                >
                  <FaPlus className="text-green-500 text-xl group-hover:text-green-600 transition-colors duration-200" />
                </button>
              )}
            </div>

            {/* Help text */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Click <span className="font-semibold text-green-600">+</span> to
                add days
                {periodLength > minLength && (
                  <>
                    {" "}
                    or click{" "}
                    <span className="font-semibold text-red-500">×</span> to
                    remove
                  </>
                )}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Minimum {minLength} days • Maximum {maxLength} days
              </p>
            </div>
          </div>
          <div className="basis-[45%]">
            <label
              htmlFor="ovulation"
              className="block text-sm font-medium text-black lg:text-[#757575] mb-1"
            >
              <h4 className="text-base font-semibold text-gray-700 mb-3 flex items-center">
                Select your ovulation day
              </h4>
            </label>
            <input
              type="date"
              id="ovulation"
              name="ovulation"
              value={formData.ovulation}
              onChange={handleChange}
              max={
                new Date(
                  new Date(
                    cycle.ovulation_range[cycle.ovulation_range.length - 1]
                  ).getTime() + 172800000
                )
                  .toISOString()
                  .split("T")[0]
              }
              min={
                new Date(
                  new Date(cycle.ovulation_range[0]).getTime() - 172800000
                )
                  .toISOString()
                  .split("T")[0]
              }
              className={`border-solid border-[#C9CCCF] rounded-[10px] h-12 lg:h-10 p-3 w-full`}
            />
          </div>
          <div className="basis-full mt-4 text-center">
            <button
              type="button"
              onClick={handleUpdate}
              className={`${
                loading && "opacity-50 cursor-not-allowed"
              } px-6 py-3 text-white bg-primary hover:bg-opacity-90 rounded border-0`}
              disabled={loading}
            >
              {loading ? (
                <FaSpinner className="animate-spin text-white" />
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
        <div className="basis-full mt-3 text-center">
          <button
            type="button" // Add type="button" since it's not in the form
            onClick={handleDelete}
            className={`${
              loading && "opacity-50 cursor-not-allowed"
            } px-6 py-3 text-white bg-red-600 hover:bg-opacity-90 rounded border-0`}
            disabled={loading}
          >
            {loading ? (
              <FaSpinner className="animate-spin text-white" />
            ) : (
              "Delete Cycle"
            )}
          </button>
        </div>
        {message && (
          <DashboardToast message={message} setMessage={setMessage} />
        )}
      </div>
    </div>
  );
};

export default ModifyCycle;
