import logo_light from "../assets/logo_light.png";
import cycleImage from "../assets/signup/cycle.png";

const SigninImage = () => {
  return (
    <div
      className="lg:basis-1/2 flex flex-col justify-center items-center relative bg-cover bg-center bg-no-repeat min-h-full lg:min-h-[42.5rem] xl:rounded-tl-3xl xl:rounded-bl-3xl w-[100dvw] lg:max-w-[55rem]"
      style={{ backgroundImage: `url(${cycleImage})` }}
    >
      <img src={logo_light} alt="logo" className="w-[100px] lg:w-[120px] xl:w-[150px] z-10 opacity-50 lg:opacity-100" />
      {/* overlay */}
      <div className="absolute inset-0 bg-black opacity-80 xl:rounded-tl-3xl xl:rounded-bl-3xl"></div>
    </div>
  )
}

export default SigninImage;
