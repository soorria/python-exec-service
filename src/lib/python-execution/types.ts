import { object, string, InferOutput, boolean, optional } from 'valibot'

export const runPythonCodeInputSchema = object({
  code: string(),

  auto_install_packages: optional(boolean(), false),
})

export type RunPythonCodeInput = InferOutput<typeof runPythonCodeInputSchema>
