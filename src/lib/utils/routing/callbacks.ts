export const addCallbackToUrl = (url: string, callback: string) => {
    console.log("Callback: ", callback);
    return `${url}?callback=${encodeURIComponent(callback)}`;
}

export const getCallbackFromQuery = (queryParam: string) => {
    return decodeURIComponent(queryParam);
}