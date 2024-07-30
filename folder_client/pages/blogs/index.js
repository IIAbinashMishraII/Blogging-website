import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/Layout";
import React, { useState } from "react";
import { listEverythingBlog } from "../../actions/blog";
import { API, DOMAIN, APP_NAME } from "../../config";
import moment from "moment";
import Card from "../../components/blog/Card";
import { withRouter } from "next/router";

const Blogs = ({ blogs, categories, tags, totalBlogs, blogsLimit, blogsSkip, router }) => {
  const head = () => (
    <Head>
      <title>Blogs | {APP_NAME}</title>
      <meta name="description" content="Blogs on everything and anything." />
      <link rel="canonical" href={`${DOMAIN}${router.pathname}`} />
      <meta property="og:title" content={`Blogging my way up | ${APP_NAME}`} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${DOMAIN}${router.pathname}`} />
      <meta property="og:site_name" content={`${APP_NAME}`} />
      <meta property="og:image" content="/static/images/blogged.jpg" />
      <meta property="og:image:secure_url" content="/static/images/blogged.jpg" />
      <meta property="og:image:type" content="image/jpg" />
    </Head>
  );

  const [limit, setLimit] = useState(blogsLimit);
  const [skip, setSkip] = useState(blogsSkip);
  const [size, setSize] = useState(totalBlogs);
  const [loadedBlogs, setLoadedBlogs] = useState([]);

  const loadMore = async () => {
    let toSkip = skip + limit;
    const data = await listEverythingBlog(toSkip, limit);
    if (data.error) {
      console.log(data.error);
    } else {
      setLoadedBlogs([...loadedBlogs, ...data.blogs]);
      setSize(data.size);
      setSkip(toSkip);
    }
  };

  const loadMoreButton = () => {
    return (
      size > 0 &&
      size >= limit && (
        <button onClick={loadMore} variant="contained" className="btn btn-primary btn-lg">
          Load More
        </button>
      )
    );
  };

  const showAllCategories = () => {
    return categories.map((c, i) => (
      <Link href={`/categories/${c.slug}`} key={i} className="btn btn-primary mr-1 ml-1 mt-3">
        {c.name}
      </Link>
    ));
  };
  const showAllTags = () => {
    return tags.map((t, i) => (
      <Link href={`/tags/${t.slug}`} key={i} className="btn btn-primary mr-1 ml-1 mt-3">
        {t.name}
      </Link>
    ));
  };
  const showAllBlogs = () =>
    blogs.map((blog, index) => {
      return (
        <article key={index}>
          <Card blog={blog} />
          <hr />
        </article>
      );
    });

  const showLoadedBlogs = () =>
    loadedBlogs.map((blog, index) => {
      return (
        <article key={index}>
          <Card blog={blog} />
          <hr />
        </article>
      );
    });

  return (
    <React.Fragment>
      {head()}
      <Layout>
        <main>
          <div className="container-fluid">
            <header>
              <div className="col-md-12 pt-3">
                <h1 className="display-4 font-weight-bold text-center">Blogging to get better</h1>
              </div>
              <section>
                <div className="pb-5 text-center">
                  {showAllCategories()}
                  <br />
                  {showAllTags()}
                </div>
              </section>
            </header>
          </div>
          <div className="container-fluid">{showAllBlogs()}</div>
          <div className="container-fluid">{showLoadedBlogs()}</div>
          <div className="text-center pt-5 pb-5">{loadMoreButton()}</div>
        </main>
      </Layout>
    </React.Fragment>
  );
};

Blogs.getInitialProps = async () => {
  let skip = 0;
  let limit = 2;
  const data = await listEverythingBlog(skip, limit);
  try {
    if (data.error || !data) {
      console.log(data.error);
    } else {
      return {
        blogs: data.blogs,
        categories: data.categories,
        tags: data.tags,
        totalBlogs: data.size,
        blogsLimit: limit,
        blogsSkip: skip,
      };
    }
  } catch (error) {
    console.log(error);
  }
};

export default withRouter(Blogs);
