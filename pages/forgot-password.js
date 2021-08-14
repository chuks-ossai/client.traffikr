import { yupResolver } from "@hookform/resolvers/yup";
import Head from "next/head";
import Link from "next/link";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

const Login = () => {
  const validationSchema = Yup.object().shape({
    emailAddress: Yup.string()
      .required("Email is required")
      .email("Email is invalid"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const onSubmit = (data) => {
    console.log("forgot password model", data);
  };
  return (
    <>
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
                    value="Login"
                    id="Login"
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

export default Login;
