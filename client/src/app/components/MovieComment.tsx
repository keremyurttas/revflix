import theme from "@/theme/theme";
import { Box, Avatar, Typography, Rating, Button } from "@mui/material";
import { Comment, MovieCommentProps } from "@/interfaces";
import { useGlobalContext } from "../Context/store";
import { CircleAvatar } from "./CircleAvatar";

export const MovieComment: React.FC<MovieCommentProps> = ({
  comment,
  deleteCommentLocal,
}) => {
  const { user } = useGlobalContext();
  const formattedDate = (date: Date) => {
    return new Date(date)
      .toLocaleDateString("en-US", {
        month: "short", // Short month name (e.g., "May")
        day: "2-digit", // Two-digit day of the month (e.g., "29")
        year: "numeric", // Full year (e.g., "2024")
      })
      .toUpperCase();
  };
  const handleDelete = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/movies/${comment.movie_id}/comments/${comment._id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );
    if (response.ok) {
      deleteCommentLocal(comment._id);
    } else {
      console.error("Failed to delete comment:", response.statusText);
    }
  };

  return (
    <Box id={comment._id} marginBottom={2}>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        marginBottom={".5rem"}
      >
        <Box display={"flex"} gap={"1rem"}>
          <CircleAvatar id={comment.owner_id} owner={comment.owner_user} ></CircleAvatar>
          {/* <Avatar
            src={`http://localhost:8000/api/avatars/${comment.owner_id}`}
          >
            {comment.owner_user[0].toUpperCase()}
          </Avatar> */}
          <Typography
            color={comment.owner_id === user.id ? "secondary" : "primary"}
            variant="body2"
            fontSize={"1.5rem"}
          >
            @{comment.owner_user}
          </Typography>
        </Box>
        <Box>
          {comment.owner_id === user.id && (
            <Button color="secondary" onClick={handleDelete}>
              Delete
            </Button>
          )}
          <Typography color={'primary'} variant="body2">{formattedDate(comment.date)}</Typography>
        </Box>
      </Box>
      <Box>
        <Rating
          sx={{
            "& .MuiRating-iconFilled, & .MuiRating-iconEmpty": {
              color: theme.palette.secondary.main,
            },
            "&.Mui-disabled": { opacity: 1 },
          }}
          value={comment.rate}
          precision={0.5}
          disabled
        />
        <Typography
          sx={{
            wordBreak: "break-word",
            overflowWrap: "break-word",
            whiteSpace: "normal",
          }}
          color={'primary'}
        >
          {comment.text}
        </Typography>
      </Box>
    </Box>
  );
};
