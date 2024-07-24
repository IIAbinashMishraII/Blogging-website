import * as React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import LoyaltySharpIcon from '@mui/icons-material/LoyaltySharp';
import TelegramIcon from '@mui/icons-material/Telegram';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';

export default function Footer() {
  const [value, setValue] = React.useState("recents");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <BottomNavigation
      sx={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        height: 50,
        textAlign: "end",
      }}
      value={value}
      onChange={handleChange}
    >
      <BottomNavigationAction
        label="Telegram"
        value="telegram"
        icon={<TelegramIcon />}
      />
      <BottomNavigationAction
        label="Email"
        value="email"
        icon={<EmailIcon />}
      />
      <BottomNavigationAction
        label="Github"
        value="github"
        icon={<GitHubIcon />}
      />
      <BottomNavigationAction
        label="Donate"
        value="donate"
        icon={<LoyaltySharpIcon />}
      />
    </BottomNavigation>
  );
}
