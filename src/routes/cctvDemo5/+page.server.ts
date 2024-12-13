import {
  MAPBOX_TOKEN,
  CUSTOM_MAP_STYLE_2,
} from "$env/static/private";
export async function load() {
  return {
    MAPBOX_TOKEN,
    CUSTOM_MAP_STYLE_2,
  };
}
