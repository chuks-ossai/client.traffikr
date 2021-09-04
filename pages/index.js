import Layout from "@traffikr/components/Layout";
import { baseURL } from "app-config";
import axios from "axios";
import Link from "next/link";
import { useEffect } from "react";
import Avatar from "react-avatar";

export default function Home({ categories }) {
  return (
    <Layout>
      <div className="container mt-5">
        <div className="row">
          <div className="col-12 col-md-6 offset-md-3"></div>
        </div>
        <div className="row">
          {categories.map((category) => (
            <div className="col-lg-3 col-md-4 mb-3" key={category._id}>
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
          ))}
        </div>
      </div>
    </Layout>
  );
}

Home.getInitialProps = async () => {
  try {
    const response = await axios.get(`${baseURL}/category/getAll`);
    return {
      categories: response.data.Results,
    };
  } catch (err) {
    return {
      categories: [],
    };
  }
};
