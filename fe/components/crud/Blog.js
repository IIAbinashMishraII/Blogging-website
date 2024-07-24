import Link from "next/link";
import { useState, useEffect } from "react";
import Router from "next/router";
import dynamic from "next/dynamic";
import { withRouter } from "next/router";
import { getCookie, isAuth } from "../../actions/auth";
import { getCategories } from "../../actions/category";
import { getAllTags } from "../../actions/tag";
import { createBlog } from "../../actions/blog";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false }); // dynamic import agaaain to handle client-side rendering, quill only csr big no for ssr
import "react-quill/dist/quill.snow.css";

const CreateBlog = ({ router }) => {
  const localToBlog = () => {
    if (typeof window === "undefined") {
      return false;
    }
    if (localStorage.getItem("blog")) {
      return JSON.parse(localStorage.getItem("blog"));
    } else {
      return false;
    }
  };
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [body, setBody] = useState(localToBlog());
  const [values, setValues] = useState({
    error: "",
    sizeError: "",
    success: "",
    formData: "",
    title: "",
    hidePublishButton: false,
  });
  const { error, sizeError, success, formData, title, hidePublishButton } =
    values;

  useEffect(() => {
    setValues({ ...values, formData: new FormData() });
    initCategories();
    initTags();
  }, [router]);

  const initCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };
  const initTags = async () => {
    const data = await getAllTags();
    setTags(data);
  };
  const publishBlog = (e) => {
    e.preventDefault();
    console.log("ready to publishBlog");
  };
  const handleChange = (name) => (e) => {
    const value = name === "photo" ? e.target.files[0] : e.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value, formData, error: "" });
  };
  const handleBody = (e) => {
    setBody(e);
    formData.set("body", e);
    if (typeof window !== "undefined") {
      localStorage.setItem("blog", JSON.stringify(e));
    }
  };

  const showCategories = () => {
    return (
      categories &&
      categories.map((c, i) => (
        <li className="list-unstyled">
          <input type="checkbox" className="mr-2" />
          <label className="form-check-label">{c.name}</label>
        </li>
      ))
    );
  };

  const showTags = () => {
    return (
      tags &&
      tags.map((t, i) => (
        <li className="list-unstyled">
          <input type="checkbox" className="mr-2" />
          <label className="form-check-label">{t.name}</label>
        </li>
      ))
    );
  };

  const createBlogForm = () => {
    return (
      <form onSubmit={publishBlog}>
        <div className="form-group">
          <label className="text-muted">Title</label>
          <input
            type="text"
            className="form-control"
            onChange={handleChange("title")}
          />
        </div>
        <div className="form-group">
          <ReactQuill
            modules={CreateBlog.modules}
            formats={CreateBlog.formats}
            value={body}
            placeholder="Hello, World!"
            onChange={handleBody}
          />
        </div>
        <div>
          <button className="btn btn-primary" type="Submit">
            Publish
          </button>
        </div>
      </form>
    );
  };
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-8">
          {createBlogForm()}
          <hr />
          {JSON.stringify(title)}
          <hr />
          {JSON.stringify(body)}
          <hr />
          {JSON.stringify(categories)}
          <hr />
          {JSON.stringify(tags)}
        </div>
        <div className="col-md-4">
          <h5>Categories</h5>
          <hr />
          <ul style={{ maxHeight: "200px", overflowY: "scroll" }}>
            {showCategories()}
          </ul>

          <h5>Tags</h5>
          <ul style={{ maxHeight: "200px", overflowY: "scroll" }}>{showTags()}</ul>

          <hr />
        </div>
      </div>
    </div>
  );
};
CreateBlog.modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { header: [3, 4, 5, 6] }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image", "video"],
    ["clean"],
    ["code-block"],
  ],
};

CreateBlog.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "link",
  "image",
  "video",
  "code-block",
];
export default withRouter(CreateBlog);
