#!/usr/bin/env Rscript
# Builds website/data/*.json from the metro shapefiles produced by SubwayAnalysis.qmd.
# Run from the SubwayAnalysis project root: Rscript website/prepare_data.R

suppressMessages({
  library(sf)
  library(dplyr)
  library(jsonlite)
  library(data.table)
})

out_dir <- "website/data"
dir.create(out_dir, recursive = TRUE, showWarnings = FALSE)

FT_TO_KM <- 0.0003048
M_TO_KM <- 0.001
KM_TO_MI <- 0.621371

coords_of <- function(geom) {
  m <- sf::st_coordinates(geom)[, 1:2, drop = FALSE]
  lapply(seq_len(nrow(m)), function(i) unname(c(m[i, 1], m[i, 2])))
}

# Finds, for each of min/median/mean/max, the real segment whose length is closest to that
# value (min/max resolve exactly; median/mean are continuous values with no guaranteed exact
# match, so "closest real segment" is used uniformly for all four).
pick_example_segments <- function(dist_km) {
  targets <- c(min = min(dist_km), median = median(dist_km), mean = mean(dist_km), max = max(dist_km))
  sapply(targets, function(t) which.min(abs(dist_km - t)))
}

# Extracts a canonical line identifier from a China route name like
# "Metro Line 10 Phase III (People's Park - Taiping Garden)" -> "Line 10", so phase/direction/
# extension variants of the same physical line collapse into one for a "number of lines" count.
# Falls back to the name (stripped of its "(...)" endpoint suffix) for named non-numbered lines
# (e.g. "Bitong Wire", "River Jumper").
canonical_line_id <- function(route_en) {
  m <- regmatches(route_en, regexpr("Line\\s+[A-Za-z]?\\d+", route_en))
  ifelse(nchar(m) > 0, m, trimws(sub("\\(.*$", "", route_en)))
}

# The main pipeline's metro_routes.shp deliberately keeps only each route's single fullest
# stopping pattern (fine for stats, which don't depend on it) -- but that means any station that
# only sits on a *branch* has no drawn line under it here, showing up as a disconnected dot. For
# the website's line map specifically, pull every distinct shape (real branch/variant) straight
# from the GTFS feed so every station that's on any real branch has a line drawn through it.
build_full_routes_sf <- function(gtfs_dir) {
  trips <- fread(file.path(gtfs_dir, "trips.txt"), encoding = "UTF-8")
  shapes <- fread(file.path(gtfs_dir, "shapes.txt"), encoding = "UTF-8")
  routes <- fread(file.path(gtfs_dir, "routes.txt"), encoding = "UTF-8")

  trips <- trips[!is.na(shape_id) & shape_id != ""]
  rep_per_shape <- unique(trips, by = "shape_id")[, .(shape_id, route_id)]
  shapes <- shapes[order(shape_id, shape_pt_sequence)]

  rows <- lapply(seq_len(nrow(rep_per_shape)), function(i) {
    sid <- rep_per_shape$shape_id[i]
    shp <- shapes[shape_id == sid]
    st_linestring(cbind(shp$shape_pt_lon, shp$shape_pt_lat))
  })
  sf_obj <- st_sf(route_id = rep_per_shape$route_id, geometry = st_sfc(rows, crs = 4326))
  merge(sf_obj, routes[, .(route_id, route_nm = route_long_name)], by = "route_id", sort = FALSE)
}

build_system <- function(id, name, routes_sf, stops_sf, segments_sf,
                          route_name_col, stop_name_col, s_name_col, e_name_col, dist_col, dist_unit,
                          dedupe_bidirectional = FALSE, line_id_fn = NULL, route_id_col = NULL) {

  routes_sf <- st_transform(routes_sf, 4326)
  stops_sf <- st_transform(stops_sf, 4326)
  segments_sf <- st_transform(segments_sf, 4326)

  dist_raw <- segments_sf[[dist_col]]
  dist_km <- switch(dist_unit, ft = dist_raw * FT_TO_KM, m = dist_raw * M_TO_KM, km = dist_raw)

  if (dedupe_bidirectional) {
    s_name <- segments_sf[[s_name_col]]; e_name <- segments_sf[[e_name_col]]
    key <- paste(pmin(s_name, e_name), pmax(s_name, e_name))
    keep <- !duplicated(key)
    segments_sf <- segments_sf[keep, ]
    dist_km <- dist_km[keep]
  }

  # Defensive against source-data self-loops (same physical stop at both ends, e.g. a raw
  # Chengdu row with distance 0) -- not a real adjacency, and would corrupt the min stat and
  # "closest to shortest" example regardless of which city's source produced it.
  real_segment <- dist_km > 0.001
  if (any(!real_segment)) {
    cat(sprintf("  [%s] dropping %d zero/near-zero-length segment row(s) as data artifacts\n", id, sum(!real_segment)))
  }
  segments_sf <- segments_sf[real_segment, ]
  dist_km <- dist_km[real_segment]

  routes_out <- lapply(seq_len(nrow(routes_sf)), function(i) {
    list(name = routes_sf[[route_name_col]][i], coords = coords_of(st_geometry(routes_sf)[i]))
  })

  stops_out <- lapply(seq_len(nrow(stops_sf)), function(i) {
    xy <- st_coordinates(stops_sf[i, ])[1, ]
    list(name = stops_sf[[stop_name_col]][i], lon = unname(xy[1]), lat = unname(xy[2]))
  })

  segments_out <- lapply(seq_len(nrow(segments_sf)), function(i) {
    list(s_name = segments_sf[[s_name_col]][i], e_name = segments_sf[[e_name_col]][i],
         dist_km = round(dist_km[i], 4), coords = coords_of(st_geometry(segments_sf)[i]))
  })

  example_idx <- pick_example_segments(dist_km)
  examples <- lapply(names(example_idx), function(stat_name) {
    i <- example_idx[[stat_name]]
    list(stat = stat_name, dist_km = round(dist_km[i], 4),
         s_name = segments_sf[[s_name_col]][i], e_name = segments_sf[[e_name_col]][i],
         coords = coords_of(st_geometry(segments_sf)[i]))
  })

  n_lines <- if (!is.null(route_id_col)) length(unique(routes_sf[[route_id_col]]))
    else if (!is.null(line_id_fn)) length(unique(line_id_fn(routes_sf[[route_name_col]])))
    else nrow(routes_sf)

  stats <- list(
    num_segments = nrow(segments_sf),
    num_stations = nrow(stops_sf),
    num_lines = n_lines,
    total_track_km = round(sum(dist_km), 2),
    total_track_mi = round(sum(dist_km) * KM_TO_MI, 2),
    min_km = round(min(dist_km), 4), median_km = round(median(dist_km), 4),
    mean_km = round(mean(dist_km), 4), max_km = round(max(dist_km), 4)
  )

  list(id = id, name = name, stats = stats, routes = routes_out, stops = stops_out,
       segments = segments_out, examples = examples)
}

