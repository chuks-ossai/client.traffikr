import Layout from "@traffikr/components/Layout";
import { baseURL } from "app-config";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import Avatar from "react-avatar";
import { formatDistance } from "date-fns";
import PublicLayout from "@traffikr/components/PublicLayout";

export default function Home({ categories }) {
  const [popularLinks, setPopularLinks] = useState([]);

  useEffect(() => {
    loadPopularLinks();
  }, []);

  const loadPopularLinks = async () => {
    try {
      const res = await axios.get(`${baseURL}/link/trending/getAll`);
      if (res.data.Success && res.data.Results) {
        setPopularLinks(res.data.Results);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleClickCount = async (linkId) => {
    try {
      const response = await axios.put(
        `${baseURL}/link/update-clicks/${linkId}`,
        {}
      );
      if (response.data.Success && response.data.Results) {
        loadPopularLinks();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getMainContent = (cat) =>
    cat &&
    cat.map((category) => (
      <div
        className="col-lg-3 col-md-4 mb-3"
        key={category._id}
        style={{ maxHeight: 80 }}
      >
        <div className="shadow bg-white rounded d-flex align-items-center justify-content-start px-3 py-2 h-100">
          {category.img && category.img.url ? (
            <img
              className="img-fluid me-3"
              width="50"
              height="50"
              src={category?.img?.url}
              alt={category.slug}
            />
          ) : (
            <Avatar name={category.name} className="cards__item__img" />
          )}

          <h5 className="text-break">
            <Link href={`links/${category.slug}`}>
              <a>{category.name}</a>
            </Link>
          </h5>
        </div>
      </div>
    ));

  const getSideContent = (lnks) =>
    lnks.map((link) => (
      <div className="alert alert-primary p-2" key={link._id}>
        <div className="row">
          <div className="col-12">
            <a
              href={link.url}
              target="_blank"
              onClick={() => handleClickCount(link._id)}
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
        pageTitle="Categories"
        subTitle={`${categories.length} Categor${
          categories.length > 1 ? "ies" : "y"
        }      Loaded`}
        mainContent={getMainContent(categories)}
        sideContentTitle="Trending Links"
        sideContent={getSideContent(popularLinks)}
        pageDescription="Browse topics to view users' published links to Tutorials, Articles, News, Videos, Books, etc. See all top rated links and promote your link through this site"
      />
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    const response = await axios.get(`${baseURL}/category/getAll`);

    return {
      props: {
        categories: response.data.Results,
      },
    };
  } catch (err) {
    return {
      props: {
        categories: [],
      },
    };
  }
}
