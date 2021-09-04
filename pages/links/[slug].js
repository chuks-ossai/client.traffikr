import renderHTML from "react-render-html";

import Layout from "@traffikr/components/Layout";
import { baseURL } from "app-config";
import axios from "axios";
import { formatDistance } from "date-fns";
import { useState } from "react";

const Links = ({ query, links, totalLinks, limit, skip, category }) => {
  const [state, setState] = useState({
    links,
    totalLinks,
    limit,
    skip,
    category,
  });

  const loadData = async (skp, lmt) => {
    const response = await axios.get(
      `${baseURL}/category/get/${query.slug}?skip=${skp}&limit=${lmt}`
    );
    if (response.data.Success && response.data.Results) {
      setState({
        ...state,
        links: [...state.links, ...response.data.Results.links],
        totalLinks: response.data.Results.links.length,
        skip: skp,
      });
    }
  };

  const handleLoadMore = () => {
    const toSkip = state.skip + state.limit;
    loadData(toSkip, state.limit);
  };

  const handleUpdateClickCount = async (linkId) => {
    const response = await axios.put(
      `${baseURL}/link/update-clicks/${linkId}`,
      {}
    );
    if (response.data.Success && response.data.Results) {
      const newClickCount = response.data.Results[0].data.clicks;
      setState({
        ...state,
        links: state.links.map((link) => {
          if (link._id === linkId) {
            link.clicks = newClickCount;
          }
          return link;
        }),
      });
    }
  };
  return (
    <Layout>
      <div className="row my-5">
        <div className="col-sm-12 col-md-8 ">
          <h1 className="display-4 font-weight-bold">
            {state.category?.name} - URL/Links
          </h1>
          <div className="lead alert alert-secondary p-4">
            {renderHTML(state.category?.description || "")}
          </div>
        </div>
        <div className="col-md-4">
          <img
            src={state.category.img.url}
            alt={state.category.slug}
            style={{ width: "auto", maxHeight: 200 }}
          />
          {/* <div>{JSON.stringify(category)}</div> */}
        </div>
        <hr />
      </div>
      <div className="row mb-3">
        <div className="col-sm-12 col-md-8">
          <h4 className="display-6 text-muted">
            {state.links.length} Link{state.links.length > 1 && "s"} Loaded
          </h4>
        </div>
        <div className="col-md-4">
          <h4 className="display-6 text-muted">Most Popular Links</h4>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-md-8">
          {state.links.map((link, idx) => (
            <div className="alert alert-primary p-2" key={idx}>
              <div className="container">
                <div className="row">
                  <div
                    className="col-md-8"
                    onClick={() => handleUpdateClickCount(link._id)}
                  >
                    <a href={link.url} target="_blank">
                      <h5 className="pt-2">{link.title}</h5>
                      <h6 className="pt-2 text-danger" style={{ fontSize: 12 }}>
                        {link.url}
                      </h6>
                    </a>

                    <div className="row">
                      <div className="col-12">
                        <span className="badge bg-info me-2">{link.type}</span>
                        <span className="badge bg-info me-5">
                          {link.medium}
                        </span>
                        {link.categories.map((category, idx) => (
                          <span className="badge bg-warning me-2" key={idx}>
                            {category.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 d-flex flex-column align-items-end justify-content-between">
                    <span className="pull-right">
                      <span className="text-muted">
                        Created:{" "}
                        {formatDistance(new Date(link.createdAt), new Date(), {
                          addSuffix: true,
                        })}{" "}
                        by&nbsp;
                      </span>
                      <span className="fw-bold text-dark">
                        {link.postedBy.username}
                      </span>
                    </span>
                    <div>
                      <span className="text-muted">Clicks:&nbsp;</span>
                      <span className="fw-bold">{link.clicks}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {state.totalLinks > 0 && state.totalLinks >= state.limit && (
            <div className="row">
              <div className="col-12 text-center">
                <button
                  className="btn btn-outline-primary"
                  onClick={handleLoadMore}
                >
                  Load More
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="col-md-4">{JSON.stringify(links)}</div>
      </div>
    </Layout>
  );
};

Links.getInitialProps = async ({ query, req }) => {
  const skip = 0;
  const limit = 1;
  const response = await axios.get(
    `${baseURL}/category/get/${query.slug}?skip=${skip}&limit=${limit}`
  );
  return {
    query,
    links: response.data.Results.links,
    totalLinks: response.data.Results.links.length,
    limit,
    skip,
    category: response.data.Results.category,
  };
};

export default Links;
