import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const CategoryForm = ({ onSubmit, processing, onCancel }) => {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string().min(
      28,
      "Description must be at least 28 characters"
    ),

    img: Yup.mixed()
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
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
        />
        <div className="invalid-feedback">{errors?.name?.message}</div>
      </div>
      <div className="mb-3">
        <label htmlFor="description" className="col-form-label">
          Description:
        </label>
        <textarea
          className={`form-control ${errors.description ? "is-invalid" : ""}`}
          id="description"
          name="description"
          {...register("description", { min: 28 })}
        ></textarea>
        <div className="invalid-feedback">{errors?.description?.message}</div>
      </div>
      <div className="mb-3">
        <label htmlFor="img" className="col-form-label">
          Image:
        </label>
        <input
          className={`form-control ${errors.img ? "is-invalid" : ""}`}
          id="img"
          name="img"
          type="file"
          {...register("img", {
            validate: {
              fileSize: (files) => files[0]?.size < 20000000 || "Max 20MB",
              acceptedFormats: (files) =>
                ["image/jpeg", "image/jpg", "image/png", "image/gif"].includes(
                  files[0]?.type
                ) || "Only PNG, JPG, JPEG e GIF",
            },
          })}
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
          value={processing ? "Saving..." : "Create Category"}
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
