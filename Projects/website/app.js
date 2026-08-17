const DATA_DIR = "data";
const EARTH_KM = 6371;
const systemCache = new Map();
const STAT_ORDER = ["min", "median", "mean", "max"];
const STAT_LABEL = { min: "Shortest", median: "Median", mean: "Mean", max: "Longest" };

const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
const seriesColor = (n) => cssVar(`--series-${n}`);

function tooltip() {
  let el = document.querySelector(".tooltip");
  if (!el) {
    el = document.createElement("div");
    el.className = "tooltip";
    document.body.appendChild(el);
  }
  return d3.select(el);
}
function showTooltip(html, event) {
  tooltip().html(html).style("opacity", 1)
    .style("left", (event.pageX + 12) + "px").style("top", (event.pageY + 12) + "px");
}
function hideTooltip() { tooltip().style("opacity", 0); }

// Canonical line identifier for coloring: collapses direction/phase variants of the same
// physical line (e.g. "Metro Line 10 Phase III (A--B)") to one key ("Line 10"), matching the
// same regex the R data-prep script uses for its num_lines count.
function lineKey(name) {
  const m = name.match(/Line\s+[A-Za-z]?\d+/);
  if (m) return m[0];
  return name.replace(/\s*\(.*$/, "").trim();
}

// Deterministic large-N qualitative palette via golden-angle hue rotation -- standard practice
// for many-category maps (transit systems routinely have more lines than perceptually distinct
// "dashboard-safe" hues), fixed order per system so re-renders are stable.
function lineColorScale(keys) {
  const map = new Map();
  const dark = document.documentElement.getAttribute("data-theme") === "dark" ||
    (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const s = 62, l = dark ? 62 : 46;
  keys.forEach((k, i) => map.set(k, `hsl(${(i * 137.508) % 360}, ${s}%, ${l}%)`));
  return (k) => map.get(k);
}

async function loadSystem(id) {
  if (!systemCache.has(id)) {
    const res = await fetch(`${DATA_DIR}/${id}.json`);
    systemCache.set(id, await res.json());
  }
  return systemCache.get(id);
}

function centroidOf(stops) {
  return [d3.mean(stops, (s) => s.lon), d3.mean(stops, (s) => s.lat)];
}

function asLineFeature(coords) { return { type: "LineString", coordinates: coords }; }
function asPointFeature(lon, lat) { return { type: "Point", coordinates: [lon, lat] }; }

// ---------- Overlay ----------

function renderOverlay(sysA, sysB) {
  const wrap = d3.select("#overlay");
  wrap.selectAll("*").remove();
  const w = wrap.node().clientWidth || 900, h = Math.round(w * 0.75);
  const svg = wrap.append("svg").attr("viewBox", [0, 0, w, h]).attr("width", "100%").attr("height", h);
  const center = [w / 2, h / 2];
  const pad = 20;

  const systems = [
    { sys: sysA, color: seriesColor(1) },
    { sys: sysB, color: seriesColor(2) },
  ];

  // shared physical scale: each system's true 2D extent (in km, relative to its own centroid)
  // is used to find the tightest px-per-km that still lets BOTH systems fit -- a plain
  // max-radius heuristic under-uses the canvas badly for non-circular systems (e.g. a system
  // that's long and thin still only needs to fit its actual width/height, not a circle sized
  // to its longest radius).
  const pxPerKmCandidates = systems.map(({ sys }) => {
    const [clon, clat] = centroidOf(sys.stops);
    const proj0 = d3.geoAzimuthalEquidistant().rotate([-clon, -clat]).scale(EARTH_KM).translate([0, 0]);
    const pts = sys.stops.map((s) => proj0([s.lon, s.lat]));
    const extentX = d3.max(pts, (p) => Math.abs(p[0])), extentY = d3.max(pts, (p) => Math.abs(p[1]));
    return Math.min((w / 2 - pad) / extentX, (h / 2 - pad) / extentY);
  });
  const pxPerKm = d3.min(pxPerKmCandidates);
  const scaleParam = pxPerKm * EARTH_KM;

  systems.forEach(({ sys, color }) => {
    const [clon, clat] = centroidOf(sys.stops);
    const projection = d3.geoAzimuthalEquidistant().rotate([-clon, -clat]).scale(scaleParam).translate(center);
    const path = d3.geoPath(projection);
    svg.append("g").attr("fill", "none").attr("stroke", color)
      .attr("stroke-width", 2).attr("stroke-linecap", "round").attr("stroke-linejoin", "round")
      .selectAll("path").data(sys.segments).join("path").attr("d", (d) => path(asLineFeature(d.coords)));
  });

  const legend = d3.select("#overlay-legend");
  legend.selectAll("*").remove();
  systems.forEach(({ sys, color }) => {
    const item = legend.append("span").attr("class", "swatch");
    item.append("span").attr("class", "dot").style("background", color);
    item.append("span").text(sys.name);
  });
}

// ---------- Per-system detail map ----------

function renderSystemMap(container, sys) {
  container.selectAll("*").remove();
  const w = container.node().clientWidth || 800;

  // Size the box to the system's own geographic aspect ratio (locally-flat approximation, with
  // a latitude correction on longitude) instead of a fixed ratio -- a fixed box wastes a lot of
  // space (and reads as "squished") for any system whose true shape doesn't match it, since
  // fitExtent preserves true aspect ratio and just pads out whichever axis has room to spare.
  const [clon, clat] = centroidOf(sys.stops);
  const kmPerDegLon = 111.32 * Math.cos((clat * Math.PI) / 180), kmPerDegLat = 111.32;
  const lons = sys.stops.map((s) => s.lon), lats = sys.stops.map((s) => s.lat);
  const extentXKm = (d3.max(lons) - d3.min(lons)) * kmPerDegLon;
  const extentYKm = (d3.max(lats) - d3.min(lats)) * kmPerDegLat;
  const aspect = Math.min(Math.max(extentXKm / extentYKm, 0.45), 2.2); // clamp so no system goes absurdly thin
  const h = Math.round(w / aspect);

  const svg = container.append("svg").attr("viewBox", [0, 0, w, h]).attr("width", "100%").attr("height", h);

  const pad = 16;
  const fc = { type: "GeometryCollection", geometries: sys.segments.map((d) => asLineFeature(d.coords)) };
  // Mercator, not azimuthal-equidistant, on purpose: azimuthal projections preserve true
  // distance/bearing from one center point, which rotates content that's off-center relative to
  // true north by an amount that depends on its direction from the center -- exactly right for
  // the overlay (comparing two systems' scale from their own centroids), but wrong for a single
  // system's own reference map, where every part should just be north-up and consistent with
  // itself (and with the example-segment mini-diagrams, which use a plain flat local projection).
  const projection = d3.geoMercator().fitExtent([[pad, pad], [w - pad, h - pad]], fc);
  const path = d3.geoPath(projection);

  const keys = [...new Set(sys.routes.map((r) => lineKey(r.name)))];
  const color = lineColorScale(keys);

  svg.append("g").attr("fill", "none").attr("stroke-width", 2)
    .attr("stroke-linecap", "round").attr("stroke-linejoin", "round")
    .selectAll("path").data(sys.routes).join("path")
    .attr("stroke", (d) => color(lineKey(d.name)))
    .attr("d", (d) => path(asLineFeature(d.coords)))
    .append("title").text((d) => d.name);

  const projectedStops = sys.stops
    .map((d) => ({ d, p: projection([d.lon, d.lat]) }))
    .filter(({ p }) => p && Number.isFinite(p[0]) && Number.isFinite(p[1]));

  svg.append("g").attr("fill", cssVar("--text-primary")).attr("fill-opacity", 0.85)
    .selectAll("circle").data(projectedStops).join("circle")
    .attr("cx", ({ p }) => p[0])
    .attr("cy", ({ p }) => p[1])
    .attr("r", 1.4)
    .on("mouseenter", (event, { d }) => showTooltip(`<strong>${d.name}</strong>`, event))
    .on("mousemove", (event) => showTooltip(tooltip().html(), event))
    .on("mouseleave", hideTooltip);
}

// ---------- Example (min/median/mean/max) segment shapes ----------

function projectLocal(coords, pxPerKm) {
  const lon0 = coords[0][0], lat0 = coords[0][1];
  const mPerDegLat = 111320, mPerDegLon = 111320 * Math.cos((lat0 * Math.PI) / 180);
  return coords.map(([lon, lat]) => [
    (lon - lon0) * mPerDegLon / 1000 * pxPerKm,
    -(lat - lat0) * mPerDegLat / 1000 * pxPerKm,
  ]);
}

// Renders this system's own min/median/mean/max example segments, scaled relative to each
// other (not to the other selected system) so the longest one fills most of its box and the
// rest read as true fractions of it -- a shared cross-system scale would make a short system's
// "longest" segment look tiny next to a long system's, which isn't the comparison being drawn
// here (the bar chart handles the cross-system numeric comparison).
function renderExamples(container, sys) {
  container.selectAll("*").remove();
  const box = 130;

  // find the true pixel-per-km that makes the *longest* example's own bounding-box diagonal
  // fill ~80% of the box, then reuse that scale for all four so relative lengths stay honest
  const maxEx = sys.examples.find((e) => e.stat === "max");
  const trialPts = projectLocal(maxEx.coords, 1);
  const trialXs = trialPts.map((p) => p[0]), trialYs = trialPts.map((p) => p[1]);
  const trialSpan = Math.max(d3.max(trialXs) - d3.min(trialXs), d3.max(trialYs) - d3.min(trialYs)) || 1;
  const pxPerKm = (box * 0.8) / trialSpan;

  STAT_ORDER.forEach((stat) => {
    const ex = sys.examples.find((e) => e.stat === stat);
    const tile = container.append("div").attr("class", "example-tile");
    const svg = tile.append("svg").attr("viewBox", [0, 0, box, box]).attr("width", "100%").attr("height", box);

    const pts = projectLocal(ex.coords, pxPerKm);
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    const cx = (d3.min(xs) + d3.max(xs)) / 2, cy = (d3.min(ys) + d3.max(ys)) / 2;
    const line = d3.line().x((p) => p[0] - cx + box / 2).y((p) => p[1] - cy + box / 2);

    svg.append("path").attr("d", line(pts)).attr("fill", "none")
      .attr("stroke", seriesColor(STAT_ORDER.indexOf(stat) + 5)).attr("stroke-width", 2.5)
      .attr("stroke-linecap", "round").attr("stroke-linejoin", "round");

    tile.append("div").attr("class", "cap").text(STAT_LABEL[stat]);
    tile.append("div").attr("class", "len").text(`${ex.dist_km.toFixed(2)} km`);
    tile.append("div").attr("class", "names").attr("title", `${ex.s_name} → ${ex.e_name}`)
      .text(`${ex.s_name} → ${ex.e_name}`);
  });
}

// ---------- Stat tiles ----------

function renderStats(container, sys) {
  container.selectAll("*").remove();
  const s = sys.stats;
  const tiles = [
    ["Segments", s.num_segments], ["Stations", s.num_stations], ["Lines", s.num_lines],
    ["Track length", `${s.total_track_km.toLocaleString()} km / ${s.total_track_mi.toLocaleString()} mi`],
    ["Shortest segment", `${s.min_km.toFixed(2)} km`], ["Median segment", `${s.median_km.toFixed(2)} km`],
    ["Mean segment", `${s.mean_km.toFixed(2)} km`], ["Longest segment", `${s.max_km.toFixed(2)} km`],
  ];
  tiles.forEach(([label, value]) => {
    const t = container.append("div").attr("class", "stat-tile");
    t.append("div").attr("class", "v").text(value);
    t.append("div").attr("class", "l").text(label);
  });
}

// ---------- Comparison bar chart ----------

function renderCompareChart(sysA, sysB) {
  const wrap = d3.select("#compare-chart");
  wrap.selectAll("*").remove();
  const w = wrap.node().clientWidth || 900, h = 320;
  const margin = { top: 24, right: 16, bottom: 32, left: 48 };
  const svg = wrap.append("svg").attr("viewBox", [0, 0, w, h]).attr("width", "100%").attr("height", h);

  const data = STAT_ORDER.map((stat) => ({
    stat, a: sysA.stats[`${stat}_km`], b: sysB.stats[`${stat}_km`],
  }));

  const x0 = d3.scaleBand().domain(STAT_ORDER).range([margin.left, w - margin.right]).padding(0.3);
  const x1 = d3.scaleBand().domain(["a", "b"]).range([0, x0.bandwidth()]).padding(0.15);
  const y = d3.scaleLinear().domain([0, d3.max(data, (d) => Math.max(d.a, d.b)) * 1.1]).nice()
    .range([h - margin.bottom, margin.top]);

  svg.append("g").attr("transform", `translate(0,${h - margin.bottom})`)
    .call(d3.axisBottom(x0).tickFormat((d) => STAT_LABEL[d]).tickSize(0))
    .call((g) => g.select(".domain").attr("stroke", cssVar("--border")));
  svg.append("g").attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(5).tickFormat((d) => `${d} km`))
    .call((g) => g.select(".domain").remove())
    .call((g) => g.selectAll(".tick line").attr("stroke", cssVar("--border")));

  const groups = svg.append("g").selectAll("g").data(data).join("g")
    .attr("transform", (d) => `translate(${x0(d.stat)},0)`);

  ["a", "b"].forEach((key, i) => {
    const sysName = key === "a" ? sysA.name : sysB.name;
    groups.append("rect")
      .attr("x", x1(key)).attr("width", x1.bandwidth())
      .attr("y", (d) => y(d[key])).attr("height", (d) => (h - margin.bottom) - y(d[key]))
      .attr("rx", 3).attr("fill", seriesColor(i + 1))
      .on("mouseenter", function (event, d) {
        showTooltip(`<strong>${sysName}</strong><br>${STAT_LABEL[d.stat]}: ${d[key].toFixed(3)} km`, event);
      })
      .on("mousemove", (event) => showTooltip(tooltip().html(), event))
      .on("mouseleave", hideTooltip);
  });

  const legend = svg.append("g").attr("transform", `translate(${margin.left},${margin.top - 14})`);
  [sysA.name, sysB.name].forEach((name, i) => {
    const g = legend.append("g").attr("transform", `translate(${i * 140},0)`);
    g.append("rect").attr("width", 10).attr("height", 10).attr("rx", 2).attr("fill", seriesColor(i + 1));
    g.append("text").attr("x", 15).attr("y", 9).attr("font-size", 11).text(name);
  });
}

// ---------- Orchestration ----------

async function render() {
  const idA = document.getElementById("pick-a").value;
  const idB = document.getElementById("pick-b").value;
  const [sysA, sysB] = await Promise.all([loadSystem(idA), loadSystem(idB)]);

  renderOverlay(sysA, sysB);
  renderCompareChart(sysA, sysB);

  const detail = d3.select("#detail");
  detail.selectAll("*").remove();

  [sysA, sysB].forEach((sys, i) => {
    const card = detail.append("div").attr("class", "system-card");
    card.append("h3").html(`<span style="color:${seriesColor(i + 1)}">●</span> ${sys.name}`);
    const mapWrap = card.append("div").attr("class", "map-wrap");
    renderSystemMap(mapWrap, sys);
    const statGrid = card.append("div").attr("class", "stat-grid");
    renderStats(statGrid, sys);
    const exRow = card.append("div").attr("class", "examples-row");
    renderExamples(exRow, sys);
  });
}

async function init() {
  const manifest = await (await fetch(`${DATA_DIR}/manifest.json`)).json();
  const selA = document.getElementById("pick-a"), selB = document.getElementById("pick-b");
  manifest.forEach((sys) => {
    selA.add(new Option(sys.name, sys.id));
    selB.add(new Option(sys.name, sys.id));
  });
  selA.value = manifest[0].id;
  selB.value = manifest[1] ? manifest[1].id : manifest[0].id;
  selA.addEventListener("change", render);
  selB.addEventListener("change", render);
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(render, 150);
  });
  render();
}

init();
