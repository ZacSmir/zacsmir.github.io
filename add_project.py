#!/usr/bin/env python3
"""
Usage: python add_project.py <slug> "<Title>" "<Blurb>"

  slug   — base name of the project file (e.g. "myproject" for myproject.html)
  Title  — display name shown in the infobox and grid
  Blurb  — short description shown on the main page infobox

Expects:
  Projects/<slug>.html          — the project page you already created
  Projects/Project_images/<slug>.<ext>  — thumbnail image (any common extension)

Updates:
  Projects/projects.html        — adds a grid item before the placeholder block
  index.html                    — adds an infobox before the placeholder box
"""

import sys
import os
import re
import subprocess

BLOG_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECTS_HTML = os.path.join(BLOG_DIR, "Projects", "projects.html")
INDEX_HTML = os.path.join(BLOG_DIR, "index.html")
IMAGES_DIR = os.path.join(BLOG_DIR, "Projects", "Project_images")

IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".avif", ".webp", ".gif"]


def find_image(slug):
    for ext in IMAGE_EXTENSIONS:
        candidate = os.path.join(IMAGES_DIR, slug + ext)
        if os.path.exists(candidate):
            return slug + ext
    return None


def insert_before(content, marker, new_block):
    if marker not in content:
        raise ValueError(f"Marker not found in file:\n  {marker}")
    return content.replace(marker, new_block + "\n        " + marker, 1)


def update_projects_html(slug, title, image_filename):
    with open(PROJECTS_HTML, "r") as f:
        content = f.read()

    new_item = f"""        <div class="grid-item">
            <a href="{slug}.html">
                <img src="Project_images/{image_filename}" alt="{title}">
                <div>{title}</div>
            </a>
        </div>

"""

    # Insert before the closing comment
    marker = '<!-- Add more items by copying the grid-item block above -->'
    updated = insert_before(content, marker, new_item.rstrip("\n"))

    with open(PROJECTS_HTML, "w") as f:
        f.write(updated)

    print(f"  projects.html updated")


def update_index_html(slug, title, blurb, image_filename):
    with open(INDEX_HTML, "r") as f:
        content = f.read()

    new_infobox = f"""            <!-- {title} -->
            <a href="Projects/{slug}.html" class="infobox">
                <img src="Projects/Project_images/{image_filename}" alt="{title}" class="infobox-image">
                <div class="infobox-content">
                    <h2 class="infobox-title">{title}</h2>
                    <p class="infobox-blurb">{blurb}</p>
                </div>
            </a>

"""

    # Insert before the closing comment
    marker = '<!-- Add more infoboxes by copying the structure above -->'
    updated = insert_before(content, marker, new_infobox.rstrip("\n"))

    with open(INDEX_HTML, "w") as f:
        f.write(updated)

    print(f"  index.html updated")


def main():
    if len(sys.argv) != 4:
        print("Usage: python add_project.py <slug> \"<Title>\" \"<Blurb>\"")
        sys.exit(1)

    slug, title, blurb = sys.argv[1], sys.argv[2], sys.argv[3]

    # Validate project page exists
    project_page = os.path.join(BLOG_DIR, "Projects", f"{slug}.html")
    if not os.path.exists(project_page):
        print(f"Error: Projects/{slug}.html not found")
        sys.exit(1)

    # Find thumbnail
    image_filename = find_image(slug)
    if not image_filename:
        print(f"Error: No image found in Projects/Project_images/ matching '{slug}' (tried {IMAGE_EXTENSIONS})")
        sys.exit(1)

    print(f"Adding project: {title}")
    print(f"  Page:  Projects/{slug}.html")
    print(f"  Image: Projects/Project_images/{image_filename}")

    update_projects_html(slug, title, image_filename)
    update_index_html(slug, title, blurb, image_filename)

    print("Done.")


if __name__ == "__main__":
    main()
