import Link from "next/link";
import React, { useState } from "react";
import { API } from "../../config";
import moment from "moment";
import parse from "html-react-parser";

const RelatedCard = ({ blog }) => {
  return (
    <>
      <div className="card">
        <section>
          <a href={`/blogs/${blog.slug}`}>
            <img
              className="img img-fluid"
              style={{ maxHeight: "auto", width: "100%" }}
              src={`${API}/blog/photo/${blog.slug}`}
              alt={blog.title}
            />
          </a>
        </section>
        <div className="card-body">
          <section>
            <a href={`/blogs/${blog.slug}`}>
              <h5 className="card-title">{blog.title}</h5>
            </a>
            <p className="card-text">{parse(blog.excerpt)}</p>
          </section>
        </div>
        <div className="card-body">
          <a className="btn btn-primary pt-2" href={`/blogs/${blog.slug}`}>
            Read more...
          </a>
          Written by {blog.postedBy.name} | Published {moment(blog.updatedAt).fromNow()}
        </div>
      </div>
    </>
  );
};
export default RelatedCard;
