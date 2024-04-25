import { Button, Container, Divider, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function NotFound() {
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
      <Typography fontSize={300} fontWeight="700" variant="h1">
        404
      </Typography>
      <Typography gutterBottom fontWeight="400" variant="h3">
        Oops... we could not find what you are looking
      </Typography>
      <Divider />
      <Button
        sx={{ fontSize: "1.3rem", padding: 2 }}
        fullWidth
        component={Link}
        to="/"
      >
        Go back
      </Button>
    </Container>
  );
}
