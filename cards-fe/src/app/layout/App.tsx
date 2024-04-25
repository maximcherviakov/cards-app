import { Box, CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function App() {
  const theme = createTheme({
    typography: {
      fontFamily: "poppins, sans-serif",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Box minHeight="100vh">
        <Outlet />
      </Box>
      <Footer />
    </ThemeProvider>
  );
}
