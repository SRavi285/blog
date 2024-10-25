import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "../../utils/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import addPostValidator from "../../validators/addPostValidator";

const initialFormData = {
  title: "",
  desc: "",
  category: "",
};

const initialFormError = {
  title: "",
  category: "",
};

const UpdatePost = () => {
  const [formData, setformData] = useState(initialFormData);
  const [formError, setFormError] = useState(initialFormError);
  const [loading, setloading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [extensionError, setExtensionError] = useState(null);
  const [fileId, setFileId] = useState(null);
  const [isDiseable, setIsDiseable] = useState(false);

  const navigate = useNavigate();
  const params = useParams();
  const postId = params.id;

  useEffect(() => {
    if (postId) {
      const getpost = async () => {
        try {
          //api request
          const response = await axios.get(`/posts/${postId}`);
          const data = response.data.data;

          setformData({
            title: data.post.title,
            desc: data.post.desc,
            category: data.post.category._id,
            file: data?.post?.file?._id,
          });

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
      getpost();
    }
  }, [postId]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        //api request
        const response = await axios.get(`/category?size=1000`);
        const data = response.data.data;
        setCategories(data.categories);
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
    getCategories();
  }, []);

  const handleChange = (e) => {
    setformData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = addPostValidator({ title: formData.title, category: formData.category });
    if (errors.title || errors.category) {
      setFormError(errors);
    } else {
      try {
        setloading(true);

        let input = formData;

        if (fileId) {
          input = { ...input, file: fileId }
        }
        // API request
        const response = await axios.put(`/posts/${postId}`, input);
        const data = response.data;
        // Show success toast
        toast.success(data.message, {
          position: "top-right",
          autoClose: 3000,
        });
        setformData(initialFormData);
        setFormError(initialFormError);
        setloading(false);
        navigate(`/posts/detail-post/${postId}`);
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

  const handleFileChange = async (e) => {
    console.log(e.target.files);

    const formInput = new FormData();
    formInput.append("image", e.target.files[0]);

    const type = e.target.files[0].type;

    if (type === "image/png" || type === "image/jpg" || type === "image/jpeg") {
      setExtensionError(null);

      try {
        setIsDiseable(true);
        // API request
        const response = await axios.post("/file/upload", formInput);
        const data = response.data;
        setFileId(data.data._id);

        console.log(data);
        // Show success toast
        toast.success(data.message, {
          position: "top-right",
          autoClose: 3000,
        });
        setIsDiseable(false);
      } catch (error) {
        setIsDiseable(false);
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
    } else {
      setExtensionError("Only .png or .jpeg or jpg files are supported");
    }
  };

  return (
    <div>
      <button className="button button-block" onClick={() => navigate(-1)}>
        Go Back
      </button>
      <div className="form-container">
        <form className="inner-container" onSubmit={handleSubmit}>
          <h2 className="form-title">Update Post</h2>
          <div className="form-group">
            <label>Title</label>
            <input
              className="form-control"
              type="text"
              name="title"
              placeholder="React blog post"
              value={formData.title}
              onChange={handleChange}
            />
            {formError.title && <p className="error">{formError.title}</p>}
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control"
              type="text"
              name="desc"
              placeholder="Lorem ipsum"
              value={formData.desc}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="form-group">
            <label>Select an image</label>
            <input
              className="form-control"
              type="file"
              name="file"
              placeholder="Lorem ipsum"
              onChange={handleFileChange}
            />
            {extensionError && <p className="error">{extensionError}</p>}
          </div>

          <div className="form-group">
            <label>Select a category</label>
            <select
              className="form-control"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.title}
                </option>
              ))}
            </select>
            {formError.category && <p className="error">{formError.category}</p>}
          </div>

          <div className="form-group">
            <input className="button" type="submit" disabled={isDiseable} value={`${loading ? "Updateing.." : "Update"}`} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePost;
