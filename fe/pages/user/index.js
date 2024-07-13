import Layout from "../../components/Layout";
import Link from "next/link";
import Private from "../../components/auth/Private";

const UserIndex = () => {
  return (
    <Layout>
      <Private>
        <h2>User Dashboard</h2>
      </Private>

      {/* <Link href="/signup">Signup</Link> */}
    </Layout>
  );
};

export default UserIndex;
