import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { List, ListItem, ListItemText } from "@mui/material";
import { NavLink } from "react-router-dom";
import SearchBar from "../components/SearchBar";

const midLinks = [
  { title: "My Classes", path: "/my-classes" },
  { title: "Make Flashcards", path: "/make-flashcards" },
];

const settingLinks = [
  { title: "Profile", path: "/profile" },
  { title: "Dashboard", path: "/dashboard" },
  { title: "Log Out", path: "/logout" },
];

const navStyles = {
  paddingY: 1.5,
  color: "inherit",
  fontSize: "1rem",
  textDecoration: "none",
  whiteSpace: "nowrap",
  "&:hover": { color: "grey.500" },
  "&.active": { color: "text.secondary" },
};

export default function Header() {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Toolbar
        sx={{
          padding: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        disableGutters
      >
        {/* Left */}
        <Box
          component={NavLink}
          to="/"
          sx={{
            display: "flex",
            alignItems: "center",
            color: "inherit",
            textDecoration: "none",
          }}
        >
          <AdbIcon sx={{ display: "flex", mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: "flex",
              fontWeight: 500,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            OmniCards
          </Typography>
        </Box>

        {/* Center */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <List sx={{ display: "flex" }}>
            {midLinks.map(({ title, path }) => (
              <ListItem component={NavLink} to={path} key={path} sx={navStyles}>
                <ListItemText>{title}</ListItemText>
              </ListItem>
            ))}
          </List>
          <SearchBar />
        </Box>

        {/* Right */}
        <Box>
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar src="/static/images/avatar/2.jpg" />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
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
            {settingLinks.map(({ title, path }) => (
              <MenuItem key={path} onClick={handleCloseUserMenu}>
                <Typography
                  component={NavLink}
                  to={path}
                  key={path}
                  sx={navStyles}
                  textAlign="center"
                >
                  {title}
                </Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
