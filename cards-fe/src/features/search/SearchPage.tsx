import { Container, Typography } from "@mui/material";
import SearchBar from "../../app/components/SearchBar";

export default function SearchPage() {
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
      <Typography align="center" gutterBottom fontWeight="600" variant="h1">
        Search...
      </Typography>
      <Typography align="center" marginBottom={6} fontWeight="300" variant="h4">
        Find study sets and classes
      </Typography>
      <SearchBar fontSize={30} width="70%" />
    </Container>
  );
}
