import * as z from "zod";

export const CreateCardSchema = z.object({
    fronts: z.string().min(1, "Please enter at least one term for the front side."),
    backs: z.string().min(1, "Please enter at least one term for the back side."),
});