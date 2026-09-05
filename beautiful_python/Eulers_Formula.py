"""Draw and label an octahedron to illustrate Euler's formula."""

import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d.art3d import Poly3DCollection


def create_octahedron():
	"""Return the vertices, edges, and triangular faces of an octahedron."""
	vertices = {
		"A": (1, 0, 0),
		"B": (0, 1, 0),
		"C": (-1, 0, 0),
		"D": (0, -1, 0),
		"E": (0, 0, 1),
		"F": (0, 0, -1),
	}

	edges = [
		("A", "B"),
		("B", "C"),
		("C", "D"),
		("D", "A"),
		("A", "E"),
		("B", "E"),
		("C", "E"),
		("D", "E"),
		("A", "F"),
		("B", "F"),
		("C", "F"),
		("D", "F"),
	]

	faces = [
		("A", "B", "E"),
		("B", "C", "E"),
		("C", "D", "E"),
		("D", "A", "E"),
		("A", "B", "F"),
		("B", "C", "F"),
		("C", "D", "F"),
		("D", "A", "F"),
	]

	return vertices, edges, faces


def plot_octahedron():
	"""Display a labeled octahedron and verify V - E + F = 2."""
	vertices, edges, faces = create_octahedron()
	figure = plt.figure(figsize=(10, 8))
	axis = figure.add_subplot(111, projection="3d")

	face_colors = ["#8ecae6", "#219ebc", "#ffb703", "#fb8500"] * 2
	for face, color in zip(faces, face_colors):
		points = [vertices[name] for name in face]
		axis.add_collection3d(
			Poly3DCollection(
				[points],
				facecolors=color,
				edgecolors="black",
				linewidths=1,
				alpha=0.42,
			)
		)

		center = tuple(sum(point[index] for point in points) / 3 for index in range(3))
		axis.text(*center, f"F{faces.index(face) + 1}", color="darkred", weight="bold")

	for edge_number, (start, end) in enumerate(edges, start=1):
		start_point = vertices[start]
		end_point = vertices[end]
		axis.plot(
			[start_point[0], end_point[0]],
			[start_point[1], end_point[1]],
			[start_point[2], end_point[2]],
			color="black",
			linewidth=2,
		)
		midpoint = tuple((start_point[index] + end_point[index]) / 2 for index in range(3))
		axis.text(*midpoint, f"E{edge_number}", color="darkgreen", fontsize=9)

	for name, point in vertices.items():
		axis.scatter(*point, color="crimson", s=55, depthshade=False)
		axis.text(
			point[0] * 1.12,
			point[1] * 1.12,
			point[2] * 1.12,
			name,
			color="crimson",
			fontsize=12,
			weight="bold",
		)

	axis.set_title("Labeled Octahedron: Euler's Formula")
	axis.set_xlabel("x")
	axis.set_ylabel("y")
	axis.set_zlabel("z")
	axis.set_xlim(-1.35, 1.35)
	axis.set_ylim(-1.35, 1.35)
	axis.set_zlim(-1.35, 1.35)
	axis.set_box_aspect((1, 1, 1))
	axis.view_init(elev=22, azim=35)

	vertices_count = len(vertices)
	edges_count = len(edges)
	faces_count = len(faces)
	figure.text(
		0.02,
		0.02,
		f"V = {vertices_count}, E = {edges_count}, F = {faces_count}    "
		f"V - E + F = {vertices_count - edges_count + faces_count}",
		fontsize=11,
	)
	plt.tight_layout()
	plt.show()


if __name__ == "__main__":
	plot_octahedron()
