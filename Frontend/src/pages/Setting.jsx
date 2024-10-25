import { useState } from "react";
import { toast } from "react-toastify";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import changePasswordValidator from "../validators/changePasswordValidator";
import { useAuth } from "../components/context/AuthContext";

const initialFormData = {
  oldPassword: "",
  newPassword: "",
};

const initialFormError = {
  oldPassword: "",
  newPassword: "",
};

const Setting = () => {
  const [formData, setformData] = useState(initialFormData);
  const [formError, setFormError] = useState(initialFormError);
  const [loading, setloading] = useState(false);

  const navigate = useNavigate();
  const auth = useAuth();

  const handleChange = (e) => {
    setformData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = changePasswordValidator({
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
    });

    if (errors.oldPassword || errors.newPassword) {
      setFormError(errors);
    } else {
      try {
        setloading(true);

        // API request
        const response = await axios.put("/auth/change-password", formData);
        const data = response.data;
        // Show success toast
        toast.success(data.message, {
          position: "top-right",
          autoClose: 3000,
        });
        setformData(initialFormData);
        setFormError(initialFormError);
        setloading(false);
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
    <div>
      <button className="button button-block" onClick={() => navigate(-1)}>
        Go Back
      </button>

      {!auth.isVerified && (
        <button
          className="button button-block"
          onClick={() => navigate("/verify-user")}
        >
          Verify user
        </button>
      )}

      <div className="form-container">
        <form className="inner-container" onSubmit={handleSubmit}>
          <h2 className="form-title">Change Password</h2>
          <div className="form-group">
            <label>Old password</label>
            <input
              className="form-control"
              type="password"
              name="oldPassword"
              placeholder="***********"
              value={formData.oldPassword}
              onChange={handleChange}
            />
            {formError.oldPassword && (
              <p className="error">{formError.oldPassword}</p>
            )}
          </div>

          <div className="form-group">
            <label>New password</label>
            <input
              className="form-control"
              type="password"
              name="newPassword"
              placeholder="***********"
              value={formData.newPassword}
              onChange={handleChange}
            />
            {formError.newPassword && (
              <p className="error">{formError.newPassword}</p>
            )}
          </div>

          <div className="form-group">
            <input
              className="button"
              type="submit"
              value={`${loading ? "Changing..." : "Change"}`}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Setting;
