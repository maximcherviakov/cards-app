import { Backdrop, Box, CircularProgress } from "@mui/material";

export default function LoadingComponent() {
  return (
    <Backdrop open={true} invisible={true}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress size={100} color="primary" />
      </Box>
    </Backdrop>
  );
}
