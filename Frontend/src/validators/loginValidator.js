const isEmail = (email) =>
  String(email)
    .toLowerCase()
    .match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);

const loginValidator = ({  email, password }) => {
  const errors = {
    email: "",
    password: "",
  };

  if (!email) {
    errors.email = "Email is required";
  } else if (!isEmail(email)) {
    errors.email = "Invalid email";
  }

  if (!password) {
    errors.password = "Password is required";
  }

  return errors;
};

export default loginValidator;
