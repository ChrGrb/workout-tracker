import { defineMutators } from "@rocicorp/zero";
import { createSession } from "./session/create";
import { updateSession } from "./session/update";
import { deleteSession } from "./session/delete";
import { createExercise } from "./exercise/create";
import { deleteExercise } from "./exercise/delete";
import { createExerciseSet } from "./exerciseSet/create";
import { deleteExerciseSet } from "./exerciseSet/delete";
import { updateSettings } from "./settings/update";
import { createExerciseType } from "./exerciseType/create";
import { updateExerciseType } from "./exerciseType/update";
import { deleteExerciseType } from "./exerciseType/delete";
import { createTemplate } from "./template/create";
import { updateTemplate } from "./template/update";
import { deleteTemplate } from "./template/delete";
import { createEquipment } from "./equipment/create";
import { updateEquipment } from "./equipment/update";
import { deleteEquipment } from "./equipment/delete";

// The mutator registry. To add a mutator: create a file exporting an `m(...)`
// definition and wire it in here — one file per mutator keeps this from growing
// unbounded.
export const mutators = defineMutators({
  session: {
    create: createSession,
    update: updateSession,
    delete: deleteSession,
  },
  exercise: {
    create: createExercise,
    delete: deleteExercise,
  },
  exerciseSet: {
    create: createExerciseSet,
    delete: deleteExerciseSet,
  },
  settings: {
    update: updateSettings,
  },
  exerciseType: {
    create: createExerciseType,
    update: updateExerciseType,
    delete: deleteExerciseType,
  },
  template: {
    create: createTemplate,
    update: updateTemplate,
    delete: deleteTemplate,
  },
  equipment: {
    create: createEquipment,
    update: updateEquipment,
    delete: deleteEquipment,
  },
});

export type Mutators = typeof mutators;

export type { ZeroAuthData } from "./shared";
export type { CreateSessionArgs } from "./session/create";
export type { UpdateSessionArgs } from "./session/update";
export type { CreateExerciseArgs } from "./exercise/create";
export type { CreateExerciseSetArgs } from "./exerciseSet/create";
export type { UpdateSettingsArgs } from "./settings/update";
export type { CreateExerciseTypeArgs } from "./exerciseType/create";
export type { UpdateExerciseTypeArgs } from "./exerciseType/update";
export type { CreateTemplateArgs } from "./template/create";
export type { UpdateTemplateArgs } from "./template/update";
export type { CreateEquipmentArgs } from "./equipment/create";
export type { UpdateEquipmentArgs } from "./equipment/update";
