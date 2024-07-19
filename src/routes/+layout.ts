import type { LayoutLoad } from "./$types";
export const ssr = false;

export const load: LayoutLoad = async (event) => {
  return {
    session: null,
    url: event.url.pathname,
  };
};
