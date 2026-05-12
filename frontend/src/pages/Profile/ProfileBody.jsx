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
        if (response && response.data.message.includes("successful")) {
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
          <AsideMenu user={user} />
          <div className="m-4 mt-14 lg:min-w-[45rem] xl:min-w-[62rem] lg:ml-[16rem]">
            <div className="bg-white rounded-2xl shadow-[0_2px_20px_rgba(77,11,94,0.08)]">
              {/* Avatar + identity header */}
              <div className="flex flex-col items-center pt-8 pb-4 text-center px-6">
                <div className="w-24 h-24 rounded-full bg-primary text-white shadow-[0_4px_16px_rgba(77,11,94,0.25)] flex items-center justify-center text-3xl font-extrabold">
                  {user?.name.fname[0].toUpperCase() + user?.name.lname[0]?.toUpperCase()}
                </div>
                <h3 className="mt-3 text-lg font-bold text-gray-800">
                  {user?.name.fname[0].toUpperCase() + user?.name.fname.slice(1)}{" "}
                  {user?.name.lname[0].toUpperCase() + user?.name.lname.slice(1)}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">@{user?.username} · {user?.email}</p>
              </div>

            <section className="px-6 pb-6">
              <form
                className="flex flex-col gap-6"
                onSubmit={handleSubmit}
              >
                <section>
                  <div className="mt-2">
                    {/* Section header */}
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-sm font-bold text-primary whitespace-nowrap">Personal Data</h3>
                      <div className="flex-1 h-px bg-[#f3e8ff]" />
                    </div>
                    <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <label className="flex items-center gap-1.5 mb-1.5 font-semibold text-xs text-gray-500">
                          First Name <FaPen size={9} />
                        </label>
                        <input
                          type="text"
                          name="fname"
                          value={formData.fname}
                          onChange={handleChange}
                          className="px-3 py-2.5 border-[1.5px] border-solid border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="flex items-center gap-1.5 mb-1.5 font-semibold text-xs text-gray-500">
                          Last Name <FaPen size={9} />
                        </label>
                        <input
                          type="text"
                          name="lname"
                          value={formData.lname}
                          onChange={handleChange}
                          className="px-3 py-2.5 border-[1.5px] border-solid border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="flex items-center gap-1.5 mb-1.5 font-semibold text-xs text-gray-500">
                          Username <FaPen size={9} />
                        </label>
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          className="px-3 py-2.5 border-[1.5px] border-solid border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="flex items-center gap-1.5 mb-1.5 font-semibold text-xs text-gray-500">
                          Email <FaLock size={9} className="text-gray-300" />
                        </label>
                        <input
                          type="email"
                          value={user?.email}
                          readOnly
                          className="px-3 py-2.5 border-[1.5px] border-solid border-gray-100 rounded-xl text-sm text-gray-400 bg-gray-50 focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="flex items-center gap-1.5 mb-1.5 font-semibold text-xs text-gray-500">
                          Phone Number <FaPen size={9} />
                        </label>
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="px-3 py-2.5 border-[1.5px] border-solid border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="flex items-center gap-1.5 mb-1.5 font-semibold text-xs text-gray-500">
                          Date of Birth <FaPen size={9} />
                        </label>
                        <input
                          type="date"
                          name="dob"
                          value={formData.dob}
                          onChange={handleChange}
                          className="px-3 py-2.5 border-[1.5px] border-solid border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors"
                        />
                      </div>
                    </section>
                  </div>
                  <div className="mt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-sm font-bold text-primary whitespace-nowrap">Cycle Data</h3>
                      <div className="flex-1 h-px bg-[#f3e8ff]" />
                    </div>
                    <div className="flex flex-col">
                      <label className="flex items-center gap-1.5 mb-1.5 font-semibold text-xs text-gray-500">
                        Period Length (in days) <FaPen size={9} />
                      </label>
                      <input
                        type="number"
                        name="period"
                        value={formData.period}
                        onChange={handleChange}
                        className="px-3 py-2.5 border-[1.5px] border-solid border-gray-200 rounded-xl text-sm md:w-1/2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors"
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
                          className="px-3 py-2.5 border-[1.5px] border-solid border-gray-200 rounded-xl w-full text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors"
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
                <section className="flex justify-center pt-2">
                  <button
                    type="submit"
                    className={`${
                      loading && "opacity-50 cursor-not-allowed"
                    } px-10 py-3 text-white bg-primary hover:opacity-90 rounded-xl border-0 font-semibold text-sm shadow-[0_4px_14px_rgba(77,11,94,0.25)] transition-opacity`}
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <FaSpinner className="animate-spin text-white" />
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </section>
              </form>
            </section>
            </div> {/* /white card */}
          </div> {/* /outer wrapper */}
          {message && (
            <DashboardToast message={message} setMessage={setMessage} />
          )}
        </div>
      )}
    </>
  );
};

export default ProfileBody;
