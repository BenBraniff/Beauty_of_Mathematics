"""Convert a character image into normalized points for a harmonograph."""

from __future__ import annotations

import argparse
import csv
from pathlib import Path

import cv2
import numpy as np


SCRIPT_DIRECTORY = Path(__file__).resolve().parent
REPOSITORY_ROOT = SCRIPT_DIRECTORY.parent
DEFAULT_IMAGE = REPOSITORY_ROOT / "Beauty_of_math" / "src" / "assets" / "bluey.jpg"
DEFAULT_OUTPUT = SCRIPT_DIRECTORY / "bluey_points.csv"


def find_outer_contour(image: np.ndarray) -> np.ndarray:
    """Return the largest external contour for the non-background subject."""
    height, width = image.shape[:2]
    border_width = max(1, min(height, width) // 20)
    border = np.concatenate(
        (
            image[:border_width].reshape(-1, 3),
            image[-border_width:].reshape(-1, 3),
            image[:, :border_width].reshape(-1, 3),
            image[:, -border_width:].reshape(-1, 3),
        )
    )
    background = np.median(border, axis=0).astype(np.uint8)
    color_distance = np.max(
        np.abs(image.astype(np.int16) - background.astype(np.int16)),
        axis=2,
    )
    mask = np.where(color_distance > 18, 255, 0).astype(np.uint8)

    kernel = np.ones((5, 5), dtype=np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel, iterations=2)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel, iterations=1)

    contours, _ = cv2.findContours(
        mask,
        cv2.RETR_EXTERNAL,
        cv2.CHAIN_APPROX_NONE,
    )
    if not contours:
        raise ValueError("No foreground contour was found in the image.")

    contour = max(contours, key=cv2.contourArea)
    if cv2.contourArea(contour) <= 0:
        raise ValueError("The detected foreground contour has no area.")
    return contour[:, 0, :].astype(np.float64)


def resample_closed_contour(contour: np.ndarray, point_count: int) -> np.ndarray:
    """Return evenly spaced points around a closed contour."""
    if point_count < 2:
        raise ValueError("point_count must be at least 2.")

    closed_contour = np.vstack((contour, contour[0]))
    segment_lengths = np.linalg.norm(np.diff(closed_contour, axis=0), axis=1)
    perimeter = float(segment_lengths.sum())
    if perimeter == 0:
        raise ValueError("The contour has zero perimeter.")

    distances = np.concatenate(([0.0], np.cumsum(segment_lengths)))
    target_distances = np.arange(point_count, dtype=np.float64) * perimeter / point_count
    x = np.interp(target_distances, distances, closed_contour[:, 0])
    y = np.interp(target_distances, distances, closed_contour[:, 1])
    return np.column_stack((x, y))


def normalize_points(points: np.ndarray) -> np.ndarray:
    """Center points, invert the image y-axis, and scale them to unit size."""
    normalized = points - points.mean(axis=0)
    normalized[:, 1] *= -1
    scale = float(np.max(np.abs(normalized)))
    if scale == 0:
        raise ValueError("The contour points cannot be normalized.")
    return normalized / scale


def write_points(points: np.ndarray, output_path: Path) -> None:
    """Write normalized points as a CSV with the explorer's x,y columns."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", newline="", encoding="utf-8") as csv_file:
        writer = csv.writer(csv_file)
        writer.writerow(("x", "y"))
        writer.writerows((f"{x:.8f}", f"{y:.8f}") for x, y in points)


def convert_image(image_path: Path, output_path: Path, point_count: int) -> None:
    """Load an image, extract its outline, and save harmonograph points."""
    image = cv2.imread(str(image_path), cv2.IMREAD_COLOR)
    if image is None:
        raise FileNotFoundError(f"Could not read image: {image_path}")

    contour = find_outer_contour(image)
    points = normalize_points(resample_closed_contour(contour, point_count))
    write_points(points, output_path)
    print(f"Wrote {len(points)} points to {output_path}")


def parse_args() -> argparse.Namespace:
    """Parse command-line options."""
    parser = argparse.ArgumentParser(
        description="Extract a normalized closed contour from an image as CSV points."
    )
    parser.add_argument(
        "image",
        nargs="?",
        type=Path,
        default=DEFAULT_IMAGE,
        help=f"Input image (default: {DEFAULT_IMAGE})",
    )
    parser.add_argument(
        "-o",
        "--output",
        type=Path,
        default=DEFAULT_OUTPUT,
        help=f"Output CSV (default: {DEFAULT_OUTPUT})",
    )
    parser.add_argument(
        "-n",
        "--points",
        type=int,
        default=750,
        help="Number of evenly spaced output points (default: 750)",
    )
    return parser.parse_args()


def main() -> None:
    """Run image-to-point conversion from the command line."""
    args = parse_args()
    convert_image(args.image, args.output, args.points)


if __name__ == "__main__":
    main()
