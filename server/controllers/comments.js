import Comment from "../models/commentSchema.js";
export const createComment = (req, res) => {
  const comment = new Comment(req.body);

  comment
    .save()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(400).json({ error: err.message });
    });
};

export const getCommentsByMovieId = async (req, res) => {
  const { movie_id } = req.params;
  try {
    // Fetch comments for the given movie ID
    const comments = await Comment.find({ movie_id });

    // Respond with the comments
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);

    // Respond with an error message and status code 500 (Internal Server Error)
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.comment_id);
    if (comment) {
      res.status(200).json({ message: "Comment deleted succesfully" });
    } else {
      return res.status(404).json({ message: "Comment not found" });
    }
  } catch (error) {
    console.error("Error deleting comment ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getRecentComments = async (req, res) => {
  try {
    const recentComments = await Comment.find()
      .sort({ date: -1 })
      .limit(10)
      .exec();
    res.status(200).json(recentComments);
  } catch (error) {
    res.status(500).json({ message: "An error occured", error });
  }
};

export const getCommentsByUserId = async (req, res) => {
  const { user_id } = req.params;
  try {
    const userComments = await Comment.find({ owner_id: user_id }).sort({
      date: -1,
    });
    res.status(200).json([...userComments]);
  } catch (error) {
    res.status(500).json({ message: "An error occured", error });
  }
};
