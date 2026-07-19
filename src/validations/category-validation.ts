import { CATEGORY_COLOR_NAMES, CATEGORY_ICON_NAMES } from "@/constants/icon";
import * as z from "zod";

export const categoryFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  type: z
    .union([z.literal(""), z.enum(["income", "expense"])])
    .refine((value) => value !== "", {
      message: "Type must be selected",
    }),
  color: z.enum(CATEGORY_COLOR_NAMES as [string, ...string[]], {
    error: "Color must be selected",
  }),
  icon: z.enum(CATEGORY_ICON_NAMES as [string, ...string[]], {
    error: "Icon must be selected",
  }),
});

export type CategoryFormInput = z.input<typeof categoryFormSchema>;
