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
import { Deck } from "../models/deck";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Delete, Edit } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { FieldValues, useForm } from "react-hook-form";
import agent from "../api/agent";
import { modalStyle } from "../styles/modalStyle";

interface Props {
  deck: Deck;
  loadDecks: () => void;
}

export default function DeckCardEdit({ deck, loadDecks }: Props) {
  const { id, title, description, isPrivate, username, cardsCount } = deck;
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
    await agent.Deck.updateDeck(id, newData)
      .then((response) => {
        setStateTitle(response.title);
        setStateDescription(response.description);
        setStateIsPrivate(response.isPrivate);
      })
      .catch((error) => console.log(error))
      .finally(() => setModalUpdateOpen(false));
  }

  async function submitDeleteForm(event: any) {
    event.preventDefault();
    setDeleting(true);
    await agent.Deck.deleteDeck(id)
      .then(() => loadDecks())
      .catch((error) => console.log(error))
      .finally(() => {
        setDeleting(false);
        setModalDeleteOpen(false);
      });
  }

  return (
    <>
      <Card>
        <CardActionArea component={Link} to={`/deck/${id}`}>
          <CardContent>
            <Typography gutterBottom variant="h5">
              {stateTitle}
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
            <Grid container direction="row" justifyContent="right">
              <IconButton
                onClick={(event: any) => {
                  event.stopPropagation();
                  event.preventDefault();
                  setModalUpdateOpen(true);
                }}
              >
                <Edit />
              </IconButton>
              <IconButton
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
            Edit deck
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
            Delete deck
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
