import { useState } from "react";
import { toast } from "react-toastify";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import sendCodeValidator from "../validators/sendCodeValidator";
import recoverPasswordValidator from "../validators/recoverPasswordValidator";

const initialFormData = {
  email: "",
  code: "",
  password: "",
};

const initialFormError = {
  code: "",
  password: "",
};

const ForgotPassword = () => {
  const [formData, setformData] = useState(initialFormData);
  const [formError, setFormError] = useState(initialFormError);
  const [loading, setloading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [hasEmail, setHasEmail] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setformData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSendCode = async (e) => {
    e.preventDefault();

    const errors = sendCodeValidator({ email: formData.email });

    if (errors.email) {
      setEmailError(errors.email);
    } else {
      try {
        setloading(true);

        // API request
        const response = await axios.post("/auth/forgot-password-code", {
          email: formData.email,
        });
        const data = response.data;
        setHasEmail(true);

        // Show success toast
        toast.success(data.message, {
          position: "top-right", // Correct position value
          autoClose: 3000, // Closes after 3 seconds (you can adjust)
        });
        setloading(false);
      } catch (error) {
        setloading(false);
        const response = error.response;
        const data = response
          ? response.data
          : { message: "An error occurred" };

        // Show error toast
        toast.error(data.message, {
          position: "top-right", // Correct position value
          autoClose: 3000,
        });
      }
    }
  };

  const handleRecoverPassword = async (e) => {
    e.preventDefault();

    const errors = recoverPasswordValidator({
      code: formData.code,
      password: formData.password,
    });

    if (errors.code || errors.password) {
      setFormError(errors);
    } else {
      try {
        setloading(true);

        // API request
        const response = await axios.post("/auth/recover-password", formData);
        const data = response.data;

        // Show success toast
        toast.success(data.message, {
          position: "top-right", // Correct position value
          autoClose: 3000, // Closes after 3 seconds (you can adjust)
        });

        setformData(initialFormData);
        setFormError(initialFormError);
        setloading(false);
        navigate("/login");
      } catch (error) {
        setloading(false);
        setFormError(initialFormError);
        const response = error.response;
        const data = response
          ? response.data
          : { message: "An error occurred" };

        // Show error toast
        toast.error(data.message, {
          position: "top-right", // Correct position value
          autoClose: 3000,
        });
      }
    }
  };

  return (
    <div className="form-container">
      <form
        className="inner-container"
        onSubmit={!hasEmail ? handleSendCode : handleRecoverPassword}
      >
        <h2 className="form-title">{`${!hasEmail ? "Recover Password" : "New Password"
          }`}</h2>

        {!hasEmail ? (
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
            {emailError && <p className="error">{emailError}</p>}
          </div>
        ) : (
          <>
            <div className="form-group">
              <label>Code</label>
              <input
                className="form-control"
                type="text"
                name="code"
                placeholder="123456"
                value={formData.code}
                onChange={handleChange}
              />
              {formError.code && <p className="error">{formError.code}</p>}
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                className="form-control"
                type="password"
                name="password"
                placeholder="***********"
                value={formData.password}
                onChange={handleChange}
              />
              {formError.password && (
                <p className="error">{formError.password}</p>
              )}
            </div>
          </>
        )}

        <div className="form-group">
          <input
            className="button"
            type="submit"
            value={`${loading ? "Sending..." : "Send"}`}
          />
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
