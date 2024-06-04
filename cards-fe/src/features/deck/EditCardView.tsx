import {
  Box,
  Button,
  Card,
  CardMedia,
  Divider,
  Grid,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { Flashcard } from "../../app/models/card";
import { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import { Edit, Delete, CloudUpload, Image } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { FieldValues, useForm } from "react-hook-form";
import { modalStyle } from "../../app/styles/modalStyle";

interface Props {
  card: Flashcard;
  loadCards: () => void;
}

export default function EditCardView({ card, loadCards }: Props) {
  const { id, frontText, backText, imageUrl } = card;
  const [image, setImage] = useState<string | null>(null);
  const [cardImage, setCardImage] = useState<File | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [modalUpdateOpen, setModalUpdateOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm({ mode: "onTouched" });

  useEffect(() => {
    agent.Card.getImage(imageUrl)
      .then((data) => {
        console.log(data);
        const blob = new Blob([data], { type: "image/*" });
        const imageObjectUrl = URL.createObjectURL(blob);
        setImage(imageObjectUrl);
      })
      .catch((error) => console.log(error));
  }, [imageUrl]);

  async function submitUpdateForm(data: FieldValues) {
    const params = new URLSearchParams();

    if (data.frontText !== null) params.append("FrontText", data.frontText);
    if (data.backText !== null) params.append("BackText", data.backText);

    const formData = new FormData();
    formData.append("Image", cardImage!);

    await agent.Card.updateCard(id, formData, params)
      .then(() => loadCards())
      .catch((error) => console.log(error))
      .finally(() => setModalUpdateOpen(false));
  }

  function handleImageChange(event: any) {
    console.log(event.target.files[0]);
    console.log(URL.createObjectURL(event.target.files[0]));
    setCardImage(event.target.files[0]);
  }

  async function submitDeleteForm(event: any) {
    event.preventDefault();
    setDeleting(true);
    await agent.Card.deleteCard(id)
      .then(() => loadCards())
      .catch((error) => console.log(error))
      .finally(() => {
        setDeleting(false);
        setModalDeleteOpen(false);
      });
  }

  return (
    <>
      <Card
        sx={{
          backgroundColor: "lightgrey",
          borderRadius: "20px",
          padding: "1rem",
        }}
      >
        <Grid
          container
          direction="row"
          flexWrap="nowrap"
          alignItems="center"
          justifyContent="right"
          marginBottom={1}
        >
          <IconButton
            aria-label={"Edit card " + id}
            onClick={(event: any) => {
              event.stopPropagation();
              event.preventDefault();
              setModalUpdateOpen(true);
            }}
          >
            <Edit />
          </IconButton>
          <IconButton
            aria-label={"Delete card " + id}
            onClick={(event: any) => {
              event.stopPropagation();
              event.preventDefault();
              setModalDeleteOpen(true);
            }}
          >
            <Delete />
          </IconButton>
        </Grid>
        <Grid
          container
          direction="row"
          flexWrap="nowrap"
          height="8rem"
          alignItems="center"
        >
          <Grid item width="100%" padding="0.5rem" alignItems="center">
            <Typography fontSize="1.2rem" textAlign="center">
              {frontText}
            </Typography>
          </Grid>
          <Divider flexItem orientation="vertical" />
          <Grid item width="100%" padding="0.5rem">
            <Typography fontSize="1.3rem" textAlign="center">
              {backText}
            </Typography>
          </Grid>

          {image && (
            <>
              <Divider flexItem orientation="vertical" />
              <Grid item xs={4} width="100%" height="100%" marginLeft={1}>
                <CardMedia
                  width="100%"
                  height="100%"
                  component="img"
                  alt={frontText}
                  src={image}
                  sx={{ objectFit: "contain" }}
                />
              </Grid>
            </>
          )}
        </Grid>
      </Card>
      <Modal open={modalUpdateOpen} onClose={() => setModalUpdateOpen(false)}>
        <Box sx={modalStyle}>
          <Typography paddingBottom={2} variant="h6" fontWeight={700}>
            Edit card
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
              label="Term/Front"
              multiline
              minRows={3}
              maxRows={3}
              defaultValue={frontText}
              {...register("frontText", { required: "Front text is required" })}
            />
            <TextField
              sx={{ marginBottom: "1rem" }}
              fullWidth
              label="Definition/Back"
              multiline
              minRows={3}
              maxRows={3}
              defaultValue={backText}
              {...register("backText", { required: "Back text is required" })}
            />
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
            Delete card
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
