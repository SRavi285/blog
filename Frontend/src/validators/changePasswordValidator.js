const changePasswordValidator = ({ oldPassword, newPassword }) => {
  const errors = {
    oldPassword: "",
    newPassword: "",
  };
  if (!oldPassword) {
    errors.oldPassword = "Old Password is required";
  }
  if (!newPassword) {
    errors.newPassword = "New Password is required";
  } else if (newPassword.length < 6) {
    errors.newPassword = "Password must be at least 6 characters";
  }

  if (oldPassword && oldPassword === newPassword) {
    errors.newPassword = "You are providing Old Password";
  }

  return errors;
}

export default changePasswordValidator;