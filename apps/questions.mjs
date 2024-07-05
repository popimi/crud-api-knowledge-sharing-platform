import { Router } from "express";
import connectionPool from "../utils/db.mjs";

export const questionRouter = Router();

//Creates a new question. QC1 Passed!
questionRouter.post("/", async (req, res) => {
  //middlewares
  let invalidBodyCheck = false;
  [("title", "description", "category")].forEach((field) => {
    if (!req.body[field]) {
      invalidBodyCheck = true;
    }
  });
  if (invalidBodyCheck) {
    return res
      .status(400)
      .json({ message: "Bad Request: Missing or invalid request data" });
  }

  const createQuestion = {
    ...req.body,
    created_at: new Date(),
    updated_at: new Date(),
  };

  let result;
  try {
    result = await connectionPool.query(
      `insert into questions (title,description,category,created_at,updated_at)
        values ( $1, $2, $3, $4, $5)
        returning *`,
      [
        createQuestion.title,
        createQuestion.description,
        createQuestion.category,
        createQuestion.created_at,
        createQuestion.updated_at,
      ]
    );
  } catch (error) {
    return res.status(500).json({
      message: "Server could not create questions because database connection",
    });
  }

  return res.status(201).json({
    message: "Created: Question created successfully.",
    body: result.rows[0],
  });
});

//Retrieves a list of all questions. QC1 Passed!
questionRouter.get("/", async (req, res) => {
  //query params
  const title = req.query.title;
  const category = req.query.category;

  //(Optional) req middlewares
  let foundInvalidQuery = false;
  Object.keys(req.query).forEach((query) => {
    if (query !== "title" && query !== "category") {
      foundInvalidQuery = true;
    }
  });
  if (foundInvalidQuery) {
    return res
      .status(404)
      .json({ message: "Bad Request: Invalid query parameters." });
  }

  //get all with query params
  let result;
  try {
    result = await connectionPool.query(
      `select * from questions
        where (upper(title) like upper('%'||$1||'%')  or $1 is null or $1 = '')
        and 
        (upper(category) like upper('%'||$2||'%') or $2 is null or $2 = '')`,
      [title, category]
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server could not get question because database connection",
    });
  }
  return res.status(200).json({
    message: "OK: Successfully retrieved the list of questions.",
    data: result.rows,
  });
});

//Retrieves a specific question by its ID. QC1 Passed!
questionRouter.get("/:id", async (req, res) => {
  const params = +req.params.id;
  let result;
  try {
    result = await connectionPool.query(
      `select * from questions where id = $1`,
      [params]
    );
  } catch (error) {
    return res.status(500).json({
      message:
        "Server could not found questions id because database connection",
    });
  }
  //if not found id
  if (result.rowCount === 0) {
    return res.status(404).json({ message: "Not Found: Question not found" });
  }

  return res.status(200).json({
    message: "OK: Successfully retrieved the question",
    body: result.rows[0],
  });
});

//Updates the title or description of a specific question. QC1 Passed!
questionRouter.put("/:id", async (req, res) => {
  const params = +req.params.id;
  const updateQuestion = { ...req.body, updated_at: new Date() };
  let result;

  //middlewares
  if (
    !updateQuestion.title ||
    !updateQuestion.description ||
    !updateQuestion.category
  ) {
    return res
      .status(400)
      .json({ message: "Bad Request: Missing or invalid request data" });
  }

  try {
    result = await connectionPool.query(
      `update questions
        set title = $2,
            description = $3,
            category = $4,
            updated_at = $5
        where id = $1
        returning *`,
      [
        params,
        updateQuestion.title,
        updateQuestion.description,
        updateQuestion.category,
        updateQuestion.updated_at,
      ]
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message:
        "Server could not found questions id because database connection",
    });
  }
  if (result.rowCount === 0) {
    return res.status(404).json({ message: "Not Found: Question not found" });
  }

  return res.status(200).json({
    message: "OK: Successfully updated the question.",
    body: result.rows[0],
  });
});

