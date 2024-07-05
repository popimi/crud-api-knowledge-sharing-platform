import { Router } from "express";
import connectionPool from "../utils/db.mjs";

export const answersVotesRouter = Router();

//(Optional) Upvotes a specific answer. QC1 Passed!
answersVotesRouter.post("/:id/upvote", async (req, res) => {
  const params = req.params.id;
  const upvote = req.body.vote;

  //middlewares
  if (upvote !== 1) {
    return res
      .status(400)
      .json({ message: "Bad Request: Invalid body parameters." });
  }

  let result;
  try {
    result = await connectionPool.query(
      `with update as
        (insert into answer_votes (answer_id ,vote)
        values ($1,$2))
        select answers.* 
        , count(case when vote = 1 then answer_votes end) as upvotes 
        , count(case when vote = -1 then answer_votes end) as downvotes 
        from answers
        inner join answer_votes on answer_votes.answer_id = answers.id
        where answers.id = $1
        group by answers.id`,
      [params, upvote]
    );
  } catch (error) {
    if (error) {
      return res.status(404).json({ message: "Not Found: Answer not found." });
    }
    return res.status(500).json({
      message: "Server could not connect because database connection",
    });
  }
  return res.status(200).json({
    message: "OK: Successfully upvoted the answer.",
    data: result.rows[0],
  });
});

//(Optional) Downvotes a specific answer. QC1 Passed!
answersVotesRouter.post("/:id/downvote", async (req, res) => {
  const params = req.params.id;
  const downvote = req.body.vote;

  //middlewares
  if (downvote !== -1) {
    return res
      .status(400)
      .json({ message: "Bad Request: Invalid body parameters." });
  }

  let result;
  try {
    result = await connectionPool.query(
      `with update as
        (insert into answer_votes (answer_id ,vote)
        values ($1,$2))
        select answers.* 
        , count(case when vote = 1 then answer_votes end) as upvotes 
        , count(case when vote = -1 then answer_votes end) as downvotes 
        from answers
        inner join answer_votes on answer_votes.answer_id = answers.id
        where answers.id = $1
        group by answers.id`,
      [params, downvote]
    );
  } catch (error) {
    if (error) {
      return res.status(404).json({ message: "Not Found: Answer not found." });
    }
    return res.status(500).json({
      message: "Server could not connect because database connection",
    });
  }
  return res.status(200).json({
    message: "OK: Successfully downvoted the answer.",
    data: result.rows[0],
  });
});
