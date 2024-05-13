import {
  Box,
  Button,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import agent from "../../app/api/agent";
import { DeckWithCards } from "../../app/models/deck";
import { CloudUpload, Image } from "@mui/icons-material";
import { FieldValues, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import EditCardView from "./EditCardView";

export default function EditCardsPage() {
  const { id } = useParams<{ id: string }>();
  const [deck, setDeck] = useState<DeckWithCards | null>(null);
  const [deckLoaded, setDeckLoaded] = useState(false);
  const [cardImage, setCardImage] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm({ mode: "onTouched" });

  useEffect(() => loadDeck(id!), [id]);

  function loadDeck(id: string) {
    if (id)
      agent.Deck.deckById(parseInt(id))
        .then((response) => setDeck(response))
        .catch((error) => console.log(error))
        .finally(() => setDeckLoaded(true));
  }

  async function submitCreateForm(data: FieldValues) {
    const params = new URLSearchParams();

    if (data.frontText !== null) params.append("FrontText", data.frontText);
    if (data.backText !== null) params.append("BackText", data.backText);

    const formData = new FormData();
    formData.append("Image", cardImage!);

    await agent.Card.createCard(parseInt(id!), formData, params).catch(
      (error) => console.log(error)
    );

    loadDeck(id!);
  }

  function handleImageChange(event: any) {
    console.log(event.target.files[0]);
    console.log(URL.createObjectURL(event.target.files[0]));
    setCardImage(event.target.files[0]);
  }

  return (
    <Grid
      container
      direction="column"
      paddingX={6}
      paddingY={2}
      spacing={2}
      margin={0}
    >
      <Typography gutterBottom variant="h3" fontWeight={700}>
        {deck?.title}
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(submitCreateForm)}
        sx={{
          backgroundColor: "lightgrey",
          borderRadius: "20px",
          padding: "1.5rem",
        }}
      >
        <Grid container direction="row" wrap="nowrap" spacing={2}>
          <Grid item xs={6}>
            <Typography gutterBottom fontSize="1.2rem">
              Term/Front
            </Typography>
            <TextField
              sx={{ marginBottom: "1rem" }}
              fullWidth
              multiline
              minRows={3}
              maxRows={3}
              {...register("frontText", {
                required: "Front text value is required",
              })}
            />
          </Grid>

          <Grid item xs={6}>
            <Typography gutterBottom fontSize="1.2rem">
              Definition/Back
            </Typography>
            <TextField
              sx={{ marginBottom: "1rem" }}
              fullWidth
              multiline
              minRows={3}
              maxRows={3}
              {...register("backText", {
                required: "Back text value is required",
              })}
            />
          </Grid>
        </Grid>
        {/*  */}
        <Box>
          <Box
            borderRadius="20px"
            border="1px solid"
            borderColor="primary"
            marginBottom={1}
            width="10rem"
            height="10rem"
          >
            {cardImage === null ? (
              <Box
                height="100%"
                width="100%"
                alignContent="center"
                textAlign="center"
              >
                <Image fontSize="large" />
                <Typography>Upload image</Typography>
              </Box>
            ) : (
              <img
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "20px",
                  objectFit: "contain",
                }}
                src={URL.createObjectURL(cardImage)}
              />
            )}
          </Box>
          <Button
            component="label"
            role={undefined}
            variant="outlined"
            tabIndex={-1}
            startIcon={<CloudUpload />}
            sx={{
              textTransform: "none",
              fontSize: "1rem",
              borderRadius: "10px",
            }}
          >
            Upload image
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </Button>
        </Box>
        {/*  */}
        <Grid container justifyContent="right">
          <LoadingButton
            disabled={!isValid}
            loading={isSubmitting}
            type="submit"
            variant="contained"
            sx={{
              textTransform: "none",
              fontSize: "1rem",
              borderRadius: "10px",
            }}
          >
            Add card
          </LoadingButton>
        </Grid>
      </Box>
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
            <EditCardView card={card} loadCards={() => loadDeck(id!)} />
          </Grid>
        ))}
      </Grid>
      <Divider flexItem sx={{ paddingTop: "1.5rem" }} />
    </Grid>
  );
}
