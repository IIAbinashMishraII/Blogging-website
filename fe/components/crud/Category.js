import { useState, useEffect } from "react";
import Link from "next/link";
import Router from "next/router";
import { getCookie } from "../../actions/auth";
import { create, getCategories, removeCategory } from "../../actions/category";
import * as React from "react";

const Category = () => {
  const [values, setValues] = useState({
    name: "",
    error: "",
    success: false,
    categories: [],
    removed: false,
    reload: false,
  });

  const { name, error, success, categories, removed, reload } = values;
  const token = getCookie("token");

  useEffect(() => {
    loadCategories();
  }, [reload]);

  const loadCategories = async () => {
    try {
      let data = await getCategories();
      setValues({ ...values, categories: data });
    } catch (err) {
      console.log("Error loading categories:", err);
      setValues({ ...values, error: "Failed to load categories" });
    }
  };

  const showCategories = () => {
    return categories.map((c, i) => {
      return (
        <button
          onDoubleClick={() => deleteConfirm(c.slug)}
          title="Double click to delete"
          key={i}
          className="btn btn-outline-primary mr-1 ml-1 mt-3"
        >
          {c.name}
        </button>
      );
    });
  };

  const deleteConfirm = async (slug) => {
    let answer = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (answer) {
      await deleteCategory(slug);
    }
  };

  const deleteCategory = async (slug) => {
    // console.log('delete', slug);
    try {
      await removeCategory(slug, token);
      setValues({
        ...values,
        error: false,
        success: false,
        name: "",
        removed: true,
        reload: !reload,
      });
    } catch (err) {
      console.error("Error deleting category:", err);
      setValues({ ...values, error: "Failed to delete category" });
    }
  };

  const clickSubmit = async (e) => {
    e.preventDefault();
    // console.log('create category', name);
    try {
      let data = await create({ name }, token);
      if (data.error) {
        setValues({ ...values, error: data.error, success: false });
      } else {
        setValues({
          ...values,
          error: false,
          success: true,
          name: "",
          removed: false,
          reload: !reload,
        });
      }
    } catch (err) {
      console.error("Error creating category:", err);
      setValues({
        ...values,
        error: err.message || "Failed to create category",
        success: false,
      });
    }
  };

  const handleChange = (e) => {
    setValues({
      ...values,
      name: e.target.value,
      error: false,
      success: false,
      removed: "",
    });
  };
  //console.log(success, error, removed);
  const showSuccess = () =>
    success && <p className="text-success">Category is created</p>;

  const showError = () =>
    error && <p className="text-danger">Category already exists</p>;

  const showRemoved = () =>
    removed && <p className="text-danger">Category is removed</p>;

  const mouseMoveHandler = () => {
    setValues({ ...values, error: false, success: false, removed: "" });
  };

  const newCategoryForm = () => (
    <form onSubmit={clickSubmit}>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          type="text"
          className="form-control"
          onChange={handleChange}
          value={name}
          required
        />
      </div>
      <div>
        <button type="submit" className="btn btn-primary">
          Create
        </button>
      </div>
    </form>
  );

  return (
    <React.Fragment>
      {showSuccess()}
      {showError()}
      {showRemoved()}
      <div onMouseMove={mouseMoveHandler}>
        {newCategoryForm()}
        {showCategories()}
      </div>
    </React.Fragment>
  );
};

export default Category;
