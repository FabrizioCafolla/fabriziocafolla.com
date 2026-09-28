// Leaflet's stylesheet (15 KB), injected only when the map actually initializes. `?inline`
// pulls it in as a JS string instead of a CSS module: a plain `import "leaflet/dist/leaflet.css"`
// gets linked by Astro in the <head> of every page that reaches this module in the build graph,
// guide pages included on every other page too, even though only guide pages ever mount the map.
import css from "leaflet/dist/leaflet.css?inline";

if (!document.querySelector("style[data-guide-map-leaflet]")) {
  const style = document.createElement("style");
  style.dataset.guideMapLeaflet = "";
  style.textContent = css;
  document.head.append(style);
}
