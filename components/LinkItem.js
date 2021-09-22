import { formatDistance } from "date-fns";

const LinkItem = ({ link, onDeleteIconClick, onEditClick }) => {
  return (
    <div className="alert alert-primary p-2">
      <div className="container">
        <div className="row">
          <div className="col-md-7">
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              <h5 className="pt-2">{link.title}</h5>
              <h6 className="pt-2 text-danger" style={{ fontSize: 12 }}>
                {link.url}
              </h6>
            </a>

            <div className="row">
              <div className="col-12 d-flex align-items-center justify-content-between">
                <div>
                  <span className="badge bg-info me-2">{link.type}</span>
                  <span className="badge bg-info">{link.medium}</span>
                </div>
                <div>
                  {link.categories &&
                    link.categories.map((category, idx) => (
                      <span
                        className="badge bg-warning me-2"
                        key={category._id}
                      >
                        {category.name}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 d-flex flex-column align-items-end justify-content-between">
            <span className="pull-right">
              <span className="text-muted">
                Created:{" "}
                {formatDistance(new Date(link.createdAt), new Date(), {
                  addSuffix: false,
                })}
              </span>
            </span>
            <span className="d-block pull-right">
              <span className="text-muted">
                Last Updated:{" "}
                {formatDistance(new Date(link.updatedAt), new Date(), {
                  addSuffix: false,
                })}
              </span>
            </span>
            <div>
              <span className="text-muted">Clicks:&nbsp;</span>
              <span className="fw-bold">{link.clicks}</span>
            </div>
          </div>
          <div className="col-md-1 d-flex align-items-center">
            <span
              className="badge bg-secondary rounded-pill me-2"
              style={{ cursor: "pointer" }}
              onClick={(e) => onEditClick && onEditClick(link)}
            >
              <i className="las la-edit"></i>
            </span>
            <span
              className="badge bg-danger rounded-pill"
              style={{ cursor: "pointer" }}
              onClick={(e) => onDeleteIconClick && onDeleteIconClick(link._id)}
            >
              <i className="las la-trash"></i>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkItem;
