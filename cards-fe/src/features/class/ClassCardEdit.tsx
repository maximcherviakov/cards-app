import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { Class } from "../../app/models/studyClass";
import { Delete, Edit } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { modalStyle } from "../../app/styles/modalStyle";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import agent from "../../app/api/agent";
import { Link } from "react-router-dom";

interface Props {
  studyClass: Class;
  loadClasses: () => void;
}

export default function ClassCardEdit({ studyClass, loadClasses }: Props) {
  const { id, title, description, isPrivate, username } = studyClass;
  const [stateTitle, setStateTitle] = useState(title);
  const [stateDescription, setStateDescription] = useState(description);
  const [stateIsPrivate, setStateIsPrivate] = useState(isPrivate);
  const [deleting, setDeleting] = useState(false);
  const [modalUpdateOpen, setModalUpdateOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm({ mode: "onTouched" });

  async function submitUpdateForm(data: FieldValues) {
    const newData = {
      title: data.title,
      description: data.description,
      isPrivate: data.isPrivate === "true",
    };
    await agent.Class.updateClass(id, newData)
      .then((response) => {
        setStateTitle(response.title);
        setStateDescription(response.description);
        setStateIsPrivate(response.isPrivate);
        loadClasses();
      })
      .catch((error) => console.log(error))
      .finally(() => setModalUpdateOpen(false));
  }

  async function submitDeleteForm(event: any) {
    event.preventDefault();
    setDeleting(true);
    await agent.Class.deleteClass(id)
      .then(() => loadClasses())
      .catch((error) => console.log(error))
      .finally(() => {
        setDeleting(false);
        setModalDeleteOpen(false);
      });
  }

  return (
    <>
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
            <Grid container direction="row" justifyContent="right">
              <IconButton
                aria-label={"Edit class card" + id}
                onClick={(event: any) => {
                  event.stopPropagation();
                  event.preventDefault();
                  setModalUpdateOpen(true);
                }}
              >
                <Edit />
              </IconButton>
              <IconButton
                aria-label={"Delete class card" + id}
                onClick={(event: any) => {
                  event.stopPropagation();
                  event.preventDefault();
                  setModalDeleteOpen(true);
                }}
              >
                <Delete />
              </IconButton>
            </Grid>
          </CardContent>
        </CardActionArea>
      </Card>
      <Modal open={modalUpdateOpen} onClose={() => setModalUpdateOpen(false)}>
        <Box sx={modalStyle}>
          <Typography paddingBottom={2} variant="h6" fontWeight={700}>
            Edit class
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(submitUpdateForm)}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              sx={{ marginBottom: "1rem" }}
              fullWidth
              label="Title"
              defaultValue={stateTitle}
              {...register("title", { required: "Title is required" })}
            />
            <TextField
              sx={{ marginBottom: "1rem" }}
              fullWidth
              label="Description (optional)"
              multiline
              minRows={2}
              maxRows={5}
              defaultValue={stateDescription}
              {...register("description")}
            />
            <TextField
              fullWidth
              select
              label="Privacy"
              defaultValue={stateIsPrivate}
              {...register("isPrivate", { required: "Title is required" })}
            >
              <MenuItem selected value="false">
                Public
              </MenuItem>
              <MenuItem value="true">Private</MenuItem>
            </TextField>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              paddingTop="2rem"
            >
              <Button
                sx={{
                  height: "fit-content",
                  paddingX: "16px",
                  paddingY: "6px",
                }}
                onClick={() => setModalUpdateOpen(false)}
              >
                Cancel
              </Button>
              <LoadingButton
                disabled={!isValid}
                loading={isSubmitting}
                type="submit"
                variant="contained"
              >
                Update
              </LoadingButton>
            </Grid>
          </Box>
        </Box>
      </Modal>
      <Modal open={modalDeleteOpen} onClose={() => setModalDeleteOpen(false)}>
        <Box sx={modalStyle}>
          <Typography paddingBottom={2} variant="h6" fontWeight={700}>
            Delete class
          </Typography>
          <Box
            component="form"
            onSubmit={(event: any) => submitDeleteForm(event)}
            noValidate
            sx={{ mt: 1 }}
          >
            <Typography variant="body1">Are you sure?</Typography>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              paddingTop="2rem"
            >
              <Button
                sx={{
                  height: "fit-content",
                  paddingX: "16px",
                  paddingY: "6px",
                }}
                onClick={() => setModalDeleteOpen(false)}
              >
                Cancel
              </Button>
              <LoadingButton
                loading={deleting}
                type="submit"
                variant="contained"
                color="error"
              >
                Delete
              </LoadingButton>
            </Grid>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
