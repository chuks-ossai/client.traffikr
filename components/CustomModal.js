import { Modal } from "react-bootstrap";

const CustomModal = ({ show, onClose, title, children, size }) => {
  return (
    <Modal
      size={size || "md"}
      show={show}
      onHide={(evt) => onClose && onClose(evt)}
      aria-labelledby="example-modal-sizes-title-sm"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-sm">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
};

export default CustomModal;
