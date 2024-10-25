import { useState } from "react";
import { toast } from "react-toastify";
import axios from "../utils/axiosInstance";
import loginValidator from "../validators/loginValidator";
import { useNavigate, Link } from "react-router-dom";


const initialFormData = {
  email: "",
  password: "",
};

const initialFormError = {
  email: "",
  password: "",
};

const Login = () => {
  const [formData, setformData] = useState(initialFormData);
  const [formError, setFormError] = useState(initialFormError);
  const [loading, setloading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setformData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = loginValidator({
      email: formData.email,
      password: formData.password,
    });

    if (errors.email || errors.password) {
      setFormError(errors);
    } else {
      try {
        setloading(true);

        // API request
        const response = await axios.post("/auth/signin", formData);
        const data = response.data;

        window.localStorage.setItem("blogData", JSON.stringify(data.data));

        // Show success toast
        toast.success(data.message, {
          position: "top-right",
          autoClose: 3000,
        });
        setformData(initialFormData);
        setFormError(initialFormError);
        setloading(false);
        navigate("/");
      } catch (error) {
        setloading(false);
        const response = error.response;
        const data = response
          ? response.data
          : { message: "An error occurred" };
        // Show error toast
        toast.error(data.message, {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  return (
    <div className="form-container">
      <form className="inner-container" onSubmit={handleSubmit}>
        <h2 className="form-title">Login Form</h2>

        <div className="form-group">
          <label>Email</label>
          <input
            className="form-control"
            type="text"
            name="email"
            placeholder="abc@gmail.com"
            value={formData.email}
            onChange={handleChange}
          />
          {formError.email && <p className="error">{formError.email}</p>}
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            className="form-control"
            type="password"
            name="password"
            placeholder="***********"
            value={formData.password}
            onChange={handleChange}
          />
          {formError.password && <p className="error">{formError.password}</p>}
        </div>

        <Link className="forgot-password" to="/forgot-password">Forgot Password</Link>

        <div className="form-group">
          <input
            className="button"
            type="submit"
            value={`${loading ? "Loging..." : "Login"}`}
          />
        </div>
      </form>
    </div>
  );
};

export default Login;
