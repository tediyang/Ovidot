const DashboardToast = ({ message }) => {
  return (
    <div
      className={`fixed lg:ml-[15rem] inset-x-3 top-5 mt-12 p-4 rounded-lg text-center font-medium ${
        ['Successful', 'Created', 'Updated'].some(keyword => message.includes(keyword))
          ? "bg-green-100 text-green-800 border border-green-200"
          : "bg-red-100 text-red-800 border border-red-200"
      }`}
    >
      {message}
    </div>
  );
};

export default DashboardToast;
