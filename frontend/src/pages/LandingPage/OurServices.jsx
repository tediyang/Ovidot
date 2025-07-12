import React from "react";
import predictionsIcon from "../../assets/landing-page/predictions.png";
import dataIcon from "../../assets/landing-page/data-science.png";
import controlIcon from "../../assets/landing-page/control.png";
import privacyIcon from "../../assets/landing-page/privacy.png";

function OurServices() {
  const services = [
    {
      id: 1,
      title: "Accurate Predictions",
      content:
        "Your predictions get more accurate every time you track and log in.",
      icon: predictionsIcon,
      color: "#0013FF",
    },
    {
      id: 2,
      title: "Up to Date Science",
      content:
        "Get predictions based on the most up to date science and research.",
      icon: dataIcon,
      color: "#FF9900",
    },
    {
      id: 3,
      title: "Take Control",
      content:
        "Offers a variety of tools to help you stay on top of your cycle.",
      icon: controlIcon,
      color: "#FF000F",
    },
    {
      id: 4,
      title: "Privacy",
      content:
        "We will never share your health data with any company but Ovidot.",
      icon: privacyIcon,
      color: "#00E752",
    },
  ];

  return (
    <section className=" w-[80%] mx-auto my-16 flex flex-col gap-10">
      {/* top row */}
      {services.map((service) => (
        <div key={service.id} className="border rounded-[0.6rem] bg-primary bg-opacity-5 px-6 pt-8 pb-10 text-left ">
          <div className={` bg-[${service.color}] rounded-[0.4rem] inline-flex items-center justify-center p-2 mb-4`}>
            <img src={service.icon} alt="icon" className="size-[2.5rem]" />
          </div>
          <h2 className=" mb-2">{service.title}</h2>
          <p className=" text-xl text-[#3F404AB2] text-opacity-70">{service.content}</p>
        </div>
      ))}

    </section>
  );
}

export default OurServices;
