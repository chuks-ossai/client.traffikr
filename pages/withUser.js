import { baseURL } from "app-config";
import axios from "axios";

const { getCookie } = require("helpers/auth");

const withUser = (Page) => {
  const WithAuthUser = (props) => <Page {...props} />;

  WithAuthUser.getInitialProps = async (ctx) => {
    let user = null;
    let links = null;
    const token = await getCookie("auth_tok", ctx.req);
    if (token) {
      try {
        const res = await axios.get(`${baseURL}/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            ContentType: "application/json",
          },
        });
        if (res?.data?.Success && res?.data?.Results) {
          user = res.data.Results[0].profile;
          links = res.data.Results[0].links;
        } else {
          user = null;
          links = null;
        }
      } catch (err) {
        if (err?.response?.status === 401) {
          user = null;
          links = null;
        }
      }
    }

    if (user === null) {
      ctx.res.writeHead(302, {
        Location: "/",
      });
    } else {
      return {
        ...(Page.getInitialProps ? Page.getInitialProps(ctx) : {}),
        user,
        token,
        links,
      };
    }
  };
  return WithAuthUser;
};

export default withUser;
