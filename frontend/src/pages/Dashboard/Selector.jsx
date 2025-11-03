import { useState } from 'react';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { apiService } from '../../services/api';
import NotificationToast from "../../components/NotificationToast"; 

const Selector = ({ setUserAction }) => {
  const [selectedValue, setSelectedValue] = useState(2);
  const [errorMessage, setErrorMessage] = useState(null);
  const periods = [2, 3, 4, 5, 6, 7, 8];
  const itemHeight = 48;

  // Find the current index of the selected value
  const currentIndex = periods.indexOf(selectedValue);

  // Handle scrolling up (decreasing the index)
  const handleScrollUp = () => {
    setSelectedValue(prevValue => {
      const currentIdx = periods.indexOf(prevValue);
      return periods[Math.max(0, currentIdx - 1)];
    });
  };

  // Handle scrolling down (increasing the index)
  const handleScrollDown = () => {
    setSelectedValue(prevValue => {
      const currentIdx = periods.indexOf(prevValue);
      return periods[Math.min(periods.length - 1, currentIdx + 1)];
    });
  };

  const handleNext = async () => {
    // Update period then redirect to dashboard
    // Api Call
    try {
      await apiService.putData('/auth/users/update', null, {
        period: selectedValue
      });
    } catch (error) {
      console.log(error)
      setErrorMessage("Failed to set period. Try from your profile.");
    } finally {
      setTimeout(() => {
        setUserAction(true);
      }, 2000);
    }
  }

  const handleNotSure = () => {
    // set user action to true to prevent redirect loop
    setUserAction(true);
  }

  return (
    <div className="absolute lg:relative basis-1/2 flex flex-col lg:justify-center lg:items-center gap-4 max-h-full overflow-y-auto lg:min-h-[42.5rem] w-full lg:max-w-[50rem] xl:rounded-tr-3xl xl:rounded-br-3xl bg-white p-4 sm:px-8 lg:px-32 py-8 font-['Cabin'] z-10">
      <div className='text-center w-full'>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Select your Average Period Length
        </h2>
        <p className="text-sm text-gray-600 mb-8">
          If you are unsure of your period length or if it is irregular, then tap on <span className='text-primary'>"Not Sure"</span> Button. But you'll need one to create a cycle.
        </p>
        <div className="flex flex-col items-center justify-center my-10 space-y-4">
          <button
            onClick={handleScrollUp}
            disabled={selectedValue === 2}
            className="flex items-center justify-center w-10 h-10 bg-primary border-none rounded-full text-2xl text-white transition-colors duration-200 hover:bg-[#4D0B5E90] disabled:text-white disabled:bg-gray-200 disabled:cursor-not-allowed"
          >
            <FaChevronUp className="w-6 h-6" />
          </button>
          <div className="h-16 w-24 overflow-hidden relative">
            <div
              className="absolute w-full transition-transform duration-300 ease-in-out"
              style={{ transform: `translateY(-${currentIndex * itemHeight}px)` }}
            >
              {periods.map((period) => (
                <div
                  key={period}
                  className={`flex items-center justify-center my-2 h-10 text-3xl font-bold transition-all duration-300 ${period === selectedValue ? 'text-purple-700 scale-125' : 'text-gray-400 opacity-50'}`}
                >
                  {period}
                </div>
              ))}
            </div>
          </div>
          <button 
            onClick={handleScrollDown} 
            disabled={selectedValue === 8}
            className="flex items-center justify-center w-10 h-10 bg-primary border-none rounded-full text-2xl text-white transition-colors duration-200 hover:bg-[#4D0B5E90] disabled:text-white disabled:bg-gray-200 disabled:cursor-not-allowed"
          >
            <FaChevronDown className="w-6 h-6" />
          </button>
        </div>
        <div className='flex flex-col gap-6'>
          <button
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-primary hover:bg-[#4D0B5E90] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 ease-in-out transform hover:-translate-y-0.5"
            onClick={handleNext}
          >
            Next
          </button>
          <button
            className="w-full flex justify-center py-3 px-4 border-solid border-[#00000020] rounded-lg text-lg font-semibold text-black bg-white hover:bg-gray-200 transition duration-200 ease-in-out transform hover:-translate-y-0.5"
            onClick={handleNotSure}
          >
            Not Sure
          </button>
        </div>
      </div>
      {/* Display submission message */}
      {errorMessage &&
        NotificationToast({ errorMessage })}
    </div>
  );
}

export default Selector;