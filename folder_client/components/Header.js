import * as React from "react";
import { APP_NAME } from "../config.js";
import { useRouter } from "next/router.js";
import Link from "next/link";
import { signout, isAuth } from "../actions/auth.js";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";

const drawerWidth = 240;
const navItems = ["Signup", "Signin", "Blogs"];
const navRoutes = ["/signup", "/signin", "/blogs"];

function Header(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isClientSide, setIsClientSide] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };
  const handleSignout = () => {
    signout(() => {
      setIsAuthenticated(false);
      router.push("/signin");
    });
  };

  const handleDashboard = async () => {
    const auth = await isAuth();
    if (auth) {
      const role = auth.role === 1 ? "admin" : "user";
      router.push(`/${role}`);
    } else {
      router.push("/signin");
    }
  };

  React.useEffect(() => {
    setIsAuthenticated(isAuth());
    setIsClientSide(true);
  }, []);

  React.useEffect(() => {
    const handleRouteChange = () => setLoading(true);
    const handleRouteComplete = () => setLoading(false);

    router.events.on("routeChangeStart", handleRouteChange);
    router.events.on("routeChangeComplete", handleRouteComplete);
    router.events.on("routeChangeError", handleRouteComplete);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
      router.events.off("routeChangeComplete", handleRouteComplete);
      router.events.off("routeChangeError", handleRouteComplete);
    };
  }, [router]);

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Divider />
      <List>
        {navItems.map((item, index) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: "center" }}>
              <Link href={navRoutes[index]} passHref>
                <ListItemText primary={item} />
              </Link>
            </ListItemButton>
          </ListItem>
        ))}
        {isAuthenticated && (
          <>
            <ListItem disablePadding>
              <ListItemButton sx={{ textAlign: "center" }} onClick={handleSignout}>
                <ListItemText primary="Signout" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton sx={{ textAlign: "center" }} onClick={handleDashboard}>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {loading && (
        <LinearProgress
          className="loadingBar"
          sx={{ width: "100%", position: "fixed", top: 0, zIndex: 1301 }}
        />
      )}
      <AppBar component="nav" sx={{ bgcolor: "#e7e7e7" }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              display: { xs: "block", sm: "block" },
            }}
          >
            <Typography
              variant="h6"
              component="span"
              sx={{
                color: "black",
                fontWeight: "bold",
                fontSize: "32px",
                fontFamily: "Copperplate",
                cursor: "pointer",
              }}
              onClick={() => router.push("/")}
            >
              {APP_NAME}
            </Typography>
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {isClientSide && (
              <>
                {!isAuthenticated &&
                  navItems.map((item, index) => (
                    <Link href={navRoutes[index]} key={item} passHref>
                      <Button sx={{ color: "black" }}>{item}</Button>
                    </Link>
                  ))}
                {isAuthenticated && (
                  <>
                    <Button sx={{ color: "black" }} onClick={handleSignout}>
                      Signout
                    </Button>
                    <Button sx={{ color: "black" }} onClick={handleDashboard}>
                      {isAuth().name}'s Dashboard
                    </Button>
                  </>
                )}
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      <Box component="main" sx={{ p: 4 }}></Box>
    </Box>
  );
}

Header.propTypes = {
  window: PropTypes.func,
};

export default Header;
