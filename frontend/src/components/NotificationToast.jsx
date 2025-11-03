import PropTypes from "prop-types";

const NotificationToast = (props) => {
  const { submissionMessage } = props;
  return (
    <div
      className={`absolute inset-x-3 lg:top-0 mt-6 p-4 rounded-lg text-center font-medium ${
        submissionMessage.includes("Successful")
          ? "bg-green-100 text-green-800 border border-green-200"
          : "bg-red-100 text-red-800 border border-red-200"
      }`}
    >
      {submissionMessage}
    </div>
  );
};

NotificationToast.propTypes = {
  submissionMessage: PropTypes.string.isRequired,
};

export default NotificationToast;
