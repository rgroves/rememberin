import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const server = {
  notes: {
    save: defineAction({
      accept: "form",
      input: z.object({
        liUrl: z.string().url(),
        liName: z.string().trim().min(1),
        notes: z.optional(z.string()),
      }),
      handler: async (input) => {
        console.log("in action");
        console.log(input);
        return "ok";
      },
    }),
  },
};
