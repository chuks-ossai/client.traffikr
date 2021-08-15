import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as jwt from "jsonwebtoken";
import Loader from "@traffikr/components/Loader";
import axios from "axios";
import { baseURL } from "app-config";
import Link from "next/link";

const Activate = () => {
  const router = useRouter();
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!state && router && router.query && router.query.token) {
      const { token } = router.query;
      const { data } = jwt.decode(token);
      handleActivate(token, data);
    }

    if (state) {
      console.log(state);
    }

    return () => {};
  }, [router, state]);

  const handleActivate = async (token, data) => {
    console.log("state", state);
    const res = await axios.post(`${baseURL}/activate-account`, { token });

    try {
      setLoading(false);
      if (res.data.Success) {
        setState({
          data,
          activated: res.data.Success,
        });
      } else {
        setState({
          data,
          activated: false,
          message: res.data.ErrorMessage,
        });
      }
    } catch (e) {
      setLoading(false);
      setState({
        data,
        activated: false,
      });
    }
  };

  if (loading && !state) {
    return <Loader />;
  }
  return (
    <div className="container" style={{ height: "100vh" }}>
      <div className="row h-100">
        {state?.activated ? (
          <div className="col-12 col-md-6 offset-md-3 m-auto">
            <div className="card text-center">
              <div className="card-header">
                <h1 className="text-success">Account Activation Successful!</h1>
              </div>
              <div className="card-body">
                <h5 className="card-title">Congratulations</h5>
                <p className="card-text">
                  {state?.data?.emailAddress} has been activated successfully
                </p>
                <Link href="/login">
                  <a className="btn btn-primary">Back to Login Page</a>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="col-12 col-md-6 offset-md-3 m-auto">
            <div className="card text-center">
              <div className="card-header">
                <h1 className="text-danger">Account Activation Failed!</h1>
              </div>
              <div className="card-body">
                <h5 className="card-title">Unable to Activate Account</h5>
                <p className="card-text">
                  {state?.data?.emailAddress} could not be activated.{" "}
                  {state?.message ||
                    `Please try
                  again later or start the registration process again`}
                </p>
                <Link href="/register">
                  <a className="btn btn-primary">Back to Register Page</a>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Activate;