systems <- list()

# --- NYC (routes rebuilt from GTFS directly: all real branches, not just each route's fullest pattern) ---
systems$nyc <- build_system(
  "nyc", "New York City",
  build_full_routes_sf("gtfs_subway"),
  st_read("nyc_metro_shapefiles/metro_stops_unique.shp", quiet = TRUE),
  st_read("nyc_metro_shapefiles/metro_segments.shp", quiet = TRUE),
  route_name_col = "route_nm", stop_name_col = "stop_nm",
  s_name_col = "s_stop_nm", e_name_col = "e_stop_nm", dist_col = "dist_ft", dist_unit = "ft",
  route_id_col = "route_id"
)

# --- Chicago (same treatment) ---
systems$chicago <- build_system(
  "chicago", "Chicago",
  build_full_routes_sf("chicago-metro-gtfs"),
  st_read("chicago_metro_shapefiles/metro_stops_unique.shp", quiet = TRUE),
  st_read("chicago_metro_shapefiles/metro_segments.shp", quiet = TRUE),
  route_name_col = "route_nm", stop_name_col = "stop_nm",
  s_name_col = "s_stop_nm", e_name_col = "e_stop_nm", dist_col = "dist_ft", dist_unit = "ft",
  route_id_col = "route_id"
)

# --- Paris (same treatment) ---
systems$paris <- build_system(
  "paris", "Paris",
  build_full_routes_sf("paris-metro-gtfs"),
  st_read("paris_metro_shapefiles/metro_stops_unique.shp", quiet = TRUE),
  st_read("paris_metro_shapefiles/metro_segments.shp", quiet = TRUE),
  route_name_col = "route_nm", stop_name_col = "stop_nm",
  s_name_col = "s_stop_nm", e_name_col = "e_stop_nm", dist_col = "dist_m", dist_unit = "m",
  route_id_col = "route_id"
)

# --- Chengdu (China source stores every segment/route twice, once per direction) ---
systems$chengdu <- build_system(
  "chengdu", "Chengdu",
  st_read("CPTOND-2025/dataset/metro/shapefiles/Chengdu/chengdu_metro_routes.shp", quiet = TRUE, options = "ENCODING=UTF-8"),
  st_read("CPTOND-2025/dataset/metro/shapefiles/Chengdu/chengdu_metro_stops_unique.shp", quiet = TRUE, options = "ENCODING=UTF-8"),
  st_read("CPTOND-2025/dataset/metro/shapefiles/Chengdu/chengdu_metro_segments.shp", quiet = TRUE, options = "ENCODING=UTF-8"),
  route_name_col = "route_en", stop_name_col = "stop_en",
  s_name_col = "s_stop_en", e_name_col = "e_stop_en", dist_col = "distance", dist_unit = "km",
  dedupe_bidirectional = TRUE, line_id_fn = canonical_line_id
)

# --- Chongqing (same source/schema as Chengdu) ---
systems$chongqing <- build_system(
  "chongqing", "Chongqing",
  st_read("CPTOND-2025/dataset/metro/shapefiles/Chongqing/chongqing_metro_routes.shp", quiet = TRUE, options = "ENCODING=UTF-8"),
  st_read("CPTOND-2025/dataset/metro/shapefiles/Chongqing/chongqing_metro_stops_unique.shp", quiet = TRUE, options = "ENCODING=UTF-8"),
  st_read("CPTOND-2025/dataset/metro/shapefiles/Chongqing/chongqing_metro_segments.shp", quiet = TRUE, options = "ENCODING=UTF-8"),
  route_name_col = "route_en", stop_name_col = "stop_en",
  s_name_col = "s_stop_en", e_name_col = "e_stop_en", dist_col = "distance", dist_unit = "km",
  dedupe_bidirectional = TRUE, line_id_fn = canonical_line_id
)

for (sys in systems) {
  write_json(sys, file.path(out_dir, paste0(sys$id, ".json")), auto_unbox = TRUE, digits = 6)
  cat(sprintf("%-10s %4d segments  %4d stations  %3d lines  %8.1f km track\n",
              sys$id, sys$stats$num_segments, sys$stats$num_stations, sys$stats$num_lines, sys$stats$total_track_km))
}

manifest <- lapply(systems, function(s) list(id = s$id, name = s$name, stats = s$stats))
write_json(unname(manifest), file.path(out_dir, "manifest.json"), auto_unbox = TRUE, digits = 6)
cat("\nWrote", length(systems), "system files +", "manifest.json to", out_dir, "\n")
