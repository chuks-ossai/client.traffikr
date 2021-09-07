import React, { useEffect, useState } from "react";

import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import "react-quill/dist/quill.bubble.css";

// import ReactQuill from "react-quill";

const CategoryForm = ({
  onSubmit,
  processing,
  onCancel,
  ReactQuill,
  category,
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string().min(
      20,
      "Description must be at least 20 characters"
    ),

    img:
      !category &&
      Yup.mixed()
        .test(
          "fileSize",
          "File should not be more than 2MB",
          (value) => value && value[0]?.size <= 2000000
        )
        .test(
          "acceptedFormats",
          "Invalid file type. File must have jpeg, jpg, png or gif extension",
          (files) =>
            ["image/jpeg", "image/jpg", "image/png", "image/gif"].includes(
              files[0]?.type
            )
        ),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmitForm = (data) => {
    onSubmit && onSubmit(data, category?.slug);
  };

  useEffect(() => {
    if (category) {
      console.log(category);
      const fields = ["name", "description"];
      fields.forEach((field) => setValue(field, category[field]));
    }
  }, [category]);

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <div className="mb-3">
        <label htmlFor="name" className="col-form-label">
          Name:
        </label>
        <input
          type="text"
          className={`form-control ${errors.name ? "is-invalid" : ""}`}
          id="name"
          name="name"
          {...register("name", { required: true })}
          // value={category?.name}
        />
        <div className="invalid-feedback">{errors?.name?.message}</div>
      </div>
      <div className="mb-3">
        <label htmlFor="description" className="col-form-label">
          Description:
        </label>
        <Controller
          control={control}
          name="description"
          id="description"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <ReactQuill
              {...register("description", { min: 28 })}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              theme="bubble"
              ref={ref}
              className={`form-control ${
                errors.description ? "is-invalid" : ""
              }`}
            />
          )}
        />
        <div className="invalid-feedback">{errors?.description?.message}</div>
      </div>
      {category && category.img?.url && (
        <div className="mb-3">
          <div className="d-flex align-items-center">
            <div className="me-5">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setShowPreview(!showPreview);
                }}
                className="btn btn-sm btn-link"
              >
                {showPreview ? "Hide" : "Preview"} Image
              </button>
            </div>
            {showPreview && (
              <div className="prev-img">
                <span>
                  <img
                    src={category.img.url}
                    alt={category.slug}
                    width="80"
                    height="80"
                  />
                </span>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="mb-3">
        <label htmlFor="img" className="col-form-label">
          Image:
        </label>
        <input
          className={`form-control ${errors.img ? "is-invalid" : ""}`}
          id="img"
          name="img"
          type="file"
          {...register("img")}
        />
        <div className="invalid-feedback">{errors?.img?.message}</div>
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
            processing
              ? "Saving..."
              : (category ? "Update " : "Create ") + "Category"
          }
        />
      </div>
    </form>
  );

  //   return (
  //     <Form onSubmit={handleSubmit(onSubmit)}>
  //       <Row className="mb-3">
  //         <Form.Group as={Col}>
  //           <Form.Label>Name</Form.Label>
  //           <Form.Control
  //             type="text"
  //             name="name"
  //             id="name"
  //             placeholder="Enter Category Name"
  //             // ref={{ ...register("name", { required: true }) }}
  //             ref={register}
  //           />
  //           <Form.Control.Feedback type="invalid">
  //             {errors?.name?.message}
  //           </Form.Control.Feedback>
  //         </Form.Group>
  //       </Row>
  //       <Row className="mb-3">
  //         <Form.Group as={Col}>
  //           <Form.Label>Description</Form.Label>
  //           <Form.Control
  //             as="textarea"
  //             type="text"
  //             id="description"
  //             name="description"
  //             // ref={{ ...register("description", { min: 28 }) }}
  //             ref={register}
  //             placeholder="Give a short description of this category"
  //           />
  //           <Form.Control.Feedback type="invalid">
  //             {errors?.description?.message}
  //           </Form.Control.Feedback>
  //         </Form.Group>
  //       </Row>
  //       <Row className="mb-3">
  //         <Form.Group as={Col}>
  //           <Form.Label>Default file input example</Form.Label>
  //           <Form.Control
  //             name="img"
  //             id="img"
  //             type="file"
  //             // ref={{
  //             //   ...register("img", {
  //             //     validate: {
  //             //       fileSize: (files) => files[0]?.size < 20000000 || "Max 20MB",
  //             //       acceptedFormats: (files) =>
  //             //         [
  //             //           "image/jpeg",
  //             //           "image/jpg",
  //             //           "image/png",
  //             //           "image/gif",
  //             //         ].includes(files[0]?.type) || "Only PNG, JPG, JPEG e GIF",
  //             //     },
  //             //   }),
  //             // }}
  //             ref={register}
  //           />
  //           <Form.Control.Feedback type="invalid">
  //             {errors?.img?.message}
  //           </Form.Control.Feedback>
  //         </Form.Group>
  //       </Row>
  //       <Row className="mb-3">
  //         <Button variant="primary" type="submit">
  //           Submit
  //         </Button>
  //       </Row>
  //     </Form>
  //   );
};

export default CategoryForm;
