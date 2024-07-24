import Link from "next/link";
import { useState, useEffect } from "react";
import Router from "next/router";
import dynamic from "next/dynamic";
import { withRouter } from "next/router";
import { getCookie, isAuth } from "../../actions/auth";
import { getCategories } from "../../actions/category";
import { getAllTags } from "../../actions/tag";
import { createBlog } from "../../actions/blog";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false }); // dynamic import agaaain to handle client-side rendering, quill only csr, no ssr
import "react-quill/dist/quill.snow.css";
import { QuillModules, QuillFormats } from "../../helpers/quill";

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
  const [checked, setChecked] = useState([]);
  const [checkedTag, setCheckedTag] = useState([]);
  const [body, setBody] = useState(localToBlog());
  const [values, setValues] = useState({
    error: "",
    sizeError: "",
    success: "",
    formData: "",
    title: "",
    hidePublishButton: false,
  });
  const { error, sizeError, success, formData, title, hidePublishButton } = values;
  const token = getCookie("token");
  useEffect(() => {
    setValues({ ...values, formData: new FormData() });
    initCategories();
    initTags();
  }, [router]);

  const initCategories = async () => {
    const data = await getCategories();
    if (data.error) {
      setValues({ ...values, error: data.error });
    } else {
      setCategories(data);
    }
  };
  const initTags = async () => {
    const data = await getAllTags();
    if (data.error) {
      setValues({ ...values, error: data.error });
    } else {
      setTags(data);
    }
  };
  const publishBlog = async (e) => {
    e.preventDefault();
    const data = await createBlog(formData, token);
    // console.log(data);
    if (data.error) {
      setValues({ ...values, error: data.error, success: "" });
    } else {
      setValues({
        ...values,
        title: "",
        error: "",
        success: `A new blog titled ${data.blog.title} is created`,
      });
      setBody("");
      setCategories([]);
      setTags([]);
    }
  };
  const handleChange = (name) => async (e) => {
    const value = name === "photo" ? e.target.files[0] : e.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value, formData, error: "", success: "" });
  };

  const handleBody = async (e) => {
    setBody(e);
    formData.set("body", e);
    if (typeof window !== "undefined") {
      localStorage.setItem("blog", JSON.stringify(e));
    }
    setValues({ ...values, error: "", success: "" });
  };
  const handleToggle = (c) => async () => {
    setValues({ ...values, error: "" });
    const clickedCategory = checked.indexOf(c);
    const allCategories = [...checked];
    if (clickedCategory === -1) {
      allCategories.push(c);
    } else {
      allCategories.splice(clickedCategory, 1);
    }
    setChecked(allCategories);
    formData.set("categories", allCategories);
  };

  const handleTagsToggle = (t) => async () => {
    setValues({ ...values, error: "" });
    const clickedTag = checkedTag.indexOf(t);
    const allTags = [...checkedTag];
    if (clickedTag === -1) {
      allTags.push(t);
    } else {
      allTags.splice(clickedTag, 1);
    }
    setCheckedTag(allTags);
    formData.set("tags", allTags);
  };

  const showCategories = () => {
    return (
      categories &&
      categories.map((c, i) => (
        <li className="list-unstyled">
          <input onChange={handleToggle(c._id)} type="checkbox" className="mr-2" />
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
          <input onChange={handleTagsToggle(t._id)} type="checkbox" className="mr-2" />
          <label className="form-check-label">{t.name}</label>
        </li>
      ))
    );
  };

  const showError = () => (
    <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
      {error}
    </div>
  );

  const showSuccess = () => (
    <div className="alert alert-success" style={{ display: success ? "" : "none" }}>
      {success}
    </div>
  );

  const createBlogForm = () => {
    return (
      <form onSubmit={publishBlog}>
        <div className="form-group">
          <label className="text-muted">Title</label>
          <input type="text" className="form-control" onChange={handleChange("title")} />
        </div>
        <div className="form-group">
          <ReactQuill
            modules={QuillModules}
            formats={QuillFormats}
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
  console.log("s: ", success, "e: ", error);
  return (
    <div className="container-fluid pb-5">
      <div className="row">
        <div className="col-md-8">
          {showError()}

          <div className="pt-3">
            {showSuccess()}
            {createBlogForm()}
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-group pb-2">
            <h5> Featured Image</h5>
            <small className="text-muted"> Max Size: 1MB</small>
            <label className="btn btn-outline-info">
              Upload Featured Image
              <input onChange={handleChange("photo")} type="file" accept="image/*" hidden />
            </label>
          </div>
          <h5>Categories</h5>
          <hr />
          <ul style={{ maxHeight: "200px", overflowY: "scroll" }}>{showCategories()}</ul>

          <h5>Tags</h5>
          <ul style={{ maxHeight: "200px", overflowY: "scroll" }}>{showTags()}</ul>

          <hr />
        </div>
      </div>
    </div>
  );
};

export default withRouter(CreateBlog);
