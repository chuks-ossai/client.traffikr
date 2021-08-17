import Layout from "@traffikr/components/Layout";
import withUser from "pages/withUser";
import React from "react";

const User = ({ user, token }) => {
  return (
    <Layout>
      <div>{JSON.stringify(user)}</div>
      <div>{JSON.stringify(token)}</div>
    </Layout>
  );
};

export default withUser(User);
