import logo_light from "../assets/logo_light.png";
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="flex flex-col flex-wrap gap-2 bg-[linear-gradient(135deg,#4D0B5E,#0013FF)] -mx-5 md:-mx-8 lg:-mx-10 px-5 md:px-8 lg:px-10 py-10 text-white text-xs xl:items-center">
      <section className="flex flex-col xl:w-[78rem]">
        <div className="flex flex-col justify-between flex-wrap sm:flex-row gap-5 -mx-5 px-5 pb-10 text-white text-xs">
          <div className="flex flex-col gap-5 basis-1/12">
            <section className="flex flex-col gap-5">
              <img className="w-[85px] md:w-[90px]" src={logo_light} alt="ovidot"/>
              <p className="sm:w-80 text-sm lg:text-base">Monitor your period with ease and take control of your flow. Say goodbye to poor statistics and hello to a clear, and organized view of your menstration.</p>
            </section>
            <section className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebook size={20} color="#FFFFFF" className="transition-colors duration-50 ease-in hover:fill-[#4D0B5E]" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaXTwitter size={20} color="#FFFFFF" className="transition-colors duration-50 ease-in hover:fill-[#4D0B5E]" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram size={20} color="#FFFFFF" className="transition-colors duration-50 ease-in hover:fill-[#4D0B5E]" />
              </a>
            </section>
          </div>
          <div className=" flex flex-col gap-2 basis-1/12">
            <h5 className="text-xl font-bold">Links</h5>
            <ul className="flex flex-col gap-1 text-sm lg:text-base list-none">
              <li>Home</li>
              <li>About</li>
              <li>Help</li>
              <li>Contact</li>
            </ul>
          </div>
          <div className=" flex flex-col gap-2 basis-1/12">
            <h5 className=" text-xl font-bold">Support</h5>
            <ul className="flex flex-col gap-1 text-sm lg:text-base list-none">
              <li>FAQ</li>
            </ul>
          </div>
          <div className=" flex flex-col gap-2 basis-1/12">
            <h5 className="text-xl font-bold">Legal</h5>
            <ul className="flex flex-col gap-1 text-sm lg:text-base list-none">
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
        </div>
        <div>
          <p className="text-sm lg:text-base">© {year} ImadeCorps. All rights reserved.</p>
        </div>
      </section>
    </footer>
  )
}

export default Footer;
