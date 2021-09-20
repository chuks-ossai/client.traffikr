import React from "react";

const PublicLayout = ({
  pageTitle,
  subTitle,
  mainContent,
  sideContent,
  sideContentTitle,
  pageTitleContent,
  richText,
}) => {
  return (
    <>
      <div className="row my-5">
        <div className="col-12 col-md-9">
          <h1 className="h1 font-weight-bold">{pageTitle}</h1>
        </div>
        <div className="col-12 col-md-3">{pageTitleContent}</div>
        <hr />
      </div>
      {richText && (
        <div className="row my-5">
          <div className="col-12 col-md-9">{richText}</div>
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
