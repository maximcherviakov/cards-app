import {
  Card,
  CardActionArea,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";
import { Class } from "../models/studyClass";
import { Link } from "react-router-dom";

interface Props {
  studyClass: Class;
}

export default function ClassCard({ studyClass }: Props) {
  const { id, title, username } = studyClass;

  return (
    <Card>
      <CardActionArea component={Link} to={`/class/${id}`}>
        <CardContent>
          <Typography gutterBottom variant="h5">
            {title}
          </Typography>
          <Divider />
          <Typography marginTop="2rem" variant="body1">
            By: {username}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
