import { getOverviewPath } from "./routes";

export const addCallbackToUrl = (url: string, callback: string) => {
    return `${url}?callback=${encodeURIComponent(callback)}`;
}

export const getCallbackFromQuery = (queryParam: string | null) => {
    if (!queryParam) {
        return getOverviewPath;
    }

    return decodeURIComponent(queryParam);
}