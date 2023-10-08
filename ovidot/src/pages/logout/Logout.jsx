import { useState } from "react";
import { Link } from "react-router-dom";
import "./logout.css";
import FormInput from "../../components/FormInput";

const Register = () => {
  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const inputs = [
    {
      id: 1,
      name: "username",
      type: "text",
      placeholder: "Username",
      label: "Username",
      required: true,
    },
    {
      id: 2,
      name: "password",
      type: "password",
      placeholder: "Password",
      errorMessage:
        "Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!",
      label: "Password",
      pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$`,
      required: true,
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  fetch('http://127.0.0.1:5000/api/v1/auth/logout [Auth: Bearer Token]', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(values)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    // Handle response data
    console.log(data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <div className="register">
      <form1 onSubmit={handleSubmit}>
        <h1>Logout</h1>
        {inputs.map((input) => (
          <FormInput
            key={input.id}
            {...input}
            value={values[input.name]}
            onChange={onChange}
          />
        ))}
        <Link to="/" className="buttonn">LOG OUT </Link>
        <p></p>
      </form1>
    </div>
  );
};

export default Register;