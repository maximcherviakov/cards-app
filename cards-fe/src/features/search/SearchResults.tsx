import { Box, Grid, Tab, Typography } from "@mui/material";
import { SyntheticEvent, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import DeckList from "./DeckList";
import ShortLists from "./ShortLists";
import ClassList from "./ClassList";

export default function SearchResults() {
  const [queryParams, setQueryParams] = useSearchParams();
  const [tabValue, setTabValue] = useState<string | null>(null);

  const handleChange = (_: SyntheticEvent, newValue: string) => {
    setQueryParams((params) => {
      queryParams.set("type", newValue);
      queryParams.delete("page");
      queryParams.delete("pageSize");
      return params;
    });
  };

  useEffect(() => {
    const type = queryParams.get("type");

    if (type === null || type.trim().length === 0) {
      setQueryParams((params) => {
        params.set("type", "all");
        return params;
      });
    } else {
      setTabValue(type);
    }
  }, [queryParams, setQueryParams]);

  if (tabValue === null) return <></>;

  return (
    <Grid container direction="column" paddingX={6} paddingY={2}>
      {queryParams.get("q")?.trim().length !== 0 && (
        <Typography marginY={2} gutterBottom variant="h5">
          Results for "{queryParams.get("q")}"
        </Typography>
      )}
      <Box>
        <TabContext value={tabValue}>
          <Box>
            <TabList onChange={handleChange}>
              <Tab label="All results" value="all" />
              <Tab label="Study sets" value="decks" />
              <Tab label="Classes" value="classes" />
            </TabList>
          </Box>
          <TabPanel value="all" sx={{ padding: 0 }}>
            <ShortLists />
          </TabPanel>
          <TabPanel value="decks" sx={{ padding: 0 }}>
            <DeckList />
          </TabPanel>
          <TabPanel value="classes" sx={{ padding: 0 }}>
            <ClassList />
          </TabPanel>
        </TabContext>
      </Box>
    </Grid>
  );
}
