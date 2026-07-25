import { ConfidenceChangeSchema, type ConfidenceChangeInput } from '@/lib/validation/schemas';

/** Validates the non-negotiable audit trail required for confidence changes. */
export function validateConfidenceChange(input: ConfidenceChangeInput) {
  return ConfidenceChangeSchema.parse(input);
}
