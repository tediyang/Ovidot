import Forms from "./SignupForm";
import SigninImage from "../../components/SigninImage";

const Signup = () => {
  return (
    <div className="flex justify-center items-center h-[100dvh] bg-primary">
      <section className="flex flex-col lg:flex-row justify-center items-center relative bg-[#4D0B5E] h-[100dvh] overflow-hidden">
        <SigninImage />
        <Forms />
      </section>
    </div>
  );
};

export default Signup;
