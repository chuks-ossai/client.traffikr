import React from "react";

const Alert = ({ info, onCancel, processing, onConfirm }) => {
  return (
    <>
      <div className="mb-4">{info}</div>
      <div className="mb-3 d-flex justify-content-end align-items-center">
        <button
          type="button"
          className="btn btn-outline-secondary mx-3"
          onClick={(e) => onCancel && onCancel(e)}
        >
          Close
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={(e) => onConfirm && onConfirm(e)}
        >
          {processing ? "Processing..." : "Proceed"}
        </button>
      </div>
    </>
  );
};

export default Alert;
