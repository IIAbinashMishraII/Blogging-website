import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { isAuth } from "../../actions/auth";

const Private = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await isAuth();
      if (!authStatus) {
        router.push("/signin");
      } else {
        setAuth(authStatus);
      }
    };
    checkAuth();
  }, [router]);

  if (auth === null) {
    return <div>Loading...</div>;
  }

  return <React.Fragment>{children}</React.Fragment>;
};

export default Private;
