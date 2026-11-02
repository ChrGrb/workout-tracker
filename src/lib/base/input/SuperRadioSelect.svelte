<script lang="ts" generics="T extends Record<string, unknown>">
  import {
    formFieldProxy,
    type FormPathLeaves,
    type SuperForm,
  } from "sveltekit-superforms";
  import RadioSelect from "./RadioSelect.svelte";
  import { getEnumOptions } from "$lib/utils/forms/getEnumOptions";

  type Props = {
    superform: SuperForm<T>;
    field: FormPathLeaves<T, string>;
    label?: string;
    required?: boolean;
  };

  let { superform, field, label = "", required = false }: Props = $props();

  const { value } = formFieldProxy<T, FormPathLeaves<T, string>, string>(
    superform,
    field,
  );

  // Options come from the enum in the schema, so the adapter must carry its
  // JSON schema (zod4(), not zod4Client()).
  const validators = superform.options.validators;
  if (
    !validators ||
    typeof validators !== "object" ||
    !("jsonSchema" in validators)
  ) {
    throw new Error(
      "SuperRadioSelect needs the full zod4() adapter as `validators`",
    );
  }
  const items = getEnumOptions(validators.jsonSchema, field);
</script>

<RadioSelect {items} name={field} {label} {required} bind:group={$value} />
