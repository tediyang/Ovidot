import ovary from "../assets/ovary.png"


const OvidotLoader = () => {
  const size = "w-16 h-16";
  return (
    <div className="flex justify-center items-center h-[100dvh]">
      <img
        src={ovary}
        alt="Loading..."
        // alt={alt}
        // Apply the built-in Tailwind pulse animation.
        className={`animate-pulse rounded-full fill-primary ${size}`}
      />
    </div>
  );
};

export default OvidotLoader;
