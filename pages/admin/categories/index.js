import { useState } from "react";
import Loader from "@traffikr/components/Loader";
import Toastr from "@traffikr/components/Toastr";
import { baseURL } from "app-config";
import axios from "axios";
import CategoryForm from "./CategoryForm";
import { Button, Col, Row } from "react-bootstrap";
import CustomModal from "@traffikr/components/CustomModal";
import { resizeFile } from "helpers/resizeFile";
import { getCookie } from "helpers/auth";

const Categories = ({ token, data }) => {
  const [processing, setProcessing] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [toastDetails, setToastDetails] = useState({
    show: false,
    title: "",
    type: "",
  });

  const handleCloseToast = () => {
    setToastDetails(null);
  };

  const onSubmit = async (data) => {
    setProcessing(true);
    try {
      data.img = await resizeFile(data.img[0]);
      const response = await axios.post(`${baseURL}/category/create`, data, {
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

      <Row>
        <Col>
          <h1>Categories</h1>
          <Button variant="primary" onClick={() => setShowCategoryForm(true)}>
            Add
          </Button>
        </Col>
      </Row>

      <Row>
        <Col>{JSON.stringify(data)}</Col>
      </Row>

      <CustomModal show={showCategoryForm} onClose={onClose}>
        <CategoryForm
          onSubmit={onSubmit}
          processing={processing}
          onCancel={() => setShowCategoryForm(false)}
        />
      </CustomModal>
    </div>
  );
};

export default Categories;
