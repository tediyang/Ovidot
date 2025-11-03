import { FaTimes, FaSpinner } from "react-icons/fa";

const DayButton = ({
  day,
  type,
  isSelected = false,
  isHighlighted = false,
}) => {
  let baseClasses =
    "w-10 h-10 flex items-center justify-center rounded-lg font-semibold cursor-pointer transition duration-150 relative shadow-sm";
  let colorClasses = "";
  let dot = null;

  // Determine styling based on the section (type) and state (highlighted/selected)
  switch (type) {
    case "period":
      if (isHighlighted) {
        // Dark purple for the specifically highlighted day (14 in the image)
        colorClasses = "bg-purple-900 text-white shadow-md";
      } else {
        // Light purple for other period days
        colorClasses = "bg-purple-200 text-purple-800 hover:bg-purple-300";
      }
      if (isSelected) {
        // Green dot for selected period days
        dot = (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        );
      }
      break;

    case "fertile":
      // Light blue for fertile window days
      colorClasses = "bg-blue-100 text-blue-600 hover:bg-blue-200";
      break;

    case "ovulation":
      // Light orange/yellow for ovulation days
      colorClasses = "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      break;

    default:
      colorClasses = "bg-gray-100 text-gray-800";
  }

  return (
    <div className={`${baseClasses} ${colorClasses}`}>
      {day}
      {dot}
    </div>
  );
};

const ModifyCycle = ({ user, setModifyCycle }) => {
  // Mock data representing the days shown in the image
  const periodDays = [11, 12, 13, 14, 15, 16, 17];
  const ovulationDays = [24, 25, 26, 27, 28];

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="fixed flex justify-center items-center h-[100dvh] w-full -mt-2 bg-white bg-opacity-90 z-10">
      <div className="flex flex-col h-[25rem] w-[20rem] bg-white rounded-xl p-4 shadow-lg">
        <FaTimes className="self-end cursor-pointer" onClick={setModifyCycle} />
        <h2 className="text-xl font-medium text-gray-800 mb-2">
          Edit your Period Days
        </h2>
        <p className="text-sm text-gray-500">
          If the ovulation or period days predicted are incorrect, you can
          modify them here.
        </p>
        <form
          className="flex flex-col gap-4 mt-4"
          onSubmit={handleSubmit}
          noValidate
        >
          <div>
            <h3 className="text-base font-semibold text-gray-700 mb-3 flex items-center">
              Select your Period Length
              <span className="ml-2 text-purple-700">✏️</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {periodDays.map((day) => (
                <DayButton
                  key={day}
                  day={day}
                  type="period"
                  isSelected={true} // All days have the green dot in the image
                  isHighlighted={day === 14} // Day 14 is dark purple
                />
              ))}
            </div>
          </div>
          <div className="basis-[45%]">
            <label
              htmlFor="startdate"
              className="block text-sm font-medium text-black lg:text-[#757575] mb-1"
            >
              Select your Ovulation Day
            </label>
            <input
              type="date"
              id="startdate"
              name="startdate"
              // value={}
              // onChange={}
              max={new Date().toISOString().split("T")[0]} // Set max date to today
              className={`border-solid border-[#C9CCCF] rounded-[10px] h-12 lg:h-10 p-3 w-full`}
              required
            />
          </div>
          <button className="w-full py-3 bg-purple-800 text-white font-semibold rounded-lg shadow-lg hover:bg-purple-900 transition duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModifyCycle;
