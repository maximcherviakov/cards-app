import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Button, Grid, List, ListItem, ListItemText } from "@mui/material";
import { NavLink } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { Style } from "@mui/icons-material";
import SignedInMenu from "./SignedInMenu";
import { navStyles } from "./navStyles";
import { useAppSelector } from "../store/configureStore";

const midLinks = [
  { title: "My Classes", path: "/my-classes" },
  { title: "Make Flashcards", path: "/make-flashcards" },
];

export default function Header() {
  const { user } = useAppSelector((state) => state.account);

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
          <Style sx={{ display: "flex", mr: 1 }} />
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
        {user ? (
          <SignedInMenu />
        ) : (
          <Box>
            <Grid
              container
              alignItems="center"
              justifyContent="center"
              columnSpacing={2}
            >
              <Grid item>
                <Button
                  sx={{
                    textTransform: "none",
                    color: "white",
                    fontSize: "1.2rem",
                    paddingX: "1rem",
                    paddingY: "0.6rem",
                  }}
                  variant="text"
                  component={NavLink}
                  to="/login"
                >
                  Login
                </Button>
              </Grid>
              <Grid item>
                <Button
                  sx={{
                    textTransform: "none",
                    color: "white",
                    // backgroundColor: "#632bf0",
                    fontSize: "1.2rem",
                    paddingX: "1rem",
                    paddingY: "0.6rem",
                    borderRadius: "25px",
                    borderColor: "white",
                    borderWidth: "2px",
                  }}
                  variant="outlined"
                  component={NavLink}
                  to="/register"
                >
                  Register
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
