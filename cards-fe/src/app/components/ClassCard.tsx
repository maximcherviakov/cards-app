import {
  Card,
  CardActionArea,
  CardContent,
  Divider,
  Typography,
} from "@mui/material";
import { Class } from "../models/studyClass";

interface Props {
  studyClass: Class;
}

export default function ClassCard({ studyClass }: Props) {
  const { title, username } = studyClass;

  return (
    <Card>
      <CardActionArea>
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
