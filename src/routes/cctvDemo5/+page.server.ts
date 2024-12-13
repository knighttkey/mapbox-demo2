import {
  MAPBOX_TOKEN,
  CUSTOM_MAP_STYLE_2,
  CCTV_XS_01,
  CCTV_XS_02,
  CCTV_XS_03,
  CCTV_XS_04,
} from "$env/static/private";
export async function load() {
  return {
    MAPBOX_TOKEN,
    CUSTOM_MAP_STYLE_2,
    CCTV_XS_01,
    CCTV_XS_02,
    CCTV_XS_03,
    CCTV_XS_04,
  };
}
