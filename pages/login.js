import { yupResolver } from "@hookform/resolvers/yup";
import Loader from "@traffikr/components/Loader";
import Toastr from "@traffikr/components/Toastr";
import { baseURL } from "app-config";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

const Login = () => {
  const [processing, setProcessing] = useState(false);
  const [toastDetails, setToastDetails] = useState({
    show: false,
    title: "",
    type: "",
  });
  const validationSchema = Yup.object().shape({
    emailAddress: Yup.string()
      .required("Email is required")
      .email("Email is invalid"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters")
      .max(40, "Password must not exceed 40 characters"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const handleCloseToast = () => {
    setToastDetails(null);
  };

  const onSubmit = async (data) => {
    setProcessing(true);
    const response = await axios.post(`${baseURL}/login`, data);
    try {
      setProcessing(false);
      if (response.data.Success) {
        setToastDetails({
          show: true,
          type: "success",
          message: response.data.Results[0].message,
        });
        reset();
      } else {
        setToastDetails({
          show: true,
          type: "danger",
          message: response.data.ErrorMessage || "Unable to login user",
        });
      }
    } catch (err) {
      setProcessing(false);
      setToastDetails({
        show: true,
        type: "danger",
        message: "Something went wrong. Unable to register user",
      });
    }
  };

  return (
    <>
      <Toastr
        onClose={handleCloseToast}
        details={toastDetails}
        useDefaultDuration
      />
      {processing && <Loader />}
      <div className="container-fluid">
        <div className="row h-screen">
          <div className="d-none d-md-block col-md-6 bg-secondary login-bg-img">
            Hello login dark
          </div>
          <div className="col-sm-12 col-md-6 bg-white m-auto px-0 px-lg-5">
            <div className="container px-md-5">
              <div className="brand-logo mb-4 text-primary">
                <h1>
                  <Link href="/">
                    <a>Traffikr.IO</a>
                  </Link>
                </h1>
              </div>
              <div className="mb-4">
                <h3>Welcome back!</h3>
                <small className="text-secondary">
                  Please enter your email and password to continue from where
                  you stopped
                </small>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label htmlFor="emailAddress" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    className={`form-control form-control-lg ${
                      errors.emailAddress ? "is-invalid" : ""
                    }`}
                    id="emailAddress"
                    name="emailAddress"
                    placeholder="eg. name@example.com"
                    {...register("emailAddress", { required: true })}
                  />
                  <div className="invalid-feedback">
                    {errors?.emailAddress?.message}
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className={`form-control form-control-lg ${
                      errors.password ? "is-invalid" : ""
                    }`}
                    id="password"
                    name="password"
                    placeholder="password"
                    {...register("password", { required: true })}
                  />
                  <div className="invalid-feedback">
                    {errors?.password?.message}
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value=""
                      id="keepMeSignedIn"
                      {...register("keepMeSignedIn", { required: false })}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="keepMeSignedIn"
                    >
                      Keep me signed in
                    </label>
                  </div>
                  <div className="forgot-password">
                    <Link href="/forgot-password">
                      <a className="link-primary">Forgot Password?</a>
                    </Link>
                  </div>
                </div>
                <div className="pt-3">
                  <input
                    type="submit"
                    className="btn btn-primary btn-block btn-lg"
                    value={processing ? "Loging in..." : "Login"}
                    id="Login"
                  />
                </div>
              </form>
              <div className="d-grid gap-2 d-md-flex justify-content-md-center mt-5">
                <button className="btn btn-lg btn-fb btn-block" type="button">
                  <i className="lab la-facebook-f"></i>&nbsp;Facebook
                </button>
                <button className="btn btn-lg btn-gg btn-block" type="button">
                  <i className="lab la-google-plus"></i>&nbsp;Google
                </button>
              </div>
              <div className="d-grid gap-2 d-md-flex justify-content-md-center mt-5">
                <p>
                  <span className="text-secondary">
                    Don't have and account?
                  </span>{" "}
                  <Link href="/register">
                    <a className="link-primary">Create</a>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
