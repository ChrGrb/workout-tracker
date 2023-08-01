import { error } from '@sveltejs/kit'
import type { Actions, RequestEvent } from './$types';
import type { ExerciseSet, ExerciseSetType } from "@prisma/client";
import { redirect } from "@sveltejs/kit";

export const actions: Actions = {
	default: async ({ request, cookies, fetch, params }: RequestEvent) => {
		const exerciseId = params.exerciseId;
		const form = await request.formData();
		const exerciseSetType = form.get("exerciseSetType") as ExerciseSetType;
		const reps = Number(form.get("reps"));
		const weight = Number(form.get("weight"));
		const notes = form.get("notes");

		const exerciseSet: ExerciseSet = {
			reps: reps,
			weight: weight,
			exerciseSetType: exerciseSetType,
			notes: notes,
		} as ExerciseSet;

		console.log(exerciseSet);

		try {
			await fetch(
				"/api/exercise/" + exerciseId + "/set",
				{
					method: "POST",
					body: JSON.stringify({ exerciseSet: exerciseSet }),
					headers: {
						"content-type": "application/json",
					},
				}
			);
		} catch (responseError) {
			throw error(400, 'Could not add set to exercise');
		}

		throw redirect(303, '/overview/exercise/' + exerciseId);
	}
}