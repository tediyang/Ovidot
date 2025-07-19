import predictionsIcon from "../../assets/landing-page/predictions.png";
import dataIcon from "../../assets/landing-page/data-science.png";
import controlIcon from "../../assets/landing-page/control.png";
import privacyIcon from "../../assets/landing-page/privacy.png";

const OurServices = () => {
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
    <div className="flex flex-col md:flex-row md:flex-wrap md:justify-center w-[80%] lg:w-full mx-auto my-16 gap-10">
      {/* top row */}
      {services.map((service) => (
        <div
          key={service.id}
          className="md:basis-2/5 lg:basis-1/5 lg:max-w-[17rem] border rounded-[0.6rem] bg-primary bg-opacity-5 px-6 pt-8 pb-10 text-left shadow-[2.52px_2.52px_12.6px_0px_#8BA9C6]"
        >
          <div
            className={`bg-[${service.color}] rounded-[0.4rem] inline-flex items-center justify-center p-2 mb-4`}
          >
            <img src={service.icon} alt="icon" className="size-[2.5rem]" />
          </div>
          <h3 className="mb-2">{service.title}</h3>
          <p className=" text-sm lg:text-base text-[#3F404AB2] text-opacity-70">
            {service.content}
          </p>
        </div>
      ))}
    </div>
  );
}

export default OurServices;
