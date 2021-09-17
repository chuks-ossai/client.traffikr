import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { SelectControl } from "@traffikr/components/SelectControl";
import { string } from "yup/lib/locale";

const UserLinkForm = ({
  onSubmit,
  processing,
  onCancel,
  categories = [],
  link,
}) => {
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

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    type: Yup.object({ label: Yup.string(), value: Yup.string() }).required(
      "Type is required"
    ),
    medium: Yup.object({ label: Yup.string(), value: Yup.string() }).required(
      "Medium is required"
    ),
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
    setValue,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (link) {
      // console.log(returnSelectValue(link.categories));
      const fields = ["title", "url", "type", "medium", "categories"];
      fields.forEach((field) => {
        if (field === "type") {
          const val = typeOptions.find((v) => v.value === link[field]);
          console.log(field, val);
          setValue(field, val);
        } else if (field === "medium") {
          const val = mediumOptions.find((v) => v.value === link[field]);
          console.log(field, val);
          setValue(field, val);
        } else if (field === "categories") {
          console.log("fields", link[field]);
          const vals = link[field].map((l) => ({
            label: l.name,
            value: l._id,
          }));
          setValue(field, vals);
        } else {
          setValue(field, link[field]);
        }
      });
    }
  }, [link]);

  const onSubmitForm = (data) => {
    const { title, url, type, medium, categories } = data;
    const payload = {
      title,
      url,
      type: type.value,
      medium: medium.value,
      categories: categories.map((v) => v.value),
    };
    onSubmit && onSubmit(payload, link?._id);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
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
              value={value}
              // onChange={onChange}
              onChange={(e) => {
                console.log(e);
                onChange({ target: { value: e } });
              }}
              onBlur={onBlur}
              ref={ref}
              controlClassName={`form-control ${
                errors.type ? "is-invalid" : ""
              } ps-0 pt-0 pb-0`}
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
              value={value}
              onChange={(e) => onChange({ target: { value: e } })}
              onBlur={onBlur}
              ref={ref}
              controlClassName={`form-control ${
                errors.medium ? "is-invalid" : ""
              } ps-0 pt-0 pb-0`}
              controlErrorMsg={errors?.medium?.message}
              components={{
                IndicatorSeparator: () => null,
                animatedComponents: makeAnimated,
                Control: SelectControl,
              }}
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
              value={value}
              onChange={(selected) => {
                onChange({ target: { value: selected } });
              }}
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
          value={
            processing ? "Saving..." : (link ? "Update" : "Create") + " Link"
          }
        />
      </div>
    </form>
  );
};

export default UserLinkForm;
