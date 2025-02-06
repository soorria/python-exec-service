import { object, string, InferOutput } from 'valibot'

export const runPythonCodeInputSchema = object({
  code: string(),
})

export type RunPythonCodeInput = InferOutput<typeof runPythonCodeInputSchema>
