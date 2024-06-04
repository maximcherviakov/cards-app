import { Box, Divider, Grid, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import { Deck } from "../../app/models/deck";
import { MetaData } from "../../app/models/pagination";
import AppPagination from "../../app/components/AppPagination";
import DeckCard from "../deck/DeckCard";

export default function DeckList() {
  const [queryParams, setQueryParams] = useSearchParams();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [metadata, setMetadata] = useState<MetaData | null>(null);
  const [decksLoaded, setDecksLoaded] = useState(false);

  useEffect(() => {
    const type = queryParams.get("type");

    if (type !== null && type === "decks") {
      const params = new URLSearchParams();
      const searchTerm = queryParams.get("q");
      const pageNumber = queryParams.get("page");
      const pageSize = queryParams.get("pageSize");

      if (pageNumber !== null)
        params.append("pageNumber", pageNumber.toString());
      if (pageSize !== null) params.append("pageSize", pageSize.toString());
      if (searchTerm !== null && searchTerm?.trim()?.length !== 0)
        params.append("searchTerm", searchTerm);

      agent.Deck.list(params).then((response) => {
        if (
          pageNumber !== null &&
          Number.parseInt(pageNumber) > response.metaData.totalPages
        ) {
          setQueryParams((params) => {
            params.set("page", response.metaData.totalPages);
            return params;
          });
        } else {
          setDecks(response.items);
          setMetadata(response.metaData);
        }
        setDecks(response.items);
        setMetadata(response.metaData);
      });
    }
  }, [queryParams, setQueryParams]);

  const onPageChange = (page: number) => {
    setQueryParams((params) => {
      params.set("page", page.toString());
      if (metadata !== null)
        params.set("pageSize", metadata.pageSize.toString());
      return params;
    });
  };

  return (
    <Box paddingTop="1.5rem">
      <Grid container flexDirection="row" justifyContent="left">
        <Grid item>
          <Typography gutterBottom variant="h5">
            Study sets
          </Typography>
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
      {metadata && (
        <AppPagination
          metaData={metadata}
          onPageChange={(page: number) => {
            onPageChange(page);
            setDecksLoaded(false);
          }}
        />
      )}
    </Box>
  );
}
