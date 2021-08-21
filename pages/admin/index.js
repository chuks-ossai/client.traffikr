import Layout from "@traffikr/components/Layout";
import withAdmin from "pages/withAdmin";
import React from "react";

const Admin = ({ user, token }) => {
  return (
    <Layout>
      <div>{JSON.stringify(user)}</div>
      <div>{JSON.stringify(token)}</div>
    </Layout>
  );
};

export default withAdmin(Admin);
