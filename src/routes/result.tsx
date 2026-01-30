import { createFileRoute } from "@tanstack/react-router";
import ResultScreen from "../components/ResultScreen";
import { z } from "zod";

const resultSearchSchema = z.object({
  correctAnswers: z.number(),
  incorrectAnswers: z.number(),
  lessonId: z.string(),
});

export const Route = createFileRoute("/result")({
  component: ResultScreen,
  validateSearch: (search) => resultSearchSchema.parse(search),
});