//Deletes a specific question. QC1 Passed!
questionRouter.delete("/:id", async (req, res) => {
  const params = req.params.id;
  let result;
  try {
    result = await connectionPool.query(`delete from questions where id = $1`, [
      params,
    ]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server could not connect because database connection",
    });
  }
  if (result.rowCount === 0) {
    return res.status(404).json({ message: "Not Found: Question not found" });
  }
  return res.status(200).json({
    message: "OK: Successfully deleted the question",
  });
});

//Creates an answer for a specific question. QC1 Passed!
questionRouter.post("/:id/answers", async (req, res) => {
  const params = req.params.id;

  //middlewares
  let invalidBodyCheck = false;
  Object.keys(req.body).forEach((body) => {
    if (body !== "content") {
      invalidBodyCheck = true;
    }
  });
  if (req.body.content.length > 300) {
    return res
      .status(400)
      .json({ message: "Bad Request: Answer is Longer than 300!" });
  }
  if (invalidBodyCheck) {
    return res
      .status(400)
      .json({ message: "Bad Request: Missing or invalid request data" });
  }

  const createAnswer = {
    ...req.body,
    created_at: new Date(),
    updated_at: new Date(),
  };
  let result;
  try {
    result = await connectionPool.query(
      `insert into answers ( question_id, content, created_at, updated_at)
        values ($1, $2, $3, $4)
        returning *`,
      [
        params,
        createAnswer.content,
        createAnswer.created_at,
        createAnswer.updated_at,
      ]
    );
  } catch (error) {
    if (error.code == 23503) {
      return res.status(404).json({ message: "Not Found Question not found." });
    }
    return res.status(500).json({
      message: "Server could not connect because database connection",
    });
  }
  return res.status(200).json({
    message: "Created: Answer created successfully.",
    data: result.rows[0],
  });
});

//(Optional) Retrieves answers for a specific question. QC1 Passed!
questionRouter.get("/:id/answers", async (req, res) => {
  const params = req.params.id;
  let result;
  try {
    result = await connectionPool.query(
      `select * from answers
        where question_id = $1`,
      [params]
    );
    console.log(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server could not connect because database connection",
    });
  }
  if (result.rowCount === 0) {
    return res.status(404).json({ message: "Not Found: Answers not found." });
  }
  return res.status(200).json({
    message: "OK: Successfully retrieved the answers.",
    data: result.rows,
  });
});

//(Optional) Upvotes a specific question. QC1 Passed!
questionRouter.post("/:id/upvote", async (req, res) => {
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
        (insert into question_votes (question_id ,vote)
        values ($1, $2))
        select questions.*
        ,count(case when vote = 1 then question_votes end)as upvote
        ,count(case when vote = -1 then question_votes end) as downvote
        from questions inner join question_votes
        on questions.id = question_votes.question_id
        where questions.id = $1
        group by questions.id`,
      [params, upvote]
    );
  } catch (error) {
    return res.status(500).json({
      message: "Server could not connect because database connection",
    });
  }
  if (result.rowCount === 0) {
    return res.status(404).json({ message: "Not Found: Question not found." });
  }
  return res.status(200).json({
    message: "OK: Successfully upvoted the question.",
    data: result.rows[0],
  });
});

//(Optional) Downvotes a specific question. QC1 Passed!
questionRouter.post("/:id/downvote", async (req, res) => {
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
        (insert into question_votes (question_id ,vote)
        values ($1, $2))
        select questions.*
        ,count(case when vote = 1 then question_votes end)as upvotes
        ,count(case when vote = -1 then question_votes end) as downvotes
        from questions inner join question_votes
        on questions.id = question_votes.question_id
        where questions.id = $1
        group by questions.id`,
      [params, downvote]
    );
  } catch (error) {
    return res.status(500).json({
      message: "Server could not connect because database connection",
    });
  }
  if (result.rowCount === 0) {
    return res.status(404).json({ message: "Not Found: Question not found." });
  }
  return res.status(200).json({
    message: "OK: Successfully downvoted the question.",
    data: result.rows[0],
  });
});
