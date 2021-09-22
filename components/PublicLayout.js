import React from "react";
import Head from "next/head";
import renderHTML from "react-render-html";
import { appDomain, appName } from "app-config";

const stripHTML = (data) => data?.replace(/<\/?[^>]+(>|$)/g, "");

const PublicLayout = ({
  pageTitle,
  subTitle,
  mainContent,
  sideContent,
  sideContentTitle,
  pageTitleContent,
  richText,
  pageDescription,
  pageImg,
}) => {
  return (
    <>
      <Head>
        <title>
          {pageTitle} | {appName}{" "}
        </title>
        <meta
          name="description"
          content={
            stripHTML(richText?.substring(0, 160)) ||
            pageDescription.substring(0, 160)
          }
        />
        <meta property="og:title" content={pageTitle} />
        <meta
          property="og:description"
          content={
            stripHTML(richText?.substring(0, 160)) ||
            pageDescription.substring(0, 160)
          }
        />
        <meta property="og:url" content={appDomain} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={pageImg} />
        <meta property="og:image:secure_url" content={pageImg} />
      </Head>

      <div className="row my-5">
        <div
          className="col-12 col-md-9 d-flex align-items-end mb-3 mb-md-0 p-0"
          style={{ borderBottom: "1px solid #e2e3e4" }}
        >
          <h1 className="h1 font-weight-bold">{pageTitle}</h1>
        </div>
        <div className="col-12 col-md-3">{pageTitleContent}</div>
      </div>
      {richText && (
        <div className="row my-5">
          <div className="col-12 col-md-9">
            <div className="lead alert alert-secondary p-4">
              {renderHTML(richText)}
            </div>
          </div>
        </div>
      )}

      <div className="row mb-3">
        <div className="col-sm-12 col-md-9">
          <h5 className="h5 text-muted mb-3">{subTitle}</h5>
          <div className="row">
            <div className="col-12">
              <div className="row">{mainContent}</div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <h5 className="h5 text-muted mb-3">{sideContentTitle}</h5>
          <div className="row mb-1">
            <div className="col-12">{sideContent}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PublicLayout;
