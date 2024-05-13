import { Box, CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { useCallback, useEffect, useState } from "react";
import { useAppDispatch } from "../store/configureStore";
import { fetchCurrentUser } from "../../features/account/accountSlice";
import LoadingComponent from "./LoadingComponent";

export default function App() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  const initApp = useCallback(async () => {
    try {
      await dispatch(fetchCurrentUser());
    } catch (error: any) {
      console.log(error);
    }
  }, [dispatch]);

  useEffect(() => {
    initApp().then(() => setLoading(false));
  }, [initApp]);

  const theme = createTheme({
    typography: {
      fontFamily: "poppins, sans-serif",
    },
  });

  if (loading) return <LoadingComponent />;

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
