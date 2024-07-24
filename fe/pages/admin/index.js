import Layout from "../../components/Layout";
import Link from "next/link";
import Admin from "../../components/auth/Admin";
import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import InboxIcon from "@mui/icons-material/Inbox";
import DraftsIcon from "@mui/icons-material/Drafts";

const AdminIndex = () => {
  return (
    <Layout>
      <Admin>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 pb-5 pt-5">
              <h2>Admin Dashboard</h2>
            </div>
            <div className="col-md-4">
              <List>
                <ListItem disablePadding>
                  <Link href="/admin/crud/category-tag">
                    <ListItemButton>
                      <a>Create category</a>
                    </ListItemButton>
                  </Link>
                </ListItem>
                <ListItem disablePadding>
                  <Link href="/admin/crud/category-tag">
                    <ListItemButton>
                      <a>Create Tag</a>
                    </ListItemButton>
                  </Link>
                </ListItem>
                <ListItem disablePadding>
                  <Link href="/admin/crud/blog">
                    <ListItemButton>
                      <a>Create Blog</a>
                    </ListItemButton>
                  </Link>
                </ListItem>
              </List>
            </div>
            <div className="col-md-8">right</div>
          </div>
        </div>
      </Admin>

      {/* <Link href="/signup">Signup</Link> */}
    </Layout>
  );
};

export default AdminIndex;
