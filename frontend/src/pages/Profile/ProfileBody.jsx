import AsideMenu from "../../components/AsideMenu";
import Error401 from "../Errors/Error401";
import DashboardToast from "../Dashboard/DashboadToast";
import { formatDate } from "../../utility/helper";
import { apiService } from "../../services/api";
import { FaPen, FaLock } from "react-icons/fa";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";


const ProfileBody = ({ user, setUser, error, redirect }) => {
  const [sensitive, setSensitive] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fname: user?.name.fname || "",
    lname: user?.name.lname || "",
    dob: formatDate(user?.dob) || "",
    username: user?.username || "",
    phone: user?.phone || "",
    period: user?.period || "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "period") {
      // Ensure period is within the valid range
      let periodValue = parseInt(value, 10);
      if (isNaN(periodValue)) {
        periodValue = "";
      } else if (periodValue < 2) {
        periodValue = 2;
      } else if (periodValue > 8) {
        periodValue = 8;
      }
      setFormData((prevData) => ({
        ...prevData,
        period: periodValue,
      }));
    }
  };

  const cancelButton = () => {
    setSensitive(false);

    setFormData((prevData) => ({
      ...prevData,
      password: "",
    }));
  };

  const timeOutMessage = () => {
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // if phone is changed and not empty, user should provide password to verify
    if (
      formData.phone !== user?.phone &&
      formData.phone.trim() !== "" &&
      formData.password.trim() === ""
    ) {
      setSensitive(true);
      return;
    }

    // set loading
    setLoading(true);

    const toSubmit = {};

    // Only include fields that have changed
    if (formData.fname && formData.fname !== user?.name.fname) {
      toSubmit.fname = formData.fname;
    }
    if (formData.lname && formData.lname !== user?.name.lname) {
      toSubmit.lname = formData.lname;
    }
    if (formData.dob && formData.dob !== formatDate(user?.dob)) {
      toSubmit.dob = formData.dob;
    }
    if (formData.username && formData.username !== user?.username) {
      toSubmit.username = formData.username;
    }
    if (formData.period && formData.period !== user?.period) {
      toSubmit.period = formData.period;
    }
    if (formData.password) {
      toSubmit.sensitive.phone = formData.phone;
      toSubmit.password = formData.password;
    }

    // check if data is empty
    if (Object.keys(toSubmit).length === 0) {
      setLoading(false);
      setMessage("Please enter new data to update");
      timeOutMessage();
      return;
    }

    // send request
    const sendRequest = async () => {
      try {
        const response = await apiService.putData(
          "/auth/users/update",
          null,
          toSubmit
        );
        if (response && response.message.includes("successful")) {
          // Optionally redirect to another page or reset the form
          // For example, redirect to sign-in page after successful signup
          setMessage("Update Successful");
          setLoading(false);
          setUser(response.user);
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
    <>
      {error ? (
        <Error401 error={error} redirect={redirect} />
      ) : (
        <div className="flex flex-col relative lg:flex-row lg:justify-center lg:gap-5">
          <AsideMenu />
          <div className="relative flex flex-col rounded bg-white m-4 mt-14 p-4 lg:min-w-[45rem] xl:min-w-[62rem] lg:ml-[16rem]">
            <section className="flex justify-center items-center mt-5">
              <div className="w-32 h-32 rounded-full bg-primary text-white">
                <h2 className="flex justify-center items-center h-full text-4xl font-[700]">
                  {user?.name.fname[0].toUpperCase() +
                    user?.name.lname[0]?.toUpperCase()}
                </h2>
              </div>
            </section>
            <section>
              <form
                className="flex flex-col mt-2 gap-6"
                onSubmit={handleSubmit}
              >
                <section>
                  <div className="mt-6">
                    <h3 className="text-lg font-[500] text-primary mb-3">
                      Personal Data
                    </h3>
                    <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <label className="flex items-center gap-2 mb-2 font-[500] text-sm">
                          <p>First Name</p>
                          <FaPen size={10} />
                        </label>
                        <input
                          type="text"
                          name="fname"
                          value={formData.fname}
                          onChange={handleChange}
                          className="p-2 border border-solid border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="flex items-center gap-2 mb-2 font-[500] text-sm ">
                          <p>Last Name</p>
                          <FaPen size={10} />
                        </label>
                        <input
                          type="text"
                          name="lname"
                          value={formData.lname}
                          onChange={handleChange}
                          className="p-2 border border-solid border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="flex items-center gap-2 mb-2 font-[500] text-sm ">
                          <p>Username</p>
                          <FaPen size={10} />
                        </label>
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          className="p-2 border border-solid border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="flex items-center gap-2 mb-2 font-[500] text-sm ">
                          <p>Email</p>
                          <FaLock size={10} />
                        </label>
                        <input
                          type="email"
                          value={user?.email}
                          readOnly
                          className="p-2 border border-solid border-gray-300 text-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="flex items-center gap-2 mb-2 font-[500] text-sm ">
                          <p>Phone Number</p>
                          <FaPen size={10} />
                        </label>
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="p-2 border border-solid border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="flex items-center gap-2 mb-2 font-[500] text-sm ">
                          <p>Date of Birth</p>
                          <FaPen size={10} />
                        </label>
                        <input
                          type="date"
                          name="dob"
                          value={formData.dob}
                          onChange={handleChange}
                          className="p-2 border border-solid border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </section>
                  </div>
                  <div className="mt-6">
                    <h3 className="text-lg font-[500] text-primary mb-3">
                      Cycle Data
                    </h3>
                    <div className="flex flex-col">
                      <label className="flex items-center gap-2 mb-2 font-[500] text-sm ">
                        <p>Period Length (in days)</p>
                        <FaPen size={10} />
                      </label>
                      <input
                        type="number"
                        name="period"
                        value={formData.period}
                        onChange={handleChange}
                        className="p-2 border border-solid border-gray-500 rounded md:w-1/2 focus:outline-none focus:ring-2 focus:ring-primary"
                        min={2}
                        max={8}
                      />
                    </div>
                  </div>
                  {sensitive && (
                    <div className="fixed inset-0 h-[100dvh] flex flex-col items-center justify-center bg-white bg-opacity-80 p-4 z-10">
                      <div className="bg-white p-6 rounded-3xl shadow-2xl">
                        <p className="text-sm text-gray-500 mt-2">
                          To change phone number, please enter your password for
                          verification.
                        </p>
                        <label className="flex items-center gap-2 mb-2 font-[500] text-sm mt-2">
                          <p>Password</p>
                        </label>
                        <input
                          type="password"
                          name="password"
                          onChange={handleChange}
                          className="p-2 border border-solid border-gray-500 rounded w-full focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <div className="flex gap-4 mt-4">
                          <button
                            type="submit"
                            className={`${
                              loading && "opacity-50 cursor-not-allowed"
                            } px-6 py-3 text-white bg-primary hover:bg-opacity-90 rounded border-0`}
                            onClick={handleSubmit}
                            disabled={loading}
                          >
                            {loading ? (
                              <FaSpinner className="animate-spin text-white" />
                            ) : (
                              "Save"
                            )}
                          </button>
                          <button
                            type="button"
                            className="px-6 py-3 text-primary bg-white hover:bg-opacity-0 rounded border-0"
                            onClick={cancelButton}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </section>
                <section className="flex justify-center">
                  <button
                    type="submit"
                    className={`${
                      loading && "opacity-50 cursor-not-allowed"
                    } px-6 py-3 text-white bg-primary hover:bg-opacity-90 rounded border-0`}
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <FaSpinner className="animate-spin text-white" />
                    ) : (
                      "Save"
                    )}
                  </button>
                </section>
              </form>
            </section>
          </div>
          {message && (
            <DashboardToast message={message} setMessage={setMessage} />
          )}
        </div>
      )}
    </>
  );
};

export default ProfileBody;
