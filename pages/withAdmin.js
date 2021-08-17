import { baseURL } from "app-config";
import axios from "axios";

const { getCookie } = require("helpers/auth");

const withAdmin = (Page) => {
  const WithAuthAdmin = (props) => <Page {...props} />;

  WithAuthAdmin.getInitialProps = async (ctx) => {
    let user = null;
    const token = await getCookie("auth_tok", ctx.req);
    if (token) {
      try {
        const res = await axios.get(`${baseURL}/user/admin/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            ContentType: "application/json",
          },
        });
        if (res.data.Success && res.data.Results) {
          user = res.data.Results;
        } else {
          user = null;
        }
      } catch (err) {
        console.log(err);
        if (err.response.status === 401) {
          user = null;
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
      };
    }
  };
  return WithAuthAdmin;
};

export default withAdmin;
