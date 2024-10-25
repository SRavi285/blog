const recoverPasswordValidator = ({ code, password }) => {
  const errors = {
    code: "",
    password: "",
  };

  if (!code) {
    errors.code = "Code is required";
  }

  if (!password) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
};

export default recoverPasswordValidator;