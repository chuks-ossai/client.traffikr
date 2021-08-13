import React, { useEffect, useState } from "react";

const Toastr = ({ onClose, details }) => {
  useEffect(() => {
    setTimeout(() => {
      if (details?.show) {
        console.log(details);
        onClose && onClose();
      }
    }, 5000);
  }, [details]);
  return (
    <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 11 }}>
      <div
        id="liveToast"
        className={`toast bg-${details?.type} ${
          details && details.show ? "show" : "hide"
        }`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="toast-header">
          {details?.type === "success" && (
            <i className="las la-check la-2x text-success"></i>
          )}
          {details?.type === "danger" && (
            <i className="las la-exclamation-triangle text-danger"></i>
          )}
          {details?.type === "warning" && (
            <i className="las la-info-circle la-2x"></i>
          )}
          {details?.type === "success" && (
            <strong className="me-auto">Success</strong>
          )}
          {details?.type === "danger" && (
            <strong className="me-auto">Failure</strong>
          )}
          {details?.type === "warning" && (
            <strong className="me-auto">Info</strong>
          )}

          {/* <small>11 mins ago</small> */}
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="toast"
            aria-label="Close"
            onClick={() => onClose && onClose()}
          ></button>
        </div>
        <div className="toast-body">{details?.message}</div>
      </div>
    </div>
  );
};

export default Toastr;
