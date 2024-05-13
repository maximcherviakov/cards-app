import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { GitHub, Style } from "@mui/icons-material";
import { Grid } from "@mui/material";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" mt={1}>
      {"Copyright © "}
      Omnicards&nbsp;
      {new Date().getFullYear()}
    </Typography>
  );
}

export default function Footer() {
  return (
    <Box
      sx={{
        paddingX: "8%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "#e1e3e5",
        gap: { xs: 4, sm: 8 },
        py: { xs: 8, sm: 10 },
        textAlign: { sm: "center", md: "left" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            minWidth: { xs: "100%", sm: "60%" },
          }}
        >
          <Box sx={{ width: { xs: "100%", sm: "60%" } }}>
            <Box sx={{ ml: "-15px" }}>
              <Grid
                container
                direction="row"
                alignContent="center"
                spacing={1}
                marginBottom="1rem"
              >
                <Grid item>
                  <Style />
                </Grid>
                <Grid item>
                  <Typography>Omnicards</Typography>
                </Grid>
              </Grid>
            </Box>
            <Typography color="text.secondary" mb={2}>
              Made with love in Sumy State University
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          pt: { xs: 4, sm: 4 },
          width: "100%",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box>
          <Copyright />
        </Box>
        <Stack
          direction="row"
          justifyContent="left"
          spacing={1}
          useFlexGap
          sx={{
            color: "text.secondary",
          }}
        >
          <IconButton
            color="inherit"
            href="https://github.com/maximcherviakov"
            aria-label="GitHub"
            sx={{ alignSelf: "center" }}
          >
            <GitHub />
          </IconButton>
          <IconButton
            color="inherit"
            href="https://www.linkedin.com/in/maksym-cherviakov-26331b244/"
            aria-label="LinkedIn"
            sx={{ alignSelf: "center" }}
          >
            <LinkedInIcon />
          </IconButton>
        </Stack>
      </Box>
    </Box>
  );
}
