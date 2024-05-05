import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DeckWithCards } from "../../app/models/deck";
import agent from "../../app/api/agent";
import CardView from "./CardView";
import {
  ArrowBack,
  ArrowForward,
  FilterNone,
  Quiz,
  School,
  Style,
} from "@mui/icons-material";

export default function DeckDetails() {
  const { id } = useParams<{ id: string }>();
  const [deck, setDeck] = useState<DeckWithCards | null>(null);
  const [deckLoaded, setDeckLoaded] = useState(false);
  const [cardPointer, setCardPointer] = useState(0);
  const [isFrontSide, setIsFrontSide] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (id)
      agent.Deck.deckById(parseInt(id))
        .then((response) => setDeck(response))
        .catch((error) => console.log(error))
        .finally(() => setDeckLoaded(true));
  }, [id, navigate]);

  const decrPointer = () => {
    if (deck)
      if (cardPointer - 1 >= 0) {
        setCardPointer((prev) => --prev);
      } else {
        setCardPointer(deck?.cards.length - 1);
      }
  };

  const incrPointer = () => {
    if (deck)
      if (deck && cardPointer + 1 < deck?.cards.length) {
        setCardPointer((prev) => ++prev);
      } else {
        setCardPointer(0);
      }
  };

  return (
    <Grid
      container
      direction="column"
      paddingX={6}
      paddingY={2}
      spacing={2}
      marginBottom={6}
    >
      <Grid item>
        <Typography marginY={2} gutterBottom variant="h3" fontWeight={700}>
          {deck?.title}
        </Typography>
      </Grid>
      {deck !== null && deck?.cards.length > 0 && (
        <Grid container direction="row" flexWrap="nowrap" columnSpacing={2}>
          <Grid item xs={7} container direction="column" spacing={1}>
            <Grid item>
              <Card
                sx={{
                  height: "50vh",
                  backgroundColor: "lightgrey",
                  borderRadius: "20px",
                }}
              >
                <CardActionArea
                  sx={{ height: "100%" }}
                  onClick={() => setIsFrontSide((prev) => !prev)}
                >
                  <Box height="100%" padding="1.5rem">
                    <CardHeader
                      sx={{ padding: 0 }}
                      subheader={isFrontSide ? "Term/Front" : "Definition/Back"}
                    />
                    <CardContent
                      sx={{
                        height: "100%",
                        textAlign: "center",
                        alignContent: "center",
                        padding: 0,
                      }}
                    >
                      <Typography variant="h4">
                        {isFrontSide
                          ? deck?.cards[cardPointer].frontText
                          : deck?.cards[cardPointer].backText}
                      </Typography>
                    </CardContent>
                  </Box>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item container alignItems="center" justifyContent="center">
              <IconButton size="large" onClick={decrPointer}>
                <ArrowBack />
              </IconButton>
              <Typography>
                {cardPointer + 1} / {deck?.cards.length}
              </Typography>
              <IconButton size="large" onClick={incrPointer}>
                <ArrowForward />
              </IconButton>
            </Grid>
          </Grid>
          <Grid item xs={5}>
            <Box
              sx={{
                height: "100%",
                backgroundColor: "lightgrey",
                borderRadius: "20px",
                padding: "1.5rem",
              }}
            >
              <Grid
                container
                rowSpacing={2}
                columnSpacing={4}
                paddingBottom="1rem"
              >
                <Grid item xs={6}>
                  <Button
                    sx={{
                      width: "100%",
                      paddingY: "0.7rem",
                      fontSize: "1.2rem",
                      textTransform: "none",
                      borderRadius: "15px",
                      justifyContent: "flex-start",
                    }}
                    variant="contained"
                    size="large"
                    startIcon={<Style />}
                  >
                    Flashcards
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    sx={{
                      width: "100%",
                      paddingY: "0.7rem",
                      fontSize: "1.2rem",
                      textTransform: "none",
                      borderRadius: "15px",
                      justifyContent: "flex-start",
                    }}
                    variant="contained"
                    size="large"
                    startIcon={<School />}
                  >
                    Learn
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    sx={{
                      width: "100%",
                      paddingY: "0.7rem",
                      fontSize: "1.2rem",
                      textTransform: "none",
                      borderRadius: "15px",
                      justifyContent: "flex-start",
                    }}
                    variant="contained"
                    size="large"
                    startIcon={<Quiz />}
                  >
                    Test
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    sx={{
                      width: "100%",
                      paddingY: "0.7rem",
                      fontSize: "1.2rem",
                      textTransform: "none",
                      borderRadius: "15px",
                      justifyContent: "flex-start",
                    }}
                    variant="contained"
                    size="large"
                    startIcon={<FilterNone />}
                  >
                    Match
                  </Button>
                </Grid>
              </Grid>
              <Divider />
            </Box>
          </Grid>
        </Grid>
      )}
      <Divider flexItem sx={{ paddingTop: "1.5rem" }} />
      <Grid item width="80%">
        <Grid container flexWrap="nowrap" columnSpacing={4}>
          <Grid item>
            <Box
              sx={{
                height: "100%",
                backgroundColor: "lightgrey",
                borderRadius: "20px",
                padding: "1.5rem",
              }}
            >
              <Typography fontSize="1.2rem">
                Created by <strong>{deck?.username}</strong>
              </Typography>
            </Box>
          </Grid>
          <Grid item flexGrow="1">
            <Box
              alignContent="center"
              sx={{
                height: "100%",
                backgroundColor: "lightgrey",
                borderRadius: "20px",
                padding: "1rem",
              }}
            >
              <Typography fontSize="1rem">
                {deck !== null && deck.description.trim().length > 0
                  ? deck.description
                  : "No description here"}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Typography
          paddingLeft={2}
          marginY={2}
          gutterBottom
          variant="h5"
          fontWeight={500}
        >
          {deck?.cards.length} cards in this deck
        </Typography>
      </Grid>
      <Grid container spacing={4}>
        {deck?.cards.map((card) => (
          <Grid item xs={12} key={card.id}>
            <CardView card={card} />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}
