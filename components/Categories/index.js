import { useState } from "react";
import Loader from "@traffikr/components/Loader";
import Toastr from "@traffikr/components/Toastr";
import { baseURL } from "app-config";
import axios from "axios";
import CustomModal from "../CustomModal";
import CategoryForm from "./CategoryForm";
import { Button, Col, Row } from "react-bootstrap";

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
    console.log("data", data);
    setProcessing(true);
    const formData = new FormData();
    try {
      formData.set("name", data.name);
      formData.set("description", data.description);
      formData.set("img", data.img[0]);
      console.log(formData);
      const response = await axios.post(
        `${baseURL}/category/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            ContentType: "multipart/form-data",
          },
        }
      );
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
      console.log(err);
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

Categories.getInitialProps = async () => {
  try {
    const response = await axios.get(`${baseURL}/category/getAll`);

    return {
      data: response.data.Results,
    };
  } catch (err) {
    return {
      data: [],
    };
  }
};

export default Categories;
