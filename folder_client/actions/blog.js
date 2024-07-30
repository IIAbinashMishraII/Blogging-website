import fetch from "isomorphic-fetch";
import { API } from "../config";

export const createBlog = async (blog, token) => {
  try {
    const response = await fetch(`${API}/blog`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: blog,
    });
    return await response.json();
  } catch (err) {
    return console.log(err);
  }
};

export const listBlog = async (blog, token) => {
  try {
    const response = await fetch(`${API}/blog`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: blog,
    });
    return await response.json();
  } catch (err) {
    return console.log(err);
  }
};

export const listEverythingBlog = async (skip, limit) => {
  try {
    const data = { limit, skip };
    const response = await fetch(`${API}/blog/ct`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (err) {
    return console.log(err);
  }
};

export const readBlog = async (blog, token) => {
  try {
    const response = await fetch(`${API}/blog/:slug`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: blog,
    });
    return await response.json();
  } catch (err) {
    return console.log(err);
  }
};

export const removeBlog = async (blog, token) => {
  try {
    const response = await fetch(`${API}/blog/:slug`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: blog,
    });
    return await response.json();
  } catch (err) {
    return console.log(err);
  }
};
export const updateBlog = async (blog, token) => {
  try {
    const response = await fetch(`${API}/blog/:slug`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: blog,
    });
    return await response.json();
  } catch (err) {
    return console.log(err);
  }
};
export const photoBlog = async (blog, token) => {
  try {
    const response = await fetch(`${API}/blog/:slug`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: blog,
    });
    return await response.json();
  } catch (err) {
    return console.log(err);
  }
};
