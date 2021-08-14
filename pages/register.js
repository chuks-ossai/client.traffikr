import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";
import { useState } from "react";
import Loader from "@traffikr/components/Loader";
import Toastr from "@traffikr/components/Toastr";
import { baseURL } from "app-config";

const Register = () => {
  const [processing, setProcessing] = useState(false);
  const [toastDetails, setToastDetails] = useState({
    show: false,
    title: "",
    type: "",
  });
  const handleCloseToast = () => {
    setToastDetails(null);
  };

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Fullname is required"),
    emailAddress: Yup.string()
      .required("Email is required")
      .email("Email is invalid"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters")
      .max(40, "Password must not exceed 40 characters"),
    termsAgreed: Yup.bool().oneOf(
      [true],
      "You need to accept terms and condition to proceed"
    ),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const onSubmit = (data) => {
    setProcessing(true);
    axios
      .post(`${baseURL}/register`, data)
      .then((res) => {
        setProcessing(false);
        if (res.data.Success) {
          setToastDetails({
            show: true,
            type: "success",
            message: res.data.Results[0].message,
          });

          reset();
        } else {
          setToastDetails({
            show: true,
            type: "danger",
            message: res.data.ErrorMessage || "Unable to register user",
          });
        }
      })
      .catch((e) => {
        setProcessing(false);
        setToastDetails({
          show: true,
          type: "danger",
          message: "Something went wrong. Unable to register user",
        });
      });
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
          <div className="d-none d-md-block col-md-6 bg-secondary register-bg-img"></div>
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
                <h3>Welcome!</h3>
                <small className="text-secondary">
                  Please register with required credentials to get started
                </small>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label htmlFor="fullName" className="form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className={`form-control form-control-lg ${
                      errors.fullName ? "is-invalid" : ""
                    }`}
                    name="fullName"
                    id="fullName"
                    placeholder="eg. John Doe"
                    {...register("fullName", { required: true })}
                  />
                  <div className="invalid-feedback">
                    {errors?.fullName?.message}
                  </div>
                </div>
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
                    placeholder="name@example.com"
                    {...register("emailAddress", {
                      required: true,
                      email: true,
                    })}
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
                    placeholder="password"
                    {...register("password", { required: true })}
                  />
                  <div className="invalid-feedback">
                    {errors?.password?.message}
                  </div>
                </div>
                <div className="mb-3 form-check">
                  <input
                    className={`form-check-input ${
                      errors.termsAgreed ? "is-invalid" : ""
                    }`}
                    type="checkbox"
                    value=""
                    id="termsAgreed"
                    name="termsAgreed"
                    {...register("termsAgreed", { required: true })}
                  />
                  <label className="form-check-label" htmlFor="termsAgreed">
                    I agree to all terms and condition
                  </label>
                  <div className="invalid-feedback">
                    {errors?.termsAgreed?.message}
                  </div>
                </div>
                <div className="pt-3">
                  <input
                    type="submit"
                    className="btn btn-primary btn-block btn-lg"
                    value={`Register${processing ? "ing..." : ""}`}
                    id="register"
                  />
                </div>
              </form>

              <div className="mt-3">
                <p>
                  <span className="text-secondary">
                    Already have and account?
                  </span>
                  <Link href="/login">
                    <a className="link-primary">Login</a>
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

export default Register;
