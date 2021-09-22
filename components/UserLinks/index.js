import { useState } from "react";
import Loader from "@traffikr/components/Loader";
import Toastr from "@traffikr/components/Toastr";
import { baseURL } from "app-config";
import axios from "axios";
import { Button, Col, Row } from "react-bootstrap";
import CustomModal from "@traffikr/components/CustomModal";
import Alert from "../Alert";
import UserLinkForm from "../UserLinkForm";
import LinkItem from "../LinkItem";

const UserLinks = ({ token, data, reloadData, categories }) => {
  const [processing, setProcessing] = useState(false);
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [link, setLink] = useState(null);
  const [deleteLinkId, setDeleteLinkId] = useState(null);
  const [toastDetails, setToastDetails] = useState({
    show: false,
    title: "",
    type: "",
  });

  const handleCloseToast = () => {
    setToastDetails(null);
  };

  const onEditClick = (link) => {
    setLink(link);
    setShowLinkForm(true);
  };

  const onSubmit = async (data, linkId) => {
    setProcessing(true);
    try {
      const response = !linkId
        ? await axios.post(`${baseURL}/link/create`, data, {
            headers: {
              Authorization: `Bearer ${token}`,
              ContentType: "application/json",
            },
          })
        : await axios.put(`${baseURL}/link/my/update/${linkId}`, data, {
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
        linkId && setLink(null);
        reloadData();
        setShowLinkForm(false);
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
    setShowLinkForm(false);
    setDeleteLinkId(null);
    setLink(null);
  };

  const onDeleteIconClick = (linkId) => {
    setDeleteLinkId(linkId);
  };

  const onConfirmDelete = async () => {
    try {
      setProcessing(true);
      const res = await axios.delete(
        `${baseURL}/link/my/delete/${deleteLinkId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            ContentType: "application/json",
          },
        }
      );

      if (res.data.Success && res.data.Results) {
        setProcessing(false);
        setDeleteLinkId(null);
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
          <h1>Links</h1>
          <Button
            size="sm"
            variant="primary"
            onClick={() => setShowLinkForm(true)}
          >
            <i className="las la-plus"></i>&nbsp;&nbsp;Add
          </Button>
        </Col>
      </Row>

      <Row>
        <Col>
          {data.map((link) => (
            <LinkItem
              link={link}
              onEditClick={onEditClick}
              onDeleteIconClick={onDeleteIconClick}
            />
          ))}
        </Col>
      </Row>

      <CustomModal
        show={showLinkForm}
        onClose={onClose}
        title={link ? "Update Link" : "Create Link"}
      >
        <UserLinkForm
          onSubmit={onSubmit}
          processing={processing}
          onCancel={onClose}
          categories={categories}
          link={link}
        />
      </CustomModal>
      <CustomModal
        title="Delete Link"
        show={deleteLinkId}
        onClose={onClose}
        size="sm"
      >
        <Alert
          info="Are you sure you want to delete this link?"
          onSubmit={onSubmit}
          processing={processing}
          onCancel={onClose}
          onConfirm={onConfirmDelete}
        />
      </CustomModal>
    </div>
  );
};

export default UserLinks;
