<<<<<<< HEAD
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
=======
import React from "react";
import logo from "../assets/logo_light.png";

import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";

function Footer() {
  return (
    <section className=" bg-footer-gradient w-full text-white flex flex-col justify-center items-start gap-8 text-left pt-10 pb-20">

      <div className=" flex flex-col justify-center items-start w-[90%] mx-auto gap-4">
        <img src={logo} alt="Ovidot logo" className="w-[10rem] h-[4rem]" />
        <p>
          Monitor your finances with ease and take control as an admin. Say
          goodbye to poor statistics and hello to a clear, and organized view of
          your business performance.
        </p>
        <p className=" font-bold">Stay Connected</p>
        <div className=" flex justify-between items-center text-xl gap-4">
          <a className=" text-white" href="/">
            <FaInstagram />
          </a>
          <a className=" text-white" href="/">
            <FaXTwitter />
          </a>
          <a className=" text-white" href="/">
            <FaFacebookF />
          </a>
        </div>
      </div>

      <div className=" flex flex-col gap-2 w-[90%] mx-auto">
        <h5 className=" text-xl font-bold">Support</h5>
        <ul className="list-none">
          <li>Help Center</li>
          <li>Contact Us</li>
        </ul>
      </div>

      <div className=" flex flex-col gap-2 w-[90%] mx-auto">
        <h5 className=" text-xl font-bold">Legal</h5>
        <ul className="list-none">
>>>>>>> refs/remotes/origin/development
          <li>Terms of Service</li>
          <li>Privacy Policy</li>
        </ul>
      </div>
<<<<<<< HEAD
      <div></div>
    </footer>
  )
}

export default Footer
=======

      
    </section>
  );
}

export default Footer;
>>>>>>> refs/remotes/origin/development
