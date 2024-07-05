import express from "express";
import { questionRouter } from "./apps/questions.mjs";
import { answersVotesRouter } from "./apps/answersVotes.mjs";
import { swaggerRouter } from "./swaggerui.mjs";

const app = express();
const port = 4000;

app.use(express.json());

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

//Router Question , Question votes and Create Answers
app.use("/questions", questionRouter);

//Router Answers Votes
app.use("/answers", answersVotesRouter);

//Router Swagger
app.use("/api-docs", swaggerRouter);

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
