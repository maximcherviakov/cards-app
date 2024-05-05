import {
  Box,
  Tooltip,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { AccountCircle, Dashboard, Logout } from "@mui/icons-material";

const settingLinks = [
  { title: "Profile", path: "/profile", icon: <AccountCircle /> },
  { title: "Dashboard", path: "/dashboard", icon: <Dashboard /> },
  { title: "Log Out", path: "/logout", icon: <Logout /> },
];

export default function SignedInMenu() {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Box>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar src="/static/images/avatar/2.jpg" />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: "45px", borderRadius: "20px" }}
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {settingLinks.map(({ title, path, icon }) => (
          <MenuItem
            sx={{ borderRadius: "20px" }}
            key={path}
            onClick={handleCloseUserMenu}
          >
            <Button
              component={NavLink}
              to={path}
              variant="text"
              startIcon={icon}
            >
              {title}
            </Button>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
