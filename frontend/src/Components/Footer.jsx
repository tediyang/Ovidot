import logo_light from "../assets/logo_light.png";
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
  return (
    <footer className="flex flex-col gap-3 bg-[linear-gradient(135deg,#4D0B5E,#0013FF)] -mx-5 px-5 py-10 text-white text-xs">
      <div className="flex flex-col gap-5">
        <img className="w-3/12" src={logo_light} alt="ovidot"/>
        <p>Monitor your period with ease and take control of your flow. Say goodbye to poor statistics and hello to a clear, and organized view of your menstration.</p>
      </div>
      <div className="flex gap-3">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <FaFacebook size={20} color="#FFFFFF" />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <FaXTwitter size={20} color="#FFFFFF" />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <FaInstagram size={20} color="#FFFFFF" />
        </a>
      </div>
      <div>
        <h3>Support</h3>
        <ul>
          <li>FAQ</li>
          <li>Contact Us</li>
        </ul>
      </div>
      <div>
        <h3>Legal</h3>
        <ul>
          <li>Terms of Service</li>
          <li>Privacy Policy</li>
        </ul>
      </div>
      <div></div>
    </footer>
  )
}

export default Footer