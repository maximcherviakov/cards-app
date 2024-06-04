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
import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { DeckWithCards } from "../../app/models/deck";
import agent from "../../app/api/agent";
import CardView from "./CardView";
import {
  ArrowBack,
  ArrowForward,
  Edit,
  FilterNone,
  Quiz,
  School,
  Style,
  VolumeUp,
} from "@mui/icons-material";
import { useAppSelector } from "../../app/store/configureStore";
import { FieldValues, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { modalStyle } from "../../app/styles/modalStyle";
import { textToSpeech } from "../../app/utils/TextToSpeechHelper";

export default function DeckDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAppSelector((state) => state.account);
  const navigate = useNavigate();
  const [deck, setDeck] = useState<DeckWithCards | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [deckLoaded, setDeckLoaded] = useState(false);
  const [cardPointer, setCardPointer] = useState(0);
  const [isFrontSide, setIsFrontSide] = useState(true);
  const [modalUpdateOpen, setModalUpdateOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm({ mode: "onTouched" });

  useEffect(() => {
    if (id)
      agent.Deck.deckById(parseInt(id))
        .then((response) => {
          if (
            response.cards.length === 0 &&
            response.username === user?.userName
          )
            navigate(`/edit/deck/${id}`);
          setDeck(response);
        })
        .catch((error) => console.log(error))
        .finally(() => setDeckLoaded(true));
  }, [id, navigate, user]);

  useEffect(() => {
    if (deck && deck.cards.length > 0 && deck?.cards[cardPointer].imageUrl) {
      agent.Card.getImage(deck?.cards[cardPointer].imageUrl)
        .then((data) => {
          const blob = new Blob([data], { type: "image/*" });
          const imageObjectUrl = URL.createObjectURL(blob);
          setImage(imageObjectUrl);
        })
        .catch((error) => console.log(error));
    }
  }, [cardPointer, deck]);

  const decrPointer = () => {
    setIsFrontSide(true);
    if (deck)
      if (cardPointer - 1 >= 0) {
        setCardPointer((prev) => --prev);
      } else {
        setCardPointer(deck?.cards.length - 1);
      }
  };

  const incrPointer = () => {
    setIsFrontSide(true);
    if (deck)
      if (deck && cardPointer + 1 < deck?.cards.length) {
        setCardPointer((prev) => ++prev);
      } else {
        setCardPointer(0);
      }
  };

  async function submitUpdateForm(data: FieldValues) {
    const newData = {
      title: data.title,
      description: data.description,
      isPrivate: data.isPrivate === "true",
    };
    await agent.Deck.updateDeck(parseInt(id!), newData)
      .then((response) => {
        setDeck({
          ...deck!,
          title: response.title,
          description: response.description,
          isPrivate: response.isPrivate,
        });
      })
      .catch((error) => console.log(error))
      .finally(() => setModalUpdateOpen(false));
  }

  return (
    <>
      <Grid
        container
        direction="column"
        paddingX={6}
        paddingY={2}
        spacing={2}
        marginBottom={6}
      >
        <Grid container item justifyContent="space-between">
          <Grid item>
            <Typography marginY={2} gutterBottom variant="h3" fontWeight={700}>
              {deck?.title}
            </Typography>
          </Grid>
          <Grid item></Grid>
        </Grid>
        {deck !== null && deck.cards.length > 0 && (
          <Grid container direction="row" flexWrap="nowrap" columnSpacing={2}>
            <Grid item xs={7} container direction="column" spacing={1}>
              <Grid item>
                <Card
                  sx={{
                    height: "50vh",
                    backgroundColor: "lightgrey",
                    borderRadius: "20px",
                  }}
                >
                  <CardActionArea
                    sx={{ height: "100%" }}
                    onClick={() => setIsFrontSide((prev) => !prev)}
                  >
                    <Box height="100%" padding="1.5rem">
                      <Grid
                        container
                        direction="row"
                        flexWrap="nowrap"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Grid item>
                          <Typography>
                            {isFrontSide ? "Term/Front" : "Definition/Back"}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <IconButton
                            aria-label="speech"
                            onClick={(event: any) => {
                              event.stopPropagation();
                              event.preventDefault();
                              textToSpeech(
                                isFrontSide
                                  ? deck?.cards[cardPointer].frontText
                                  : deck?.cards[cardPointer].backText
                              );
                            }}
                          >
                            <VolumeUp />
                          </IconButton>
                        </Grid>
                      </Grid>
                      <CardContent
                        sx={{
                          height: "100%",
                          textAlign: "center",
                          alignContent: "center",
                          padding: 0,
                        }}
                      >
                        {isFrontSide ? (
                          <Typography variant="h4">
                            {deck?.cards[cardPointer].frontText}
                          </Typography>
                        ) : image ? (
                          <Grid container alignItems="center" height="100%">
                            <Grid item xs={8}>
                              <Typography variant="h4">
                                {deck?.cards[cardPointer].backText}
                              </Typography>
                            </Grid>
                            <Grid item xs={4} height="100%">
                              <img
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  borderRadius: "20px",
                                  objectFit: "contain",
                                }}
                                src={image}
                              />
                            </Grid>
                          </Grid>
                        ) : (
                          <Typography variant="h4">
                            {deck?.cards[cardPointer].backText}
                          </Typography>
                        )}
                      </CardContent>
                    </Box>
                  </CardActionArea>
                </Card>
              </Grid>
              <Grid item container alignItems="center" justifyContent="center">
                <IconButton
                  aria-label="slide-back"
                  size="large"
                  onClick={decrPointer}
                >
                  <ArrowBack />
                </IconButton>
                <Typography>
                  {cardPointer + 1} / {deck?.cards.length}
                </Typography>
                <IconButton
                  aria-label="slide-forward"
                  size="large"
                  onClick={incrPointer}
                >
                  <ArrowForward />
                </IconButton>
              </Grid>
            </Grid>
            <Grid item xs={5}>
              <Box
                sx={{
                  height: "fit-content",
                  backgroundColor: "lightgrey",
                  borderRadius: "20px",
                  padding: "1.5rem",
                }}
              >
                <Grid
                  container
                  rowSpacing={2}
                  columnSpacing={4}
                  paddingBottom="1rem"
                >
                  <Grid item xs={6}>
                    <Button
                      sx={{
                        width: "100%",
                        paddingY: "0.7rem",
                        fontSize: "1.2rem",
                        textTransform: "none",
                        borderRadius: "15px",
                        justifyContent: "flex-start",
                      }}
                      variant="contained"
                      size="large"
                      startIcon={<Style />}
                      disabled
                    >
                      Flashcards
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      sx={{
                        width: "100%",
                        paddingY: "0.7rem",
                        fontSize: "1.2rem",
                        textTransform: "none",
                        borderRadius: "15px",
                        justifyContent: "flex-start",
                      }}
                      variant="contained"
                      size="large"
                      startIcon={<School />}
                      disabled
                    >
                      Learn
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      sx={{
                        width: "100%",
                        paddingY: "0.7rem",
                        fontSize: "1.2rem",
                        textTransform: "none",
                        borderRadius: "15px",
                        justifyContent: "flex-start",
                      }}
                      variant="contained"
                      size="large"
                      startIcon={<Quiz />}
                      disabled
                    >
                      Test
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      sx={{
                        width: "100%",
                        paddingY: "0.7rem",
                        fontSize: "1.2rem",
                        textTransform: "none",
                        borderRadius: "15px",
                        justifyContent: "flex-start",
                      }}
                      variant="contained"
                      size="large"
                      startIcon={<FilterNone />}
                      disabled
                    >
                      Match
                    </Button>
                  </Grid>
                </Grid>
                {user?.userName === deck?.username ? (
                  <>
                    <Divider />
                    <Grid
                      container
                      direction="row"
                      columnSpacing={4}
                      paddingY="1rem"
                    >
                      <Grid item xs={6}>
                        <Button
                          sx={{
                            width: "100%",
                            paddingY: "0.7rem",
                            fontSize: "1.2rem",
                            textTransform: "none",
                            borderRadius: "15px",
                            justifyContent: "flex-start",
                          }}
                          variant="contained"
                          size="large"
                          startIcon={<Edit />}
                          component={NavLink}
                          to={"/edit/deck/" + id}
                        >
                          Edit cards
                        </Button>
                      </Grid>
                      <Grid item xs={6}>
                        <Button
                          sx={{
                            width: "100%",
                            paddingY: "0.7rem",
                            fontSize: "1.2rem",
                            textTransform: "none",
                            borderRadius: "15px",
                            justifyContent: "flex-start",
                          }}
                          variant="contained"
                          size="large"
                          startIcon={<Edit />}
                          onClick={() => setModalUpdateOpen(true)}
                        >
                          Edit deck
                        </Button>
                      </Grid>
                    </Grid>
                  </>
                ) : (
                  <></>
                )}
              </Box>
            </Grid>
          </Grid>
        )}
        <Divider flexItem sx={{ paddingTop: "1.5rem" }} />
        <Grid item width="80%">
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
                  Created by <strong>{deck?.username}</strong>
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
                  {deck !== null && deck.description.trim().length > 0
                    ? deck.description
                    : "No description here"}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Typography
            paddingLeft={2}
            marginY={2}
            gutterBottom
            variant="h5"
            fontWeight={500}
          >
            {deck?.cards.length} cards in this deck
          </Typography>
        </Grid>
        <Grid container spacing={4}>
          {deck?.cards.map((card) => (
            <Grid item xs={12} key={card.id}>
              <CardView card={card} />
            </Grid>
          ))}
        </Grid>
      </Grid>
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
              defaultValue={deck?.title}
              {...register("title", { required: "Title is required" })}
            />
            <TextField
              sx={{ marginBottom: "1rem" }}
              fullWidth
              label="Description (optional)"
              multiline
              minRows={2}
              maxRows={5}
              defaultValue={deck?.description}
              {...register("description")}
            />
            <TextField
              fullWidth
              select
              label="Privacy"
              defaultValue={deck?.isPrivate}
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
    </>
  );
}
