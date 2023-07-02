export const load = async ({ parent }) => {
    const { userId } = await parent();

    return {
        userId: userId
    };
};