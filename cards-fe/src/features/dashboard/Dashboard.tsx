import { Container, Typography } from "@mui/material";

export default function Dashboard() {
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
      <Typography fontWeight={700} variant="h1">
        This is the Dashboard
      </Typography>
    </Container>
  );
}