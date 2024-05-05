import { Button, Container, Divider, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function Unauthorized() {
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
        401
      </Typography>
      <Typography gutterBottom fontWeight="400" variant="h3">
        Oops... it seems that you can't access this data
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
