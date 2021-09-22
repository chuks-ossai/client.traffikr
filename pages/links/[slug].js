import Image from "next/image";
import Layout from "@traffikr/components/Layout";
import { baseURL } from "app-config";
import axios from "axios";
import { formatDistance } from "date-fns";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import PublicLayout from "@traffikr/components/PublicLayout";

const Links = ({ query, links, totalLinks, limit, skip, category }) => {
  const [state, setState] = useState({
    links,
    totalLinks,
    limit,
    skip,
    category,
    popularLinks: [],
  });

  useEffect(() => {
    loadPopularLinks();
  }, []);

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

  const loadPopularLinks = async () => {
    try {
      const res = await axios.get(`${baseURL}/link/trending/get/${query.slug}`);
      if (res.data.Success && res.data.Results) {
        setState({ ...state, popularLinks: res.data.Results });
      }
    } catch (err) {
      console.log(err);
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
      loadPopularLinks();
    }
  };

  const getImageContent = ({ img: { url }, slug }) => (
    <Image
      src={url}
      alt={slug}
      layout="responsive"
      width="100%"
      height="100%"
    />
  );

  const getMainContent = ({ links, totalLinks, limit }) => (
    <InfiniteScroll
      dataLength={links.length} //This is important field to render the next data
      next={() => handleLoadMore()}
      hasMore={totalLinks > 0 && totalLinks >= limit}
      hasChildren={totalLinks}
      loader={<h4>Loading...</h4>}
    >
      {links.map((link) => (
        <div className="alert alert-primary p-2" key={link._id}>
          <div className="container">
            <div className="row">
              <div
                className="col-md-8"
                onClick={() => handleUpdateClickCount(link._id)}
              >
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  <h5 className="pt-2">{link.title}</h5>
                  <h6 className="pt-2 text-danger" style={{ fontSize: 12 }}>
                    {link.url}
                  </h6>
                </a>

                <div className="row">
                  <div className="col-12">
                    <span className="badge bg-info me-2">{link.type}</span>
                    <span className="badge bg-info me-5">{link.medium}</span>
                    {link.categories &&
                      link.categories.map((category) => (
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
                    {link?.postedBy?.username}
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
    </InfiniteScroll>
  );

  // HH.Cr.n44SkdtE(
  // PolygonEdge

  // polyhqzf
  // ovfUK4bCzJDT

  const getSideContent = ({ popularLinks }) =>
    popularLinks.map((link) => (
      <div className="alert alert-success p-2" key={link._id}>
        <div className="row">
          <div className="col-12">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleUpdateClickCount(link._id)}
            >
              <h5 className="pt-2">{link.title}</h5>
              <h6 className="pt-2 text-danger" style={{ fontSize: 12 }}>
                {link.url}
              </h6>
            </a>
          </div>
        </div>
        <div className="row mb-1">
          <div className="col-12 col-md-6">
            <span className="badge bg-info me-2">{link.type}</span>
            <span className="badge bg-info">{link.medium}</span>
          </div>
          <div className="col-12 col-md-6">
            {link.categories &&
              link.categories.map((category) => (
                <span className="badge bg-warning me-2" key={category._id}>
                  {category.name}
                </span>
              ))}
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-md-6">
            <span className="pull-right" style={{ fontSize: 10 }}>
              <span className="text-muted">
                Created:{" "}
                {formatDistance(new Date(link.createdAt), new Date(), {
                  addSuffix: true,
                })}
              </span>
            </span>
          </div>
          <div className="col-12 col-md-6 text-end">
            <div style={{ fontSize: 14 }}>
              <span className="text-muted">Clicks:&nbsp;</span>
              <span className="fw-bold">{link.clicks}</span>
            </div>
          </div>
        </div>
      </div>
    ));

  return (
    <Layout>
      <PublicLayout
        pageTitle={`${state.category?.name} - URL/Links`}
        pageTitleContent={getImageContent(state.category)}
        subTitle={`${state.links.length} Link${
          state.links.length > 1 && "s"
        } Loaded`}
        richText={state.category?.description}
        mainContent={getMainContent(state)}
        sideContentTitle="Trending Links"
        sideContent={getSideContent(state)}
        pageImg={state.category?.img?.url}
      />
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
