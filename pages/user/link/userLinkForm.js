import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { baseURL } from "app-config";
import axios from "axios";

const UserLinkForm = ({ onSubmit, processing, onCancel }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get(`${baseURL}/category/getAll`)
      .then((res) => {
        if (res.data.Success && res.data.Results) {
          setCategories(res.data.Results);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
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
        <select
          className="form-select"
          name="type"
          id="type"
          {...register("type", { required: true })}
          aria-label="Select Type of link"
        >
          <option selected value="free">
            Free
          </option>
          <option value="paid">Paid</option>
        </select>

        <div className="invalid-feedback">{errors?.type?.message}</div>
      </div>

      <div className="mb-3">
        <label htmlFor="medium" className="col-form-label">
          Medium:
        </label>
        <select
          className="form-select"
          name="medium"
          id="medium"
          {...register("medium", { required: true })}
          aria-label="Select Medium through which the information will be passed"
        >
          <option selected value="article">
            Article
          </option>
          <option value="book">Book</option>
          <option value="video">Video</option>
          <option value="audio">Audio</option>
        </select>

        <div className="invalid-feedback">{errors?.medium?.message}</div>
      </div>

      <div className="mb-3">
        <label htmlFor="categories" className="col-form-label">
          Categories:
        </label>
        <select
          className="form-select"
          multiple
          aria-label="multiple select example"
          name="categories"
          id="categories"
          {...register("categories", { required: true })}
          aria-label="Select Type of link"
        >
          {categories.map((category) => (
            <option value={category._id} key={category._id}>
              {category.name}
            </option>
          ))}
        </select>

        <div className="invalid-feedback">{errors?.categories?.message}</div>
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
