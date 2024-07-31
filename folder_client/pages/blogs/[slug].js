import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/Layout";
import React, { useState } from "react";
import { readBlog } from "../../actions/blog";
import { API, DOMAIN, APP_NAME } from "../../config";
import { withRouter } from "next/router";
import moment from "moment";
import parse from "html-react-parser";

const SingleBlog = ({ blog }) => {
  const showBlogCategories = (blog) => {
    return blog.categories.map((c, i) => (
      <Link
        key={i}
        href={`/categories/${c.slug}`}
        className="btn btn-outline-primary mr-1 ml-1 mt-3"
      >
        {c.name}
      </Link>
    ));
  };
  const showBlogTags = (blog) => {
    return blog.tags.map((t, i) => (
      <Link key={i} href={`/tags/${t.slug}`} className="btn btn-primary mr-1 ml-1 mt-3">
        {t.name}
      </Link>
    ));
  };
  return (
    <React.Fragment>
      <Layout>
        <Head>
          <title>
            {blog.title} | {APP_NAME}
          </title>
          <meta name="description" content={blog.mdesc} />
          <link rel="canonical" href={`${DOMAIN}/blogs/${blog.slug}`} />
          <meta property="og:title" content={`${blog.title} | ${APP_NAME}`} />
          <meta property="og:description" content={blog.mdesc} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={`${DOMAIN}/blogs/${blog.slug}`} />
          <meta property="og:site_name" content={APP_NAME} />
          <meta property="og:image" content={`${API}/blog/photo/${blog.slug}`} />
          <meta property="og:image:secure_url" content={`${API}/blog/photo/${blog.slug}`} />
          <meta property="og:image:type" content="image/jpg" />
        </Head>
        <main>
          <article>
            <div className="container-fluid">
              <section>
                <div className="row" style={{ marginTop: "-30px" }}>
                  <img
                    src={`${API}/blog/photo/${blog.slug}`}
                    alt={blog.title}
                    className="img img-fluid featured-image"
                  />
                </div>
              </section>
              <section>
                <h1 className="display-2 pb-3 text-center font-weight-bold">{blog.title}</h1>
                <p className="lead pt-1 pb-1">
                  Written by {blog.postedBy.name} | Published {moment(blog.updatedAt).fromNow()}
                </p>
                <div className="pb-3">
                  {showBlogCategories(blog)}
                  {showBlogTags(blog)}
                </div>
              </section>
              <div className="container">
                <section>
                  {/* <div className="col-md-12 lead" dangerouslySetInnerHTML={{ __html: blog.body }} /> */}
                  <div className="col-md-12 lead">{parse(blog.body)}</div>
                </section>
              </div>
              <div className="container pb-5">
                <h4 className="text-center pt-5 pb-5 h2">Related blogs</h4>
                <hr />
                <p>Show comments</p>
              </div>
            </div>
          </article>
        </main>
      </Layout>
    </React.Fragment>
  );
};

SingleBlog.getInitialProps = async ({ query }) => {
  const data = await readBlog(query.slug);
  // console.log(data);
  try {
    if (data.error) {
      console.log(data.error);
      return { blog: {} };
    } else {
      return { blog: data };
    }
  } catch (error) {
    console.log(error);
    return { blog: {} };
  }
};

export default SingleBlog;
