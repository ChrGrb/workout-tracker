import type { JSONSchema } from "sveltekit-superforms";

export type EnumOption = { name: string; value: string };

type EnumSchema = JSONSchema & { labels?: Record<string, string> };

// "SOME_VALUE" -> "Some value"
const titleCase = (value: string) => {
  const words = value.replace(/[_-]+/g, " ").trim().toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
};

const asSchema = (definition: unknown): EnumSchema | undefined =>
  typeof definition === "object" && definition !== null
    ? (definition as EnumSchema)
    : undefined;

// Nullable/optional enums are emitted as anyOf/oneOf with an enum member.
const findEnumSchema = (schema: EnumSchema): EnumSchema | undefined => {
  if (schema.enum) return schema;

  return [...(schema.anyOf ?? []), ...(schema.oneOf ?? [])]
    .map(asSchema)
    .find((member) => member?.enum);
};

/**
 * Reads the options of an enum field from a superforms adapter's JSON schema.
 * Labels come from Zod `.meta({ labels })`, falling back to title case.
 */
export const getEnumOptions = (
  jsonSchema: JSONSchema,
  path: string,
): EnumOption[] => {
  let schema: EnumSchema | undefined = jsonSchema;
  for (const key of path.split(".")) {
    schema = asSchema(schema?.properties?.[key]);
  }

  const enumSchema = schema && findEnumSchema(schema);
  if (!enumSchema?.enum) {
    throw new Error(`Form field "${path}" is not an enum in the schema`);
  }

  // Labels may sit on the wrapper (e.g. nullable enum) or the enum itself.
  const labels = { ...schema?.labels, ...enumSchema.labels };

  return enumSchema.enum
    .filter((value): value is string => typeof value === "string")
    .map((value) => ({ value, name: labels[value] ?? titleCase(value) }));
};
