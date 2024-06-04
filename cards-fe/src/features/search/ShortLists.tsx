import { Box, Grid, Typography, Button, Divider } from "@mui/material";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import agent from "../../app/api/agent";
import { Deck } from "../../app/models/deck";
import { Class } from "../../app/models/studyClass";
import DeckCard from "../deck/DeckCard";
import ClassCard from "../class/ClassCard";

export default function ShortLists() {
  const [queryParams, setQueryParams] = useSearchParams();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [decksLoaded, setDecksLoaded] = useState(false);
  const [classesLoaded, setClassesLoaded] = useState(false);

  useEffect(() => {
    const type = queryParams.get("type");

    if (type !== null && type === "all") {
      const params = new URLSearchParams();

      const searchTerm = queryParams.get("q");

      if (searchTerm !== null && searchTerm?.trim()?.length !== 0)
        params.append("searchTerm", searchTerm);

      agent.Deck.list(params)
        .then((response) => setDecks(response.items))
        .catch((error) => console.log(error))
        .finally(() => setDecksLoaded(true));
      agent.Class.list(params)
        .then((response) => setClasses(response.items))
        .catch((error) => console.log(error))
        .finally(() => setClassesLoaded(true));
    }
  }, [queryParams]);

  return (
    <Box>
      <Box paddingTop="1.5rem">
        <Grid container flexDirection="row" justifyContent="space-between">
          <Grid item>
            <Typography gutterBottom variant="h5">
              Study sets
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="text"
              onClick={() =>
                setQueryParams((params) => {
                  params.set("type", "decks");
                  return params;
                })
              }
            >
              View all
            </Button>
          </Grid>
        </Grid>
        <Divider sx={{ marginBottom: "1rem" }} />
        <Grid container spacing={4}>
          {decks.map((deck) => (
            <Grid item xs={3} key={deck.id}>
              <DeckCard deck={deck} />
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box paddingTop="1.5rem">
        <Grid container flexDirection="row" justifyContent="space-between">
          <Grid item>
            <Typography gutterBottom variant="h5">
              Classes
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="text"
              onClick={() =>
                setQueryParams((params) => {
                  params.set("type", "classes");
                  return params;
                })
              }
            >
              View all
            </Button>
          </Grid>
        </Grid>
        <Divider sx={{ marginBottom: "1rem" }} />
        <Grid container spacing={4}>
          {classes.map((studyClass) => (
            <Grid item xs={3} key={studyClass.id}>
              <ClassCard studyClass={studyClass} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
