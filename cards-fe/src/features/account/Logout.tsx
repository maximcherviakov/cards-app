import { Button, Container, Divider, Typography } from "@mui/material";
import { useAppDispatch } from "../../app/store/configureStore";
import { signOut } from "./accountSlice";
import { Link } from "react-router-dom";

export default function Logout() {
  const dispatch = useAppDispatch();
  dispatch(signOut());

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography gutterBottom fontWeight={600} variant="h2">
        We hope you will come again!
      </Typography>
      <Typography gutterBottom variant="h5">
        You are now signed out of OmniCards
      </Typography>
      <Divider />
      <Button
        sx={{ fontSize: "1.3rem", padding: 2 }}
        fullWidth
        component={Link}
        to="/"
      >
        Go home
      </Button>
    </Container>
  );
}
