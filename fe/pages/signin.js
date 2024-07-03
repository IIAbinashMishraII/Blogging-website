import Link from "next/link";
import Layout from "../components/layout";

const Signin = () => {
  return (
    <Layout>
      <h2>Signin Page</h2>
      <Link href="/signup">Signup</Link>
    </Layout>
  );
};

export default Signin;
