import { z } from "zod";

export const createCardSchema = z.object({
  body: z.object({
    front: z
      .string({ required_error: "Front side is required" })
      .min(1, "Front side cannot be empty.")
      .max(255),
    back: z
      .string({ required_error: "Back side is required" })
      .min(1, "Back side cannot be empty.")
      .max(255),
  }),
});

export const updateCardSchema = z.object({
  body: z.object({
    front: z.string().min(1, "Front side cannot be empty.").max(255).optional(),
    back: z.string().min(1, "Back side cannot be empty.").max(255).optional(),
  }),
});

export const reviewCardSchema = z.object({
  body: z.object({
    knewIt: z.boolean({
      required_error: "Review status (knewIt) is required.",
    }),
  }),
});

export const createBatchCardsSchema = z.object({
    body: z.object({
        cards: z.array(z.object({
            front: z.string().min(1, "Front side cannot be empty.").max(255),
            back: z.string().min(1, "Back side cannot be empty.").max(255),
        })).min(1, "At least one card is required.").max(5000, "Maximum of 5000 cards allowed."),
    })
})

export type ICreateBatchCards = z.infer<typeof createBatchCardsSchema>["body"]["cards"][number]
