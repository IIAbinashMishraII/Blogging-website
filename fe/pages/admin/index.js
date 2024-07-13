import Layout from "../../components/Layout";
import Link from "next/link";
import Admin from "../../components/auth/Admin";

const AdminIndex = () => {
  return (
    <Layout>
      <Admin>
        <h2>Admin Dashboard</h2>
      </Admin>

      {/* <Link href="/signup">Signup</Link> */}
    </Layout>
  );
};

export default AdminIndex;
