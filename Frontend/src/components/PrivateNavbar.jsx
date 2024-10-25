import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "./context/AuthContext";

const PrivateNavbar = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  const handleLogout = () => {
    window.localStorage.removeItem("blogData");
    toast.success("Logout Succefull !", {
      position: "top-right",
      autoClose: 3000,
    });
    navigate("/login");
  };

  return (
    <nav className="primary-link">
      <NavLink to="/">Home</NavLink>
      {(auth.role === 1 || auth.role === 2) && (
        <NavLink to="/categories">Categories</NavLink>
      )}
      <NavLink to="/posts">Posts</NavLink>
      <NavLink to="/profile">Profile</NavLink>
      <NavLink to="/setting">Setting</NavLink>
      <NavLink to="/login" onClick={handleLogout}>
        Logout
      </NavLink>
    </nav>
  );
};

export default PrivateNavbar;
