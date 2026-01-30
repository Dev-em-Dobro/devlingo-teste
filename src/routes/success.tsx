import { createFileRoute } from "@tanstack/react-router";
import SuccessScreen from "../components/SuccessScreen";
import { z } from "zod";

const successSearchSchema = z.object({
  xp: z.number().optional(),
  accuracy: z.number().optional(),
});

export const Route = createFileRoute("/success")({
  component: SuccessScreen,
  validateSearch: (search) => successSearchSchema.parse(search),
});
