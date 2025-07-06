import { z } from "zod";

export const getStudyCardsSchema = z.object({
  query: z.object({
    limit: z.preprocess(
      (val) => (val ? parseInt(String(val), 10) : 10), // default to 10
      z.number().min(1)
    ),
    randomOrder: z.preprocess(
      (val) => val === "true", // convert "true" string to boolean
      z.boolean().default(false)
    ),
  }),
  params: z.object({
    deckId: z.string().cuid(),
  }),
});

export const reviewCardSchema = z.object({
  body: z.object({
    knewIt: z.boolean({
      required_error: "knewIt field is required",
    }),
  }),
  params: z.object({
    cardId: z.string().cuid(),
  }),
});
