import { Card, CardMedia, Divider, Grid, Typography } from "@mui/material";
import { Flashcard } from "../../app/models/card";
import { useEffect, useState } from "react";
import agent from "../../app/api/agent";

interface Props {
  card: Flashcard;
}

export default function CardView({ card }: Props) {
  const { frontText, backText, imageUrl } = card;
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    if (imageUrl) {
      agent.Card.getImage(imageUrl)
        .then((data) => {
          const blob = new Blob([data], { type: "image/*" });
          const imageObjectUrl = URL.createObjectURL(blob);
          setImage(imageObjectUrl);
        })
        .catch((error) => console.log(error));
    }
  }, [imageUrl]);

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

        {image && (
          <>
            <Divider flexItem orientation="vertical" />
            <Grid item xs={4} width="100%" height="100%" marginLeft={1}>
              <CardMedia
                width="100%"
                height="100%"
                component="img"
                alt={frontText}
                src={image}
                sx={{ objectFit: "contain" }}
              />
            </Grid>
          </>
        )}
      </Grid>
    </Card>
  );
}
