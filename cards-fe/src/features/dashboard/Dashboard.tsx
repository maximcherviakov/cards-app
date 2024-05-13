import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import { Deck } from "../../app/models/deck";
import { Add } from "@mui/icons-material";
import { FieldValues, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router-dom";
import DeckCardEdit from "../../app/components/DeckCardEdit";
import { modalStyle } from "../../app/styles/modalStyle";
import { Class } from "../../app/models/studyClass";
import ClassCardEdit from "../../app/components/ClassCardEdit";

export default function Dashboard() {
  const navigate = useNavigate();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [decksLoaded, setDecksLoaded] = useState(false);
  const [classesLoaded, setClassesLoaded] = useState(false);
  const [deckModalOpen, setDeckModalOpen] = useState(false);
  const [classModalOpen, setClassModalOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm({ mode: "onTouched" });

  useEffect(() => {
    loadDecks();
    loadClasses();
  }, []);

  function loadDecks() {
    agent.Deck.listForCurrentUser()
      .then((response) => setDecks(response))
      .catch((error) => console.log(error))
      .finally(() => setDecksLoaded(true));
  }

  function loadClasses() {
    agent.Class.listForCurrentUser()
      .then((response) => setClasses(response))
      .catch((error) => console.log(error))
      .finally(() => setClassesLoaded(true));
  }

  async function submitCreateClassForm(data: FieldValues) {
    const newData = {
      title: data.title,
      description: data.description,
      isPrivate: data.isPrivate === "true",
    };
    await agent.Class.createClass(newData)
      .then(() => {
        setClassModalOpen(false);
        loadClasses();
      })
      .catch((error) => console.log(error));
  }

  async function submitCreateDeckForm(data: FieldValues) {
    const newData = {
      title: data.title,
      description: data.description,
      isPrivate: data.isPrivate === "true",
    };
    await agent.Deck.createDeck(newData)
      .then((response) => {
        setDeckModalOpen(false);
        navigate(`/edit/deck/${response.id}`);
      })
      .catch((error) => console.log(error));
  }

  return (
    <Box minHeight="100vh" paddingX={6} paddingY={2}>
      <Typography paddingTop={2} gutterBottom variant="h3" fontWeight={700}>
        Dashboard
      </Typography>
      <Box paddingTop="1.5rem">
        <Grid
          container
          flexDirection="row"
          justifyContent="left"
          alignItems="center"
          paddingBottom={1}
          spacing={1}
        >
          <Grid item>
            <Typography variant="h5">Study sets</Typography>
          </Grid>
          <Grid item>
            <IconButton onClick={() => setDeckModalOpen(true)}>
              <Add />
            </IconButton>
          </Grid>
        </Grid>
        <Divider sx={{ marginBottom: "1rem" }} />
        <Grid container spacing={4}>
          {decks.map((deck) => (
            <Grid item xs={3} key={deck.id}>
              <DeckCardEdit deck={deck} loadDecks={loadDecks} />
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box paddingTop="1.5rem">
        <Grid
          container
          flexDirection="row"
          justifyContent="left"
          alignItems="center"
          paddingBottom={1}
          spacing={1}
        >
          <Grid item>
            <Typography variant="h5">Classes</Typography>
          </Grid>
          <Grid item>
            <IconButton onClick={() => setClassModalOpen(true)}>
              <Add />
            </IconButton>
          </Grid>
        </Grid>
        <Divider sx={{ marginBottom: "1rem" }} />
        <Grid container spacing={4}>
          {classes.map((studyClass) => (
            <Grid item xs={3} key={studyClass.id}>
              <ClassCardEdit
                studyClass={studyClass}
                loadClasses={loadClasses}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      <Modal open={deckModalOpen} onClose={() => setDeckModalOpen(false)}>
        <Box sx={modalStyle}>
          <Typography paddingBottom={2} variant="h6" fontWeight={700}>
            Create a deck
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(submitCreateDeckForm)}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              sx={{ marginBottom: "1rem" }}
              fullWidth
              label="Title"
              {...register("title", { required: "Title is required" })}
            />
            <TextField
              sx={{ marginBottom: "1rem" }}
              fullWidth
              label="Description (optional)"
              multiline
              minRows={2}
              maxRows={5}
              {...register("description")}
            />
            <TextField
              fullWidth
              select
              label="Privacy"
              defaultValue="false"
              {...register("isPrivate", { required: "Privacy is required" })}
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
                onClick={() => setDeckModalOpen(false)}
              >
                Cancel
              </Button>
              <LoadingButton
                disabled={!isValid}
                loading={isSubmitting}
                type="submit"
                variant="contained"
              >
                Create
              </LoadingButton>
            </Grid>
          </Box>
        </Box>
      </Modal>
      <Modal open={classModalOpen} onClose={() => setClassModalOpen(false)}>
        <Box sx={modalStyle}>
          <Typography paddingBottom={2} variant="h6" fontWeight={700}>
            Create a class
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(submitCreateClassForm)}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              sx={{ marginBottom: "1rem" }}
              fullWidth
              label="Title"
              {...register("title", { required: "Title is required" })}
            />
            <TextField
              sx={{ marginBottom: "1rem" }}
              fullWidth
              label="Description (optional)"
              multiline
              minRows={2}
              maxRows={5}
              {...register("description")}
            />
            <TextField
              fullWidth
              select
              label="Privacy"
              defaultValue="false"
              {...register("isPrivate", { required: "Privacy is required" })}
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
                onClick={() => setClassModalOpen(false)}
              >
                Cancel
              </Button>
              <LoadingButton
                disabled={!isValid}
                loading={isSubmitting}
                type="submit"
                variant="contained"
              >
                Create
              </LoadingButton>
            </Grid>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
