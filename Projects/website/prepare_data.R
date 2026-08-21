#!/usr/bin/env Rscript
# Builds website/data/*.json from two sources:
#  - every city folder in ../Outputs/ (produced by R Files/SubwayAnalysis.qmd from GTFS)
#  - the China cities marked [X] in china_cities_selection.txt, read directly from
#    ../CHINA Download/ (no equivalent "Outputs" step for these -- the source shapefiles
#    already have routes/stops_unique/segments in the shape we need)
# Run from website/: Rscript prepare_data.R

suppressMessages({
  library(sf)
  library(dplyr)
  library(jsonlite)
  library(data.table)
})

out_dir <- "data"
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
  # regmatches()+regexpr() silently DROPS elements that don't match rather than aligning by
  # position -- for cities whose lines are named, not numbered (e.g. Hong Kong's "Tseung Kwan
  # O Line"), that can mean nothing matches at all and the result collapses to length 0. Must
  # check match success (rx > 0) explicitly and overwrite by position instead.
  rx <- regexpr("Line\\s+[A-Za-z]?\\d+", route_en)
  matched <- regmatches(route_en, rx)
  out <- trimws(sub("\\(.*$", "", route_en))
  out[rx > 0] <- matched
  out
}

# Optional pretty display names for GTFS-derived cities; falls back to a title-cased id if a
# newly-added city isn't listed here yet.
display_names <- list(nyc = "New York City", chicago = "Chicago", paris = "Paris")
pretty_name <- function(id) {
  if (!is.null(display_names[[id]])) return(display_names[[id]])
  tools::toTitleCase(gsub("[-_]+", " ", id))
}

# The pipeline's Outputs/*/metro_routes.shp deliberately keeps only each route's single
# fullest stopping pattern (fine for stats, which don't depend on it) -- but that means any
# station that only sits on a *branch* has no drawn line under it here, showing up as a
# disconnected dot. For the website's line map specifically, pull every distinct shape (real
# branch/variant) straight from the filtered GTFS folder so every station on any real branch
# has a line drawn through it.
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
  # China row with distance 0) -- not a real adjacency, and would corrupt the min stat and
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
    else if (!is.null(line_id_fn)) {
      line_ids <- line_id_fn(routes_sf[[route_name_col]])
      # A text-matching function that can't confidently label every route (e.g. a fallback
      # regex silently dropping non-matching elements instead of erroring) must fail loudly
      # here, not ship a plausible-looking wrong count -- this is exactly the class of bug
      # that produced "0 lines" for Hong Kong.
      if (length(line_ids) != nrow(routes_sf) || anyNA(line_ids) || any(!nzchar(line_ids)))
        stop("[", id, "] line_id_fn produced ", length(line_ids), " labels for ",
             nrow(routes_sf), " routes (with NAs/blanks: ", anyNA(line_ids) || any(!nzchar(line_ids)),
             ") -- refusing to report a possibly-wrong num_lines")
      length(unique(line_ids))
    }
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

# ---- Source 1: every city folder in ../Outputs/ (+ its matching ../GTFS Filtered/<id>/ for
# full branch route geometry) ----
load_gtfs_city <- function(city_id) {
  out_dir_city <- file.path("..", "Outputs", city_id)
  filtered_dir <- file.path("..", "GTFS Filtered", city_id)
  dist_col <- if (file.exists(file.path(out_dir_city, "metro_segments.dbf"))) {
    seg_fields <- names(st_read(file.path(out_dir_city, "metro_segments.shp"), quiet = TRUE))
    intersect(seg_fields, c("dist_ft", "dist_m"))[1]
  } else NA
  if (is.na(dist_col)) stop("Outputs/", city_id, "/metro_segments.shp has neither dist_ft nor dist_m -- can't tell its distance unit")

  build_system(
    city_id, pretty_name(city_id),
    build_full_routes_sf(filtered_dir),
    st_read(file.path(out_dir_city, "metro_stops_unique.shp"), quiet = TRUE),
    st_read(file.path(out_dir_city, "metro_segments.shp"), quiet = TRUE),
    route_name_col = "route_nm", stop_name_col = "stop_nm",
    s_name_col = "s_stop_nm", e_name_col = "e_stop_nm",
    dist_col = dist_col, dist_unit = if (dist_col == "dist_ft") "ft" else "m",
    route_id_col = "route_id"
  )
}

# ---- Source 2: a China city, straight from ../CHINA Download/<CityDir>/ ----
load_china_city <- function(city_dir_name) {
  base <- file.path("..", "CHINA Download", city_dir_name)
  routes_path <- list.files(base, pattern = "_metro_routes\\.shp$", full.names = TRUE)[1]
  if (is.na(routes_path)) stop("no *_metro_routes.shp found in CHINA Download/", city_dir_name)
  prefix <- sub("_metro_routes\\.shp$", "", basename(routes_path))
  id <- tolower(gsub("[^A-Za-z0-9]+", "", city_dir_name))

  build_system(
    id, city_dir_name,
    st_read(file.path(base, paste0(prefix, "_metro_routes.shp")), quiet = TRUE, options = "ENCODING=UTF-8"),
    st_read(file.path(base, paste0(prefix, "_metro_stops_unique.shp")), quiet = TRUE, options = "ENCODING=UTF-8"),
    st_read(file.path(base, paste0(prefix, "_metro_segments.shp")), quiet = TRUE, options = "ENCODING=UTF-8"),
    route_name_col = "route_en", stop_name_col = "stop_en",
    s_name_col = "s_stop_en", e_name_col = "e_stop_en", dist_col = "distance", dist_unit = "km",
    dedupe_bidirectional = TRUE, line_id_fn = canonical_line_id
  )
}

# ================= Load every GTFS-derived city automatically =================

systems <- list()

for (city_id in list.dirs("../Outputs", recursive = FALSE, full.names = FALSE)) {
  systems[[city_id]] <- load_gtfs_city(city_id)
}

# ================= Load only the China cities marked [X] =================

selection_file <- "china_cities_selection.txt"
sel_lines <- readLines(selection_file)
selected <- trimws(sub("^\\[[Xx]\\]\\s*", "", grep("^\\[[Xx]\\]", sel_lines, value = TRUE)))
cat("China cities selected:", if (length(selected)) paste(selected, collapse = ", ") else "(none)", "\n")

for (city_dir_name in selected) {
  sys <- load_china_city(city_dir_name)
  systems[[sys$id]] <- sys
}

# ================= Write output =================

for (sys in systems) {
  write_json(sys, file.path(out_dir, paste0(sys$id, ".json")), auto_unbox = TRUE, digits = 6)
  cat(sprintf("%-12s %4d segments  %4d stations  %3d lines  %8.1f km track\n",
              sys$id, sys$stats$num_segments, sys$stats$num_stations, sys$stats$num_lines, sys$stats$total_track_km))
}

manifest <- lapply(systems, function(s) list(id = s$id, name = s$name, stats = s$stats))
write_json(unname(manifest), file.path(out_dir, "manifest.json"), auto_unbox = TRUE, digits = 6)
cat("\nWrote", length(systems), "system files + manifest.json to", out_dir, "\n")
