import { createServerFn } from "@tanstack/react-start";
import { getGalleryData } from "./service";
import type { GallerySearch } from "./types";

export const loadGalleryData = createServerFn({ method: "GET" })
  .validator((search: GallerySearch) => search)
  .handler(({ data }) => getGalleryData(data));
