import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "../../utils/axiosInstance";
import addcategoryValidator from "../../validators/addCategoryValidator";

const initialFormData = {
  title: "",
  desc: "",
};

const initialFormError = {
  title: "",
};

const UpdateCategory = () => {
  const [formData, setformData] = useState(initialFormData);
  const [formError, setFormError] = useState(initialFormError);
  const [loading, setloading] = useState(false);

  const navigate = useNavigate();
  const params = useParams();
  const categoryId = params.id;

  useEffect(() => {
    if (categoryId) {
      const getCategory = async () => {
        try {
          //api request
          const response = await axios.get(`/category/${categoryId}`);
          const data = response.data.data;

          setformData({ title: data.category.title, desc: data.category.desc });

          console.log(data);
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
      getCategory();
    }
  }, [categoryId]);

  const handleChange = (e) => {
    setformData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  console.log(categoryId);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = addcategoryValidator({ title: formData.title });
    if (errors.title) {
      setFormError(errors);
    } else {
      try {
        setloading(true);
        // API request
        const response = await axios.put(`/category/${categoryId}`, formData);
        const data = response.data;
        // Show success toast
        toast.success(data.message, {
          position: "top-right",
          autoClose: 3000,
        });
        setformData(initialFormData);
        setFormError(initialFormError);
        setloading(false);
        navigate("/categories");
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
      <div className="form-container">
        <form className="inner-container" onSubmit={handleSubmit}>
          <h2 className="form-title">Update Category</h2>
          <div className="form-group">
            <label>Title</label>
            <input
              className="form-control"
              type="text"
              name="title"
              placeholder="Technology"
              value={formData.title}
              onChange={handleChange}
            />
            {formError.title && <p className="error">{formError.title}</p>}
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control"
              name="desc"
              placeholder="Lorem ipsum"
              value={formData.desc}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="form-group">
            <input className="button" type="submit" value={`${loading ? "Updating..." : "Update"}`} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCategory;
