import Layout from "@traffikr/components/Layout";
import withUser from "pages/withUser";
import React, { useEffect, useState } from "react";

import Tab from "react-bootstrap/Tab";
import { Col, Nav, Row } from "react-bootstrap";
import UserLinks from "@traffikr/components/UserLinks";
import axios from "axios";
import { baseURL } from "app-config";

const User = ({ user, links, token }) => {
  const [categories, setCategories] = useState([]);
  const [userLinks, setUserLinks] = useState([]);

  useEffect(() => {
    loadCategories();
    loadLinks();
    console.log("load links");
  }, []);

  const reloadData = () => {
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
      setCategories(
        res.data.Results.map((category) => ({
          label: category.name,
          value: category._id,
        }))
      );
    }
  };

  const loadLinks = async () => {
    const res = await axios.get(`${baseURL}/link/my/getAll`, {
      headers: {
        Authorization: `Bearer ${token}`,
        ContentType: "application/json",
      },
    });
    if (res.data.Success && res.data.Results) {
      console.log(res.data);
      setUserLinks(res.data.Results);
    } else {
      console.log(res.data);
    }
  };

  return (
    <Layout>
      <div className="container-fluid container-md mt-5">
        <Tab.Container id="left-tabs-example" defaultActiveKey="links">
          <Row>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column">
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
                <Tab.Pane eventKey="links">
                  <UserLinks
                    token={token}
                    data={userLinks || links}
                    reloadData={reloadData}
                    categories={categories}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="profile">{JSON.stringify(user)}</Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </div>
    </Layout>
  );
};

export default withUser(User);
