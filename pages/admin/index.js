import Layout from "@traffikr/components/Layout";
import withAdmin from "pages/withAdmin";
import Tab from "react-bootstrap/Tab";
import { Col, Nav, Row } from "react-bootstrap";
import Categories from "@traffikr/components/Categories";
import axios from "axios";
import { baseURL } from "app-config";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"));

const Admin = ({ token }) => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    loadCategories();
  }, []);

  const reloadData = () => {
    loadCategories();
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
                  <Nav.Link eventKey="second">Links</Nav.Link>
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
                <Tab.Pane eventKey="second">
                  {/* {JSON.stringify(categories)} */}
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
