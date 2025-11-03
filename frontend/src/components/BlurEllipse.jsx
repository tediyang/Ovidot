import { PropTypes } from "prop-types";

const BlurEllipse = (props) => {
  const { position } = props;

  return (
    <div className={`hidden sm:block absolute ${position} h-[200px] w-[200px] blur-ellipse`}></div>
  )
}

BlurEllipse.propTypes = {
  position: PropTypes.string.isRequired
}

export default BlurEllipse;
