import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/Layout";
import React, { useState } from "react";
import { listEverythingBlog } from "../../actions/blog";
import { API } from "../../config";
import moment from "moment";
import Card from "../../components/blog/Card";

const Blogs = ({ blogs, categories, tags, size }) => {
  const showAllCategories = () => {
    return blogs.map((c, i) => (
      <Link href={`/categories/${c.slug}`} key={i} className="btn btn-primary mr-1 ml-1 mt-3">
        {c.name}
      </Link>
    ));
  };
  const showAllTags = () => {
    return blogs.map((t, i) => (
      <Link href={`/categories/${t.slug}`} key={i} className="btn btn-primary mr-1 ml-1 mt-3">
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
  if (data.error || !data) {
    console.log(data.error);
  } else {
    return { blogs: data.blogs, categories: data.categories, tags: data.tags, size: data.size };
  }
};

export default Blogs;
