import DashboadToast from "../Dashboard/DashboadToast";

const Error401 = ({ error , redirect}) => {
  return (
    <div className="relative flex flex-col justify-center items-center h-[calc(100dvh-64px)]">
      <DashboadToast message={error} />
      <button
        className="w-[120px] md:w-[90px] min-h-[50px] font-[500] text-xs text-white bg-primary border border-[#4D0B5E] rounded-[8px] font-[cabin] shadow-evenly hover:bg-[#4D0B5E] hover:text-white transition-colors duration-200 ease-in-out"
        onClick={redirect}
      >
        Sign In
      </button>
    </div>
  )
}

export default Error401