import { error } from '@sveltejs/kit'
import type { Actions, PageServerLoadEvent, RequestEvent } from './$types';
import type { Workout, WorkoutSet } from "@prisma/client";
import { redirect } from "@sveltejs/kit";

export async function load({ params, fetch }: PageServerLoadEvent) {
	if (!params.workoutId) {
		throw error(404, 'Workout not found');
	}

	const responseWorkout = await fetch("/api/workout/" + params.workoutId);
	const workout = (await responseWorkout.json()) as Workout;

	return {
		workout: workout,
	}
}

export const actions: Actions = {
	default: async ({ request, cookies, fetch, params }: RequestEvent) => {
		const workoutId = params.workoutId;
		const form = await request.formData();
		const isWarmup = form.get("isWarmup") === 'on' ? true : false;
		const reps = Number(form.get("reps"));
		const weight = Number(form.get("weight"));

		const workoutSet: WorkoutSet = {
			reps: reps,
			weight: weight,
			warmup: isWarmup,
		} as WorkoutSet;

		try {
			await fetch(
				"/api/workout/" + workoutId + "/set",
				{
					method: "POST",
					body: JSON.stringify({ workoutSet: workoutSet }),
					headers: {
						"content-type": "application/json",
					},
				}
			);
		} catch (responseError) {
			throw error(400, 'Could not add set to workout');
		}

		throw redirect(303, '/overview/workout/' + workoutId);
	}
}