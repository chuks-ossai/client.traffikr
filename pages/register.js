import Link from "next/link";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "@traffikr/components/Loader";
import Toastr from "@traffikr/components/Toastr";
import { baseURL } from "app-config";
import { isAuth } from "helpers/auth";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { SelectControl } from "@traffikr/components/SelectControl";

const Register = () => {
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [toastDetails, setToastDetails] = useState({
    show: false,
    title: "",
    type: "",
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await axios.get(`${baseURL}/category/getAll`);

      if (res.data.Success && res.data.Results) {
        setCategories(
          res.data.Results.map((category) => ({
            label: category.name,
            value: category._id,
          }))
        );
      }
    } catch (err) {
      console.table({ err });
    }
  };

  const handleCloseToast = () => {
    setToastDetails(null);
  };

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Fullname is required"),
    username: Yup.string()
      .required("Username is required")
      .max(8, "Username must not exceed 8 characters"),
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
    control,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    isAuth() && router.push("/");
  }, []);

  const onSubmit = (data) => {
    setProcessing(true);
    axios
      .post(`${baseURL}/account/register`, data)
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
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    className={`form-control form-control-lg ${
                      errors.username ? "is-invalid" : ""
                    }`}
                    name="username"
                    id="username"
                    placeholder="eg. johndoe"
                    {...register("username", { required: true })}
                  />
                  <div className="invalid-feedback">
                    {errors?.username?.message}
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
                <div className="mb-3">
                  <label htmlFor="interestedTopics" className="col-form-label">
                    Interested Topics:
                  </label>
                  <Controller
                    control={control}
                    name="interestedTopics"
                    id="interestedTopics"
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                      <Select
                        {...register("interestedTopics", { required: false })}
                        // value={value?.value}
                        onChange={onChange}
                        onBlur={onBlur}
                        ref={ref}
                        controlClassName={`form-control form-control-lg ${
                          errors.interestedTopics ? "is-invalid" : ""
                        } ps-0 pt-0 pb-0`}
                        controlErrorMsg={errors?.interestedTopics?.message}
                        closeMenuOnSelect={false}
                        components={{
                          IndicatorSeparator: () => null,
                          animatedComponents: makeAnimated,
                          Control: SelectControl,
                        }}
                        defaultValue={value}
                        isMulti
                        options={categories}
                      />
                    )}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="otherTopics" className="form-label">
                    Other Topic of Interest:
                  </label>
                  <input
                    type="text"
                    className={`form-control form-control-lg ${
                      errors.otherTopics ? "is-invalid" : ""
                    }`}
                    name="otherTopics"
                    id="otherTopics"
                    placeholder="Please enter other topics that are not in the list above"
                    {...register("otherTopics", { required: true })}
                  />
                  <div className="invalid-feedback">
                    {errors?.otherTopics?.message}
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
