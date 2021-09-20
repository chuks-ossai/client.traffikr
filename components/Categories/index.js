import { useEffect, useState } from "react";
import Loader from "@traffikr/components/Loader";
import Toastr from "@traffikr/components/Toastr";
import { baseURL } from "app-config";
import axios from "axios";
import CategoryForm from "./CategoryForm";
import { Button, Col, Row, Table } from "react-bootstrap";
import CustomModal from "@traffikr/components/CustomModal";
import { resizeFile } from "helpers/resizeFile";
import { formatDistance } from "date-fns";
import Link from "next/link";
import Alert from "../Alert";

const Categories = ({ token, data, reloadData, ReactQuill }) => {
  const [processing, setProcessing] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [category, setCategory] = useState(null);
  const [deleteSlug, setDeleteSlug] = useState(null);
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
      if (data.img.length) {
        data.img = await resizeFile(data.img[0]);
      } else {
        data.img = null;
      }

      const response = !slug
        ? await axios.post(`${baseURL}/category/create`, data, {
            headers: {
              Authorization: `Bearer ${token}`,
              ContentType: "application/json",
            },
          })
        : await axios.put(`${baseURL}/category/update/${slug}`, data, {
            headers: {
              Authorization: `Bearer ${token}`,
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
          message: response.data.ErrorMessage || "Unable to save category",
        });
      }
    } catch (err) {
      setProcessing(false);
      setToastDetails({
        show: true,
        type: "danger",
        message: "Something went wrong. Unable to save category",
      });
    }
  };

  const onClose = () => {
    setShowCategoryForm(false);
    setDeleteSlug(null);
  };

  const onDeleteIconClick = (slug) => {
    setDeleteSlug(slug);
  };

  const onConfirmDelete = async () => {
    try {
      setProcessing(true);
      const res = await axios.delete(
        `${baseURL}/category/delete/${deleteSlug}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            ContentType: "application/json",
          },
        }
      );

      if (res.data.Success && res.data.Results) {
        setProcessing(false);
        setDeleteSlug(null);
        setToastDetails({
          show: true,
          type: "success",
          message: res.data.Results[0].message,
        });
        reloadData();
      } else {
        setToastDetails({
          show: true,
          type: "danger",
          message: res.data.ErrorMessage || "Unable to delete category",
        });
      }
    } catch (err) {
      setProcessing(false);
      setToastDetails({
        show: true,
        type: "danger",
        message: "Something went wrong. Unable to delete category",
      });
    }
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
          <Button
            size="sm"
            variant="primary"
            onClick={() => setShowCategoryForm(true)}
          >
            <i className="las la-plus"></i>&nbsp;&nbsp;Add
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
                    <Link href={`/admin/category/${category.slug}`}>
                      <a className="me-2">
                        <span className="text-default">
                          <i className="las la-eye"></i>
                        </span>
                      </a>
                    </Link>
                    <span
                      className="text-info"
                      onClick={() => onEditClick(category)}
                      style={{ cursor: "pointer" }}
                    >
                      <i className="las la-edit"></i>
                    </span>
                    <span
                      onClick={() => onDeleteIconClick(category.slug)}
                      className="text-danger ms-2"
                      style={{ cursor: "pointer" }}
                    >
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
      <CustomModal
        title="Delete Category"
        show={deleteSlug}
        onClose={onClose}
        size="sm"
      >
        <Alert
          info="Are you sure you want to delete this category?"
          onSubmit={onSubmit}
          processing={processing}
          onCancel={() => setShowCategoryForm(false)}
          onConfirm={onConfirmDelete}
        />
      </CustomModal>
    </div>
  );
};

export default Categories;
