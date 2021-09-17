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
const ReactQuill = dynamic(() => import("react-quill"));

const Admin = ({ token }) => {
  const [categories, setCategories] = useState([]);
  const [adminLinks, setAdminLinks] = useState([]);
  const [limit] = useState(4);
  const [skip, setSkip] = useState(0);
  const [totalLinks, setTotalLinks] = useState(0);
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
      `${baseURL}/link/adminlinks?skip=${skp}&limit=${lmt}`,
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

  return (
    <Layout>
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
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </div>
    </Layout>
  );
};

export default withAdmin(Admin);
