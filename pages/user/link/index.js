import { useState } from "react";
import Loader from "@traffikr/components/Loader";
import Toastr from "@traffikr/components/Toastr";
import { baseURL } from "app-config";
import axios from "axios";
import { Button, Col, Row } from "react-bootstrap";
import CustomModal from "@traffikr/components/CustomModal";
import { getCookie } from "helpers/auth";
import UserLinkForm from "./userLinkForm";

const UserLink = ({ token, data }) => {
  const [processing, setProcessing] = useState(false);
  const [showLinkForm, setShowLinkForm] = useState(false);
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
      const response = await axios.post(`${baseURL}/link/create`, data, {
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
        setShowLinkForm(false);
      } else {
        setToastDetails({
          show: true,
          type: "danger",
          message: response.data.ErrorMessage || "Unable to create link",
        });
      }
    } catch (err) {
      console.log(err);
      setProcessing(false);
      setToastDetails({
        show: true,
        type: "danger",
        message: "Something went wrong. Unable to create link",
      });
    }
  };

  const onClose = () => {
    setShowLinkForm(false);
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
          <h1>User Links</h1>
          <Button variant="primary" onClick={() => setShowLinkForm(true)}>
            Add
          </Button>
        </Col>
      </Row>

      <Row>
        <Col>{JSON.stringify(data)}</Col>
      </Row>

      <CustomModal show={showLinkForm} onClose={onClose}>
        <UserLinkForm
          onSubmit={onSubmit}
          processing={processing}
          onCancel={() => setShowLinkForm(false)}
          categories={[]}
        />
      </CustomModal>
    </div>
  );
};

export default UserLink;
