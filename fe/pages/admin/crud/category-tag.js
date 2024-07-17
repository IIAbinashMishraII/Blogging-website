import Layout from "../../../components/Layout";
import Link from "next/link";
import Admin from "../../../components/auth/Admin";
import * as React from "react";
import Category from "../../../components/crud/Category";
import Tag from "../../../components/crud/Tag";



const categoryTag = () => {
  return (
    <Layout>
      <Admin>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 pb-5 pt-5">
              <h2>Manage categories and tags</h2>
            </div>
            <div className="col-md-6">
              <Category></Category>
            </div>
            <div className="col-md-6">
              <Tag></Tag>
            </div>
          </div>
        </div>
      </Admin>

      {/* <Link href="/signup">Signup</Link> */}
    </Layout>
  );
};

export default categoryTag;
