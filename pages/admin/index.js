import Layout from "@traffikr/components/Layout";
import withAdmin from "pages/withAdmin";
import Tab from "react-bootstrap/Tab";
import { Col, Nav, Row } from "react-bootstrap";
import Categories from "@traffikr/components/Categories";
import axios from "axios";
import { baseURL } from "app-config";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import AdminLinks from "@traffikr/components/AdminLinks";
import ProfileForm from "@traffikr/components/ProfileForm";
import Toastr from "@traffikr/components/Toastr";
import Loader from "@traffikr/components/Loader";
import { updateProfile } from "helpers/auth";
const ReactQuill = dynamic(() => import("react-quill"));

const Admin = ({ user, token }) => {
  const [categories, setCategories] = useState([]);
  const [adminLinks, setAdminLinks] = useState([]);
  const [limit] = useState(4);
  const [skip, setSkip] = useState(0);
  const [totalLinks, setTotalLinks] = useState(0);
  const [adminProfile, setAdminProfile] = useState(user[0].profile);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [toastDetails, setToastDetails] = useState({
    show: false,
    title: "",
    type: "",
  });
  useEffect(() => {
    loadCategories();
    loadLinks();
  }, []);

  const reloadData = () => {
    loadCategories();
  };

  const reloadLinks = () => {
    loadLinks();
  };

  const loadCategories = async () => {
    const res = await axios.get(`${baseURL}/category/getAll`, {
      headers: {
        Authorization: `Bearer ${token}`,
        ContentType: "application/json",
      },
    });
    if (res.data.Success && res.data.Results) {
      setCategories(res.data.Results);
    }
  };

  const loadLinks = async (skp = 0, lmt = 4) => {
    const res = await axios.get(
      `${baseURL}/link/admin/getAll?skip=${skp}&limit=${lmt}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          ContentType: "application/json",
        },
      }
    );
    if (res.data.Success && res.data.Results) {
      if (skp) {
        setAdminLinks((prev) => [...prev, ...res.data.Results]);
      } else {
        setAdminLinks(res.data.Results);
      }
      setSkip(skp);
      setTotalLinks(res.data.Results.length);
    } else {
      console.log(res.data);
    }
  };

  const onUpdateProfile = async (data) => {
    setUpdatingProfile(true);
    try {
      const response = await axios.put(`${baseURL}/user/my/profile`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          ContentType: "application/json",
        },
      });

      setUpdatingProfile(false);
      if (response.data.Success) {
        setToastDetails({
          show: true,
          type: "success",
          message: response.data.Results[0].message,
        });
        updateProfile(response.data.Results[0].data, (err, updatedUser) => {
          setAdminProfile(updatedUser);
        });
      } else {
        setToastDetails({
          show: true,
          type: "danger",
          message: response.data.ErrorMessage || "Unable to save record",
        });
      }
    } catch (err) {
      console.log(err);
      setUpdatingProfile(false);
      setToastDetails({
        show: true,
        type: "danger",
        message: "Something went wrong. Unable to save profile",
      });
    }
  };

  const handleCloseToast = () => {
    setToastDetails(null);
  };

  return (
    <Layout>
      <Toastr
        onClose={handleCloseToast}
        details={toastDetails}
        useDefaultDuration
      />
      {updatingProfile && <Loader />}
      <div className="container-fluid container-md mt-5">
        <Tab.Container id="left-tabs-example" defaultActiveKey="category">
          <Row>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="category">Category</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="links">Links</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="profile">Profile</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                <Tab.Pane eventKey="category">
                  <Categories
                    token={token}
                    data={categories}
                    reloadData={reloadData}
                    ReactQuill={ReactQuill}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="links">
                  <AdminLinks
                    token={token}
                    data={adminLinks}
                    reloadData={reloadLinks}
                    categories={categories.map((v) => ({
                      label: v.name,
                      value: v._id,
                    }))}
                    loadData={loadLinks}
                    skip={skip}
                    totalLinks={totalLinks}
                    limit={limit}
                  />
                </Tab.Pane>

                <Tab.Pane eventKey="profile">
                  <ProfileForm
                    data={adminProfile}
                    onSubmit={onUpdateProfile}
                    categories={categories.map((v) => ({
                      label: v.name,
                      value: v._id,
                    }))}
                    processing={updatingProfile}
                  />
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </div>
    </Layout>
  );
};

export default withAdmin(Admin);
