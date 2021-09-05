import { useEffect, useState } from "react";
import Loader from "@traffikr/components/Loader";
import Toastr from "@traffikr/components/Toastr";
import { baseURL } from "app-config";
import axios from "axios";
import CategoryForm from "./CategoryForm";
import { Button, Col, Row, Table } from "react-bootstrap";
import CustomModal from "@traffikr/components/CustomModal";
import { resizeFile } from "helpers/resizeFile";
import { getCookie } from "helpers/auth";
import dynamic from "next/dynamic";
import renderHTML from "react-render-html";
import { formatDistance } from "date-fns";
const ReactQuill = dynamic(() => import("react-quill"));

const Categories = ({ token, data, reloadData }) => {
  const [processing, setProcessing] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [category, setCategory] = useState(null);
  const [toastDetails, setToastDetails] = useState({
    show: false,
    title: "",
    type: "",
  });

  const handleCloseToast = () => {
    setToastDetails(null);
  };

  const onEditClick = (category) => {
    setCategory(category);
    setShowCategoryForm(true);
  };

  const onSubmit = async (data, slug) => {
    setProcessing(true);
    try {
      data.img = await resizeFile(data.img[0]);
      const response = editMode
        ? await axios.post(`${baseURL}/category/create`, data, {
            headers: {
              Authorization: `Bearer ${getCookie("auth_tok")}`,
              ContentType: "application/json",
            },
          })
        : await axios.put(`${baseURL}/category/update/${slug}`, data, {
            headers: {
              Authorization: `Bearer ${getCookie("auth_tok")}`,
              ContentType: "application/json",
            },
          });
      setProcessing(false);
      if (response.data.Success) {
        setToastDetails({
          show: true,
          type: "success",
          message: response.data.Results[0].message,
        });
        slug && setCategory(null);
        reloadData();
        setShowCategoryForm(false);
      } else {
        setToastDetails({
          show: true,
          type: "danger",
          message: response.data.ErrorMessage || "Unable to login user",
        });
      }
    } catch (err) {
      setProcessing(false);
      setToastDetails({
        show: true,
        type: "danger",
        message: "Something went wrong. Unable to create category",
      });
    }
  };

  const onClose = () => {
    setShowCategoryForm(false);
  };

  return (
    <div>
      <Toastr
        onClose={handleCloseToast}
        details={toastDetails}
        useDefaultDuration
      />
      {processing && <Loader />}

      <Row className="mb-3">
        <Col className="d-flex align-items-center justify-content-between">
          <h1>Categories</h1>
          <Button variant="primary" onClick={() => setShowCategoryForm(true)}>
            Add
          </Button>
        </Col>
      </Row>

      <Row>
        <Col>
          <Table striped borderless hover>
            <thead>
              <tr>
                <th width="55%">Name</th>
                {/* <th>Description</th> */}
                <th width="15%">Created</th>
                <th width="15%">Updated</th>
                <th width="15%">...</th>
              </tr>
            </thead>
            <tbody>
              {data.map((category, idx) => (
                <tr key={category._id}>
                  <td>
                    <span className="me-3">
                      <img
                        src={category.img.url}
                        alt={category.slug}
                        width="60"
                        height="60"
                        style={{ borderRadius: "50%" }}
                      />
                    </span>
                    <span>{category.name}</span>
                  </td>
                  {/* <td>{renderHTML(category.description)}</td> */}
                  <td style={{ padding: 23 }}>
                    {formatDistance(new Date(category.createdAt), new Date(), {
                      addSuffix: true,
                    })}
                  </td>
                  <td style={{ padding: 23 }}>
                    {formatDistance(new Date(category.updatedAt), new Date(), {
                      addSuffix: true,
                    })}
                  </td>
                  <td style={{ padding: 23 }}>
                    <span className="text-default">
                      <i className="las la-eye"></i>
                    </span>
                    <span
                      className="text-info"
                      onClick={() => onEditClick(category)}
                    >
                      <i className="las la-edit"></i>
                    </span>
                    <span className="text-danger">
                      <i className="las la-trash"></i>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      <CustomModal show={showCategoryForm} onClose={onClose}>
        <CategoryForm
          onSubmit={onSubmit}
          processing={processing}
          onCancel={() => setShowCategoryForm(false)}
          ReactQuill={ReactQuill}
          category={category}
        />
      </CustomModal>
    </div>
  );
};

export default Categories;
