import logo from "../assets/logo.png";

const Header = () => {
  return (
    <div className="flex justify-between items-center my-5">
      <img className="w-[22%]" src={logo} alt="ovidot" />
      <button className="w-3/12 min-h-[30px] font-[500] text-xs text-[#4D0B5E] bg-white border border-[#4D0B5E] rounded-[8px] font-[cabin] shadow-evenly">
        Sign In
      </button>
    </div>
  );
};

export default Header;
