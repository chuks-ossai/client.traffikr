import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { SelectControl } from "@traffikr/components/SelectControl";
import Chips from "react-chips";

const ProfileForm = ({ onSubmit, processing, categories = [], data }) => {
  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required("Full Name is required"),
    // password: Yup.string()
    //   .min(6, "Password must be at least 6 characters")
    //   .max(40, "Password must not exceed 40 characters"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (data) {
      const fields = [
        "fullName",
        "emailAddress",
        "password",
        "interestedTopics",
        "otherTopics",
        "username",
      ];
      fields.forEach((field) => {
        if (field === "interestedTopics") {
          const vals = categories.filter((v) => data[field]?.includes(v.value));
          setValue(field, vals);
        } else {
          setValue(field, data[field]);
        }
      });
    }
  }, [data, categories]);

  const onSubmitForm = (data) => {
    const { fullName, emailAddress, password, otherTopics, interestedTopics } =
      data;
    const payload = {
      fullName,
      emailAddress,
      password,
      otherTopics,
      interestedTopics: interestedTopics.map((v) => v.value),
    };
    onSubmit && onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
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
        <div className="invalid-feedback">{errors?.fullName?.message}</div>
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
          {...register("username")}
        />
        <div className="invalid-feedback">{errors?.username?.message}</div>
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
          disabled
        />
        <div className="invalid-feedback">{errors?.emailAddress?.message}</div>
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
          {...register("password")}
        />
        <div className="invalid-feedback">{errors?.password?.message}</div>
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
              {...register("interestedTopics")}
              value={value}
              onChange={(selected) => {
                onChange({ target: { value: selected } });
              }}
              onBlur={onBlur}
              ref={ref}
              controlClassName={`form-control ${
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
        <label htmlFor="otherTopics" className="col-form-label">
          Other Topic of Interest:
        </label>
        <Controller
          control={control}
          name="otherTopics"
          id="otherTopics"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Chips
              value={value}
              onChange={(e) => onChange({ target: { value: e } })}
              onBlur={onBlur}
              ref={ref}
              suggestions={[
                "Politics",
                "Sports",
                "News",
                "Career",
                "Entertainment",
                "Education",
              ]}
            />
          )}
        />
      </div>

      <div className="mb-3 d-flex justify-content-end align-items-center">
        <input
          type="submit"
          className="btn btn-primary btn-block"
          value={processing ? "Updating..." : "Update Profile"}
        />
      </div>
    </form>
  );
};

export default ProfileForm;
