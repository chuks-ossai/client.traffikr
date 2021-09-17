import { useState } from "react";
import Loader from "@traffikr/components/Loader";
import Toastr from "@traffikr/components/Toastr";
import { baseURL } from "app-config";
import axios from "axios";
import { Button, Col, Row } from "react-bootstrap";
import CustomModal from "@traffikr/components/CustomModal";
import { formatDistance } from "date-fns";
import Alert from "../Alert";
import UserLinkForm from "../UserLinkForm";
import InfiniteScroll from "react-infinite-scroll-component";

const AdminLinks = ({
  token,
  data,
  reloadData,
  loadData,
  totalLinks,
  skip,
  limit,
  categories,
}) => {
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
        : await axios.put(`${baseURL}/link/update/${linkId}`, data, {
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
      console.log(err);
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
      const res = await axios.delete(`${baseURL}/link/delete/${deleteLinkId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          ContentType: "application/json",
        },
      });

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

  const handleLoadMore = () => {
    const toSkip = skip + limit;
    loadData(toSkip, limit);
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
          <InfiniteScroll
            dataLength={data.length} //This is important field to render the next data
            next={() => handleLoadMore()}
            hasMore={totalLinks > 0 && totalLinks >= limit}
            hasChildren={totalLinks}
            loader={<h4>Loading...</h4>}
          >
            {data.map((link) => (
              <div className="alert alert-primary p-2" key={link._id}>
                <div className="container">
                  <div className="row">
                    <div className="col-md-8">
                      <a href={link.url} target="_blank">
                        <h5 className="pt-2">{link.title}</h5>
                        <h6
                          className="pt-2 text-danger"
                          style={{ fontSize: 12 }}
                        >
                          {link.url}
                        </h6>
                      </a>

                      <div className="row">
                        <div className="col-12 d-flex align-items-center justify-content-between">
                          <div>
                            <span className="badge bg-info me-2">
                              {link.type}
                            </span>
                            <span className="badge bg-info">{link.medium}</span>
                          </div>
                          <div>
                            {link.categories &&
                              link.categories.map((category, idx) => (
                                <span
                                  className="badge bg-warning me-2"
                                  key={category._id}
                                >
                                  {category.name}
                                </span>
                              ))}
                          </div>
                          <div>
                            <span
                              className="badge bg-secondary rounded-pill me-2"
                              style={{ cursor: "pointer" }}
                              onClick={(e) => onEditClick(link)}
                            >
                              <i className="las la-edit"></i>
                            </span>
                            <span
                              className="badge bg-danger rounded-pill"
                              style={{ cursor: "pointer" }}
                              onClick={(e) => onDeleteIconClick(link._id)}
                            >
                              <i className="las la-trash"></i>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 d-flex flex-column align-items-end justify-content-between">
                      <span className="pull-right">
                        <span className="text-muted">
                          Created:{" "}
                          {formatDistance(
                            new Date(link.createdAt),
                            new Date(),
                            {
                              addSuffix: false,
                            }
                          )}
                        </span>
                      </span>
                      <span className="d-block pull-right">
                        <span className="text-muted">
                          Last Updated:{" "}
                          {formatDistance(
                            new Date(link.updatedAt),
                            new Date(),
                            {
                              addSuffix: false,
                            }
                          )}
                        </span>
                      </span>
                      <div>
                        <span className="text-muted">Clicks:&nbsp;</span>
                        <span className="fw-bold">{link.clicks}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </InfiniteScroll>
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

export default AdminLinks;
