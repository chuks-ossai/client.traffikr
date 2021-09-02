import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { baseURL } from "app-config";
import axios from "axios";
import Select, { components } from "react-select";
import makeAnimated from "react-select/animated";

const SelectControl = (props) => {
  useEffect(() => {});
  return (
    <>
      <components.Control
        className={props?.selectProps?.controlClassName}
        {...props}
      >
        {props.children}
      </components.Control>
      <div className="invalid-feedback">
        {props?.selectProps.controlErrorMsg}
      </div>
    </>
  );
};

const UserLinkForm = ({ onSubmit, processing, onCancel }) => {
  const [categories, setCategories] = useState([]);
  const [mediumOptions, setMediumOptions] = useState([
    {
      label: "Book",
      value: "books",
    },
    {
      label: "Video",
      value: "video",
    },
    {
      label: "Article",
      value: "article",
    },
  ]);
  const [typeOptions, setTypeOptions] = useState([
    {
      label: "Paid",
      value: "paid",
    },
    {
      label: "Free",
      value: "free",
    },
  ]);

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
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    type: Yup.string().required("Type is required"),
    medium: Yup.string().required("Medium is required"),
    url: Yup.string()
      .required("URL is required")
      .max(256, "URL should not be more than 256 characters"),
    categories: Yup.array().min(1, "Select at least one Category"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-3">
        <label htmlFor="title" className="col-form-label">
          Title:
        </label>
        <input
          type="text"
          className={`form-control ${errors.title ? "is-invalid" : ""}`}
          id="title"
          name="title"
          {...register("title", { required: true })}
        />
        <div className="invalid-feedback">{errors?.title?.message}</div>
      </div>
      <div className="mb-3">
        <label htmlFor="url" className="col-form-label">
          URL Link:
        </label>
        <input
          type="text"
          className={`form-control ${errors.url ? "is-invalid" : ""}`}
          id="url"
          name="url"
          {...register("url", { required: true })}
        />
        <div className="invalid-feedback">{errors?.url?.message}</div>
      </div>
      <div className="mb-3">
        <label htmlFor="type" className="col-form-label">
          Type:
        </label>
        <Controller
          control={control}
          name="type"
          id="type"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Select
              {...register("type", { required: true })}
              // value={value}
              // onChange={onChange}
              onChange={(e) => onChange({ target: { value: e.value } })}
              onBlur={onBlur}
              ref={ref}
              controlClassName={`form-control ${
                errors.type ? "is-invalid" : ""
              } ps-0 pt-0 pb-0`}
              closeMenuOnSelect={false}
              defaultValue={"free"}
              options={typeOptions}
              controlErrorMsg={errors?.type?.message}
              components={{
                IndicatorSeparator: () => null,
                animatedComponents: makeAnimated,
                Control: SelectControl,
              }}
            />
          )}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="medium" className="col-form-label">
          Medium:
        </label>
        <Controller
          control={control}
          name="medium"
          id="medium"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Select
              {...register("medium", { required: true })}
              // value={value?.value}
              // onChange={onChange}
              onChange={(e) => onChange({ target: { value: e.value } })}
              onBlur={onBlur}
              ref={ref}
              controlClassName={`form-control ${
                errors.medium ? "is-invalid" : ""
              } ps-0 pt-0 pb-0`}
              controlErrorMsg={errors?.medium?.message}
              closeMenuOnSelect={false}
              components={{
                IndicatorSeparator: () => null,
                animatedComponents: makeAnimated,
                Control: SelectControl,
              }}
              defaultValue={value}
              options={mediumOptions}
            />
          )}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="categories" className="col-form-label">
          Categories:
        </label>
        <Controller
          control={control}
          name="categories"
          id="categories"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Select
              {...register("categories", { required: true })}
              // value={value?.value}
              onChange={onChange}
              onBlur={onBlur}
              ref={ref}
              controlClassName={`form-control ${
                errors.categories ? "is-invalid" : ""
              } ps-0 pt-0 pb-0`}
              controlErrorMsg={errors?.categories?.message}
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

      <div className="mb-3 d-flex justify-content-end align-items-center">
        <button
          type="button"
          className="btn btn-outline-secondary mx-3"
          onClick={onCancel}
        >
          Close
        </button>
        <input
          type="submit"
          className="btn btn-primary"
          value={processing ? "Saving..." : "Create Link"}
        />
      </div>
    </form>
  );
};

export default UserLinkForm;
