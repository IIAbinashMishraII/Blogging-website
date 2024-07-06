import Link from "next/link";
import Layout from "../components/layout";
import SignupComponent from "../components/auth/signupComponent";

const Signup = () => {
  return (
    <Layout>
      <h2>Signup Page</h2>
      <SignupComponent />
    </Layout>
  );
};

export default Signup;
