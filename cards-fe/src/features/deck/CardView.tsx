import { Card, CardMedia, Divider, Grid, Typography } from "@mui/material";
import { Flashcard } from "../../app/models/card";

interface Props {
  card: Flashcard;
}

export default function CardView({ card }: Props) {
  const { frontText, backText, imageUrl } = card;

  return (
    <Card
      sx={{
        backgroundColor: "lightgrey",
        borderRadius: "20px",
        padding: "1rem",
      }}
    >
      <Grid
        container
        direction="row"
        flexWrap="nowrap"
        height="8rem"
        alignItems="center"
      >
        <Grid item width="100%" padding="0.5rem" alignItems="center">
          <Typography fontSize="1.2rem" textAlign="center">
            {frontText}
          </Typography>
        </Grid>
        <Divider flexItem orientation="vertical" />
        <Grid item width="100%" padding="0.5rem">
          <Typography fontSize="1.3rem" textAlign="center">
            {backText}
          </Typography>
        </Grid>
        {imageUrl && <CardMedia component="img" alt={frontText} />}
      </Grid>
    </Card>
  );
}
