import {
  Box,
  FormControlLabel,
  Grid,
  IconButton,
  Modal,
  Switch,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { ClassWithDecks } from "../../app/models/studyClass";
import { useParams } from "react-router-dom";
import agent from "../../app/api/agent";
import { useAppSelector } from "../../app/store/configureStore";
import DeckCard from "../../app/components/DeckCard";
import { Edit } from "@mui/icons-material";
import { modalStyle } from "../../app/styles/modalStyle";
import { Deck } from "../../app/models/deck";

export default function ClassDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAppSelector((state) => state.account);
  const [decks, setDecks] = useState<Deck[] | null>(null);
  const [studyClass, setStudyClass] = useState<ClassWithDecks | null>(null);
  const [classLoaded, setClassLoaded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (id) loadClass(parseInt(id));
    loadDecks();
  }, [id, user]);

  function loadClass(id: number) {
    agent.Class.classById(id)
      .then((response) => {
        setStudyClass(response);
      })
      .catch((error) => console.log(error))
      .finally(() => setClassLoaded(true));
  }

  function loadDecks() {
    agent.Deck.listForCurrentUser()
      .then((response) => setDecks(response))
      .catch((error) => console.log(error));
  }

  async function submitAddDeckForm(event: any, id: number) {
    const checked = event.target.checked;
    const data = {
      deckId: id,
      classId: studyClass?.id,
    };

    console.log(data);

    if (checked) {
      await agent.Deck.assignToClass(data).catch((error) => console.log(error));
    } else {
      await agent.Deck.removeFromClass(data).catch((error) =>
        console.log(error)
      );
    }

    loadClass(studyClass!.id);
    loadDecks();
  }

  return (
    <>
      <Box minHeight="100vh" paddingX={6} paddingY={2}>
        <Grid container justifyContent="left" alignItems="center" marginY={2}>
          <Grid item>
            <Typography variant="h3" fontWeight={700}>
              {studyClass?.title}
            </Typography>
          </Grid>
          <Grid item marginLeft={2}>
            <IconButton onClick={() => setModalOpen(true)}>
              <Edit fontSize="large" />
            </IconButton>
          </Grid>
        </Grid>
        <Box width="80%">
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
                  Created by <strong>{studyClass?.username}</strong>
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
                  {studyClass !== null &&
                  studyClass.description.trim().length > 0
                    ? studyClass.description
                    : "No description here"}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box>
          <Typography
            paddingLeft={2}
            marginY={2}
            gutterBottom
            variant="h5"
            fontWeight={500}
          >
            {studyClass?.decks.length} decks in this class
          </Typography>
        </Box>
        <Grid container spacing={4}>
          {studyClass?.decks.map((deck) => (
            <Grid item xs={3} key={deck.id}>
              <DeckCard deck={deck} />
            </Grid>
          ))}
        </Grid>
      </Box>
      {modalOpen && (
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <Box sx={{ ...modalStyle, width: "20%" }}>
            <Typography paddingBottom={2} variant="h6" fontWeight={700}>
              Add decks
            </Typography>
            {decks && (
              <Grid container direction="column" alignItems="start" marginY={2}>
                {decks.map((deck) => (
                  <Grid item>
                    <FormControlLabel
                      key={deck.id}
                      control={
                        <Switch
                          defaultChecked={deck.classId === studyClass?.id}
                          name={deck.title}
                          onChange={(event) =>
                            submitAddDeckForm(event, deck.id)
                          }
                        />
                      }
                      label={
                        <Typography fontSize="1.2rem">{deck.title}</Typography>
                      }
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Modal>
      )}
    </>
  );
}
