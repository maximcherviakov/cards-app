import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Deck } from "../../app/models/deck";

interface Props {
  deck: Deck;
}

export default function DeckCard({ deck }: Props) {
  const { id, title, username, cardsCount } = deck;

  return (
    <Card>
      <CardActionArea component={Link} to={`/deck/${id}`}>
        <CardContent>
          <Typography gutterBottom variant="h5">
            {title}
          </Typography>
          <Divider />
          <Box
            sx={{
              width: "fit-content",
              backgroundColor: "grey",
              borderRadius: "100px",
              paddingY: "0.3rem",
              paddingX: "0.5rem",
              marginY: "1rem",
            }}
          >
            {cardsCount} terms
          </Box>
          <Typography variant="body1">By: {username}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
