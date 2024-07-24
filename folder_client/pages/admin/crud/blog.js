import Layout from "../../../components/Layout";
import Link from "next/link";
import Admin from "../../../components/auth/Admin";
import * as React from "react";
import BlogCreate from "../../../components/crud/Blog"


const blogPage = () => {
  return (
    <Layout>
      <Admin>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 pb-5 pt-5">
              <h2>Manage categories and tags</h2>
            </div>
            <div className="col-md-12">
              <BlogCreate/>
            </div>
          </div>
        </div>
      </Admin>

      {/* <Link href="/signup">Signup</Link> */}
    </Layout>
  );
};

export default blogPage;
