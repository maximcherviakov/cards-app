import { Avatar, Box, Grid, Paper, Typography } from "@mui/material";
import { useAppSelector } from "../../app/store/configureStore";

export default function Profile() {
  const { user } = useAppSelector((state) => state.account);

  return (
    <Box minHeight="100vh" paddingX={6} paddingY={2}>
      <Typography paddingTop={2} gutterBottom variant="h3" fontWeight={700}>
        Profile
      </Typography>
      <Paper
        sx={{ padding: "1.5rem", marginBottom: "1rem", borderRadius: "20px" }}
      >
        <Grid container direction="row" alignItems="center" spacing={2}>
          <Grid item>
            <Avatar
              src="/static/images/avatar/2.jpg"
              sx={{ width: "5rem", height: "5rem" }}
            />
          </Grid>
          <Grid item>
            <Typography variant="h4">{user?.userName}</Typography>
          </Grid>
        </Grid>
      </Paper>
      <Paper sx={{ padding: "1.5rem", borderRadius: "20px" }}>
        <Typography variant="h5">Email: {user?.email}</Typography>
      </Paper>
    </Box>
  );
}
