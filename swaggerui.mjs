import { Router } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

export const swaggerRouter = Router();

const swaggerOptions = {
  definition: {
    swagger: "2.0",
    openapi: "5.0.1",
    info: {
      title: "api",
      version: "1.0",
      description: "api documents",
    },
    servers: ["http://localhost:4000"],
  },
  apis: ["swaggerui.mjs"],
};

const swaggerDoc = swaggerJSDoc(swaggerOptions);
swaggerRouter.use("/", swaggerUI.serve, swaggerUI.setup(swaggerDoc));

//Swagger API Documents Settings
/**
 * @swagger
 * /questions:
 *  post:
 *    tags: [Questions]
 *    summary: create new question
 *    description: Use to create question
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: body
 *        description: Create new question (requied body)
 *        schema:
 *          type: object
 *          required:
 *            - title
 *            - description
 *            - category
 *          properties:
 *            title:
 *              type: string
 *            description:
 *              type: string
 *            category:
 *              type: string
 *    responses:
 *      '200':
 *        description: Successfully retrieved the list of questions.
 *      '400':
 *        description: Bad Request Missing or invalid request data.
 *      '500':
 *        description: Internal server error.
 *
 *  get:
 *    tags: [Questions]
 *    summary: Get all question data
 *    description: Use to request all question data
 *    responses:
 *      '200':
 *        description: Successfully retrieved the list of questions.
 *      '404':
 *        description: Bad Request Invalid query parameters.
 *      '500':
 *        description: Internal server error
 *
 * /questions/{id}:
 *  get:
 *    tags: [Questions]
 *    summary: Get question data with ID
 *    description: Use to request single question data
 *    consumes:
 *      - application/json
 *    parameters:
 *      - name: id
 *        in: path
 *        required: ture
 *        description: use id for request question data
 *        schema:
 *          type: integer
 *          format: int64
 *          minimum: 1
 *    responses:
 *      '200':
 *        description: Successfully retrieved the questions.
 *      '404':
 *        description: Not Found Question not found.
 *      '500':
 *        description: Internal server error
 *
 *  put:
 *    tags: [Questions]
 *    summary: Edit question with ID
 *    description: Edit single question with id
 *    parameters:
 *      - name : id
 *        in : path
 *        required: true
 *        description: use id for search question
 *        schema:
 *          type: integer
 *          minimum: 1
 *      - in: body
 *        name: body
 *        description: Create new question (requied body)
 *        schema:
 *          type: object
 *          required:
 *            - title
 *            - description
 *            - category
 *          properties:
 *            title:
 *              type: string
 *            description:
 *              type: string
 *            category:
 *              type: string
 *    responses:
 *      '200':
 *        description: Successfully updated the question.
 *      '404':
 *        description: Not Found Question not found.
 *      '500':
 *        description: Internal server error
 *
 *  delete:
 *    tags: [Questions]
 *    summary: Delete question data with ID
 *    description: Use to delete single question data
 *    consumes:
 *      - application/json
 *    parameters:
 *      - name: id
 *        in: path
 *        required: ture
 *        description: use id for request delete question data
 *        schema:
 *          type: integer
 *          format: int64
 *          minimum: 1
 *    responses:
 *      '200':
 *        description: Successfully deleted the questions.
 *      '404':
 *        description: Not Found Question not found.
 *      '500':
 *        description: Internal server error
 *
 * /questions/{id}/answers:
 *  post:
 *    tags: [Answers]
 *    summary: create new answer in question ID
 *    description: Use to create answer in question ID
 *    consumes:
 *      - application/json
 *    parameters:
 *      - name: id
 *        in: path
 *        required: ture
 *        description: use id for request delete question data
 *        schema:
 *          type: integer
 *          format: int64
 *          minimum: 1
 *      - in: body
 *        name: body
 *        description: Create new answer (requied body)
 *        schema:
 *          type: object
 *          required:
 *            - content
 *          properties:
 *            content:
 *              type: string
 *    responses:
 *      '200':
 *        description: Successfully Answer created successfully.
 *      '400':
 *        description: Bad Request Missing or invalid request data.
 *      '500':
 *        description: Internal server error.
 *
 *  get:
 *    tags: [Answers]
 *    summary: Get answer data with question ID
 *    description: Use to request answer data with question ID
 *    consumes:
 *      - application/json
 *    parameters:
 *      - name: id
 *        in: path
 *        required: ture
 *        description: use id for request answers data in question
 *        schema:
 *          type: integer
 *          format: int64
 *          minimum: 1
 *    responses:
 *      '200':
 *        description: Successfully retrieved the answers.
 *      '404':
 *        description: Not Found Answer not found.
 *      '500':
 *        description: Internal server error
 *
 * /questions/{id}/upvote:
 *  post:
 *    tags: [Questions]
 *    summary: Upvote Question
 *    description: Use to Upvote Question with ID
 *    consumes:
 *      - application/json
 *    parameters:
 *      - name: id
 *        in: path
 *        required: ture
 *        description: Use to Upvote Question with ID
 *        schema:
 *          type: integer
 *          format: int64
 *          minimum: 1
 *      - in: body
 *        name: body
 *        description: vote is only value = 1 in body
 *        schema:
 *          type: object
 *          required:
 *            - vote
 *          properties:
 *            vote:
 *              type: integer
 *              minimum : 1
 *              maximum : 1
 *    responses:
 *      '200':
 *        description: Successfully upvoted the question.
 *      '400':
 *        description: Invalid body parameters.
 *      '404':
 *        description: Question not found.
 *      '500':
 *        description: Internal server error.
 *
 * /questions/{id}/downvote:
 *  post:
 *    tags: [Questions]
 *    summary: Downvote Question
 *    description: Use to Downvote Question with ID
 *    consumes:
 *      - application/json
 *    parameters:
 *      - name: id
 *        in: path
 *        required: ture
 *        description: use id for Downvote question
 *        schema:
 *          type: integer
 *          format: int64
 *          minimum: 1
 *      - in: body
 *        name: body
 *        description: vote is only value = -1 in body
 *        schema:
 *          type: object
 *          required:
 *            - vote
 *          properties:
 *            vote:
 *              type: integer
 *              minimum : 1
 *              maximum : 1
 *    responses:
 *      '200':
 *        description: Successfully downvoted the question.
 *      '400':
 *        description: Invalid body parameters.
 *      '404':
 *        description: Question not found.
 *      '500':
 *        description: Internal server error.
 *
 * /answers/{id}/upvote:
 *  post:
 *    tags: [Answers]
 *    summary: Upvote Answers
 *    description: Use to Upvote Answers with ID
 *    consumes:
 *      - application/json
 *    parameters:
 *      - name: id
 *        in: path
 *        required: ture
 *        description: Use to Upvote Answers with ID
 *        schema:
 *          type: integer
 *          format: int64
 *          minimum: 1
 *      - in: body
 *        name: body
 *        description: vote is only value = 1 in body
 *        schema:
 *          type: object
 *          required:
 *            - vote
 *          properties:
 *            vote:
 *              type: integer
 *              minimum : 1
 *              maximum : 1
 *    responses:
 *      '200':
 *        description: Successfully upvoted the Answers.
 *      '400':
 *        description: Invalid body parameters.
 *      '404':
 *        description: Answers not found.
 *      '500':
 *        description: Internal server error.
 *
 * /answers/{id}/downvote:
 *  post:
 *    tags: [Answers]
 *    summary: Downvote Answers
 *    description: Use to Downvote Answers with ID
 *    consumes:
 *      - application/json
 *    parameters:
 *      - name: id
 *        in: path
 *        required: ture
 *        description: use id for Downvote Answers
 *        schema:
 *          type: integer
 *          format: int64
 *          minimum: 1
 *      - in: body
 *        name: body
 *        description: vote is only value = -1 in body
 *        schema:
 *          type: object
 *          required:
 *            - vote
 *          properties:
 *            vote:
 *              type: integer
 *              minimum : 1
 *              maximum : 1
 *    responses:
 *      '200':
 *        description: Successfully Downvoted the Answers.
 *      '400':
 *        description: Invalid body parameters.
 *      '404':
 *        description: Question not found.
 *      '500':
 *        description: Internal server error.
 */
