import { MAPBOX_TOKEN } from '$env/static/private'
export async function load() {
	return { MAPBOX_TOKEN }
}
