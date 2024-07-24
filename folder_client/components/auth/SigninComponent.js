import React, { useEffect, useState } from "react";
import { authenticate, isAuth, signin } from "../../actions/auth";
import Router from "next/router";

const SigninComponent = () => {
  const [values, setValues] = useState({
    email: "test1@test.com",
    password: "testis",
    error: "",
    loading: false,
    message: "",
    showForm: true,
  });
  const { email, password, error, loading, message, showForm } = values;

  useEffect(() => {
    isAuth() && Router.push("/");
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setValues({ ...values, loading: true, error: false });
    const user = { email, password };
    signin(user)
      .then((data) => {
        if (data && data.error) {
          setValues({ ...values, error: data.error, loading: false });
        } else {
          authenticate(data, () => {
            if (isAuth() && isAuth().role === 1) {
              Router.push("/admin");
            } else {
              Router.push("/user");
            }
          });
        }
      })
      .catch((err) => {
        console.log(err);
        setValues({
          ...values,
          error: "Something went wrong. Please try again.",
          loading: false,
        });
      });
  };

  const handleChange = (name) => (e) => {
    setValues({ ...values, error: false, [name]: e.target.value });
  };

  const showLoading = () =>
    loading ? <div className="alert alert-info">Loading...</div> : "";

  const showError = () =>
    error ? <div className="alert alert-danger">{error}</div> : "";

  const showMessage = () =>
    message ? <div className="alert alert-info">{message}</div> : "";

  const signinForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            value={email}
            onChange={handleChange("email")}
            type="email"
            className="form-control"
            placeholder="Type your email"
            style={{ marginBottom: "10px" }}
          />
        </div>
        <div className="form-group">
          <input
            value={password}
            onChange={handleChange("password")}
            type="password"
            className="form-control"
            placeholder="Type your password"
            style={{ marginBottom: "10px" }}
          />
        </div>
        <div>
          <button className="btn btn-primary">Sign In</button>
        </div>
      </form>
    );
  };

  return (
    <React.Fragment>
      {showError()}
      {showLoading()}
      {showMessage()}
      {showForm && signinForm()}
    </React.Fragment>
  );
};

export default SigninComponent;
