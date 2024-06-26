"use client";
import { Box, Button, CardContent, Typography } from "@mui/material";
import CardMedia from "@mui/material/CardMedia";
import theme from "@/theme/theme";
import { ThemeProvider } from "@emotion/react";
import MovieIcon from "@mui/icons-material/Movie";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useGlobalContext } from "../Context/store";
import { useEffect, useState } from "react";
import Link from "next/link";
import { handleNoImage } from "../utils/imageUtils";

interface MovieCardProps {
  className?: string;
  id: number;
  backdrop_path: string;
  title: string;
  genres: string[];
  isLiked: boolean;
  likeStatusChanged?: (arg0: number) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({
  className,
  id,
  backdrop_path,
  title,
  genres,
  isLiked,
  likeStatusChanged,
}) => {
  const { user } = useGlobalContext();
  const [localIsLiked, setLocalIsLiked] = useState<boolean>(isLiked);
  const [isLikeRequesting, setIsLikeRequesting] = useState<boolean>(false);
  useEffect(() => {
    setLocalIsLiked(isLiked);
  }, [isLiked]);

  const handleLikeToggle = async (newState: boolean) => {
    // Prevent multiple clicks while the request is in progress
    if (isLikeRequesting) return;

    // Set the state to indicate that a request is in progress
    setIsLikeRequesting(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/${user.id}/liked/${id}`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );
      if (response.ok) {
        if (newState == false && likeStatusChanged) {
          likeStatusChanged(id);
        }
        setLocalIsLiked(newState);
      }
    } catch (error) {
      console.error("An error occurred while handling the like toggle:", error);
    } finally {
      // Reset the state after the request is finished
      setIsLikeRequesting(false);
    }
  };
  return (
    <ThemeProvider theme={theme}>
      <Link href={`/movie/${id}`} passHref>
        <Box
          className={className}
          sx={{
            cursor: "pointer",
            marginRight: "1rem",
            position: "relative",
            height: "100%",
            bgcolor: "transparent",
            color: theme.palette.primary.main,
            display: "flex",
            flexDirection: "column",
            [theme.breakpoints.down("lg")]: {
              height: "230px",
            },
            transition:
              "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
            "&:hover": {
              transform: "scale(1.02)",
              boxShadow: theme.shadows[5],
            },
          }}
        >
          <CardMedia
            component="img"
            alt={title}
            sx={{
              width: "100%", // Ensure the image takes up the full width of its container
              height: "300px", // Adjust the height automatically to maintain aspect ratio
              borderRadius: "8px",
              [theme.breakpoints.down("lg")]: {
                height: "150px",
              },
              flexShrink: 0, // Prevent the image from shrinking
            }}
            image={handleNoImage(
              backdrop_path,
              `https://image.tmdb.org/t/p/w500/${backdrop_path}`
            )}
          />
          <CardContent sx={{ paddingX: 0, flexGrow: 1 }}>
            <Typography fontSize={".9rem"} fontWeight={600} variant="h5">
              {title}
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  color: theme.palette.text.primary,
                  display: "flex",
                  alignItems: "center",
                  gap: ".2rem",
                }}
              >
                <MovieIcon sx={{ width: 16, height: 16 }} />
                <Typography variant="body1">{genres[0]}</Typography>
              </Box>
              <Button
                sx={{
                  padding: 0,
                  minWidth: 0,
                }}
                onClick={(e) => {
                  e.preventDefault(); // Prevent the default link action
                  e.stopPropagation(); // Stop the event from propagating
                  handleLikeToggle(!localIsLiked); // Toggle the like state
                }}
                disabled={isLikeRequesting}
              >
                {localIsLiked ? (
                  <FavoriteIcon color="secondary" fontSize="small" />
                ) : (
                  <FavoriteBorderIcon color="secondary" fontSize="small" />
                )}
              </Button>
            </Box>
          </CardContent>
        </Box>
      </Link>
    </ThemeProvider>
  );
};

export default MovieCard;
