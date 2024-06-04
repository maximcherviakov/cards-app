import { Box, Divider, Grid, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import { MetaData } from "../../app/models/pagination";
import AppPagination from "../../app/components/AppPagination";
import { Class } from "../../app/models/studyClass";
import ClassCard from "../class/ClassCard";

export default function ClassList() {
  const [queryParams, setQueryParams] = useSearchParams();
  const [classes, setClasses] = useState<Class[]>([]);
  const [metadata, setMetadata] = useState<MetaData | null>(null);
  const [classesLoaded, setClassesLoaded] = useState(false);

  useEffect(() => {
    const type = queryParams.get("type");

    if (type !== null && type === "classes") {
      const params = new URLSearchParams();
      const searchTerm = queryParams.get("q");
      const pageNumber = queryParams.get("page");
      const pageSize = queryParams.get("pageSize");

      if (pageNumber !== null)
        params.append("pageNumber", pageNumber.toString());
      if (pageSize !== null) params.append("pageSize", pageSize.toString());
      if (searchTerm !== null && searchTerm?.trim()?.length !== 0)
        params.append("searchTerm", searchTerm);

      agent.Class.list(params)
        .then((response) => {
          if (
            pageNumber !== null &&
            Number.parseInt(pageNumber) > response.metaData.totalPages
          ) {
            setQueryParams((params) => {
              params.set("page", response.metaData.totalPages);
              return params;
            });
          } else {
            setClasses(response.items);
            setMetadata(response.metaData);
          }
        })
        .catch((error) => console.log(error))
        .finally(() => setClassesLoaded(true));
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
            Classes
          </Typography>
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
      {metadata && (
        <AppPagination
          metaData={metadata}
          onPageChange={(page: number) => {
            onPageChange(page);
            setClassesLoaded(false);
          }}
        />
      )}
    </Box>
  );
}
