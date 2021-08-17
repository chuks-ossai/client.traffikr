import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as jwt from "jsonwebtoken";
import Loader from "@traffikr/components/Loader";
import axios from "axios";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { baseURL } from "app-config";
import Link from "next/link";
import Toastr from "@traffikr/components/Toastr";
import { yupResolver } from "@hookform/resolvers/yup";

const ResetPassword = () => {
  const router = useRouter();
  const [state, setState] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [toastDetails, setToastDetails] = useState({
    show: false,
    title: "",
    type: "",
  });

  useEffect(() => {
    if (!state && router && router.query && router.query.token) {
      const { token } = router.query;
      const { data } = jwt.decode(token);
      setState({ data, token });
    }

    return () => {};
  }, [router]);

  const validationSchema = Yup.object().shape({
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

  const onSubmit = async (data) => {
    try {
      setProcessing(true);
      const response = await axios.post(`${baseURL}/account/reset-password`, {
        ...data,
        resetPasswordLink: state.token,
      });
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
          <div className="d-none d-md-block col-md-6 bg-secondary forgot-password-bg-img"></div>
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
                <h3>Welcome back {state?.data?.fullName}!</h3>
                <small className="text-secondary">
                  Please enter your new password below
                </small>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    New password
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

                <div className="pt-3">
                  <input
                    type="submit"
                    className="btn btn-primary btn-block btn-lg"
                    value={
                      processing ? "Password Resetting..." : "Reset Password"
                    }
                    id="reset-password"
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

export default ResetPassword;
