import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import profilValidator from "../validators/profileValidator";

const initialFormData = {
  name: "",
  email: "",
};

const initialFormError = {
  name: "",
  email: "",
};

const Profile = () => {
  const [formData, setformData] = useState(initialFormData);
  const [formError, setFormError] = useState(initialFormError);
  const [loading, setloading] = useState(false);
  const [oldEmail, setOldEmail] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        //api request
        const response = await axios.get(`/auth/current-user`);
        const data = response.data.data;

        setformData({ name: data.user.name, email: data.user.email });
        setOldEmail(data.user.email);
      } catch (error) {
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
    };
    getUser();
  }, []);

  const handleChange = (e) => {
    setformData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = profilValidator({
      name: formData.name,
      email: formData.email,
    });

    if (errors.name || errors.email) {
      setFormError(errors);
    } else {
      try {
        setloading(true);

        // API request

        const response = await axios.put("/auth/update-profile", formData);
        const data = response.data;

        // Show success toast
        toast.success(data.message, {
          position: "top-right", // Correct position value
          autoClose: 3000, // Closes after 3 seconds (you can adjust)
        });
        setFormError(initialFormError);
        setloading(false);
        if (oldEmail !== formData.email) {
          window.localStorage.removeItem("blogData");
          navigate("/login");
        }
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
    // console.log(formData);
  };

  return (
    <div>
      <button className="button button-block" onClick={() => navigate(-1)}>
        Go Back
      </button>

      <div className="form-container">
        <form className="inner-container" onSubmit={handleSubmit}>
          <h2 className="form-title">Update profile</h2>
          <div className="form-group">
            <label>Name</label>
            <input
              className="form-control"
              type="text"
              name="name"
              placeholder="Ravi Sharma"
              value={formData.name}
              onChange={handleChange}
            />
            {formError.name && <p className="error">{formError.name}</p>}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              className="form-control"
              type="email"
              name="email"
              placeholder="abc@gmail.com"
              value={formData.email}
              onChange={handleChange}
            />
            {formError.email && <p className="error">{formError.email}</p>}
          </div>

          <div className="form-group">
            <input
              className="button"
              type="submit"
              value={`${loading ? "Updating..." : "Update"}`}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
