export const load = async ({ request, locals, cookies }) => {
    return {
        userId: locals.userId
    };
};