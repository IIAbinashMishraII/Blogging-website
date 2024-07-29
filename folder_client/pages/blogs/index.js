import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/Layout";
import React, { useState } from "react";
import { listEverythingBlog } from "../../actions/blog";
import { API, DOMAIN, APP_NAME } from "../../config";
import moment from "moment";
import Card from "../../components/blog/Card";
import { withRouter } from "next/router";

const Blogs = ({ blogs, categories, tags, size, router }) => {
  const head = () => {
    <Head>
      <Title>Blogs | {APP_NAME}</Title>
      <meta name="description" content="Blogs on everything and anything." />
      <link rel="canonical" href={`${DOMAIN}${router.pathname}`} />
      <meta property="og:title" content={`Blogging my way up | ${APP_NAME}`} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${DOMAIN}${router.pathname}`} />
      <meta property="og:site_name" content="website" />
      <meta property="og:image" content="website" />
      <meta property="og:image:secure_url" content="website" />
      <meta property="og:image:type" content="website" />
    </Head>;
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
  const showAllblogs = () => {
    return blogs.map((blog, index) => {
      return (
        <article key={index}>
          <Card blog={blog} />
          <hr />
        </article>
      );
    });
  };

  return (
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
        <div className="container-fluid">
          <div className="col-md-12">{showAllblogs()}</div>
        </div>
      </main>
    </Layout>
  );
};

Blogs.getInitialProps = async () => {
  const data = await listEverythingBlog();
  try {
    if (data.error || !data) {
      console.log(data.error);
    } else {
      return { blogs: data.blogs, categories: data.categories, tags: data.tags, size: data.size };
    }
  } catch (error) {
    console.log(error);
  }
};

export default withRouter(Blogs);
