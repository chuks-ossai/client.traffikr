import { yupResolver } from "@hookform/resolvers/yup";
import Loader from "@traffikr/components/Loader";
import Toastr from "@traffikr/components/Toastr";
import { baseURL } from "app-config";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

const ForgotPassword = () => {
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
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const onSubmit = async (data) => {
    try {
      setProcessing(true);
      const response = await axios.post(
        `${baseURL}/account/forgot-password`,
        data
      );
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
          message: response.data.ErrorMessage || "Unable to reset password",
        });
      }
    } catch (err) {
      setProcessing(false);
      setToastDetails({
        show: true,
        type: "danger",
        message: "Something went wrong. Unable to reset password",
      });
    }
  };
  const handleCloseToast = () => {
    setToastDetails(null);
  };

  return (
    <>
      <Toastr onClose={handleCloseToast} details={toastDetails} />
      {processing && <Loader />}
      <div className="container-fluid">
        <div className="row h-screen">
          <div className="d-none d-md-block col-md-6 bg-secondary forgot-password-bg-img">
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
                <h3>Forgot Password!</h3>
                <small className="text-secondary">
                  Please enter your email where reset password link will be sent
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

                <div className="pt-3">
                  <input
                    type="submit"
                    className="btn btn-primary btn-block btn-lg"
                    value={
                      processing ? "Getting Reset Link..." : "Get Reset Link"
                    }
                    id="get-reset-link"
                  />
                </div>
              </form>

              <div className="d-grid gap-2 d-md-flex justify-content-md-center mt-5">
                <p>
                  <span className="text-secondary">Back to ?</span>{" "}
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

export default ForgotPassword;
