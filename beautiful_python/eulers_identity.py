"""Visualize Euler's formula on the complex plane.

Run with:
	python eulers_identity.py
"""

import numpy as np
import matplotlib.pyplot as plt


def make_chart() -> None:
	"""Draw Euler's formula at theta = 45 degrees."""
	theta = np.pi / 4
	circle_theta = np.linspace(0, 2 * np.pi, 240)
	circle_x = np.cos(circle_theta)
	circle_y = np.sin(circle_theta)
	x = np.cos(theta)
	y = np.sin(theta)

	figure, axis = plt.subplots(figsize=(8, 8))
	axis.set_aspect("equal", adjustable="box")
	axis.set_xlim(-1.35, 1.35)
	axis.set_ylim(-1.35, 1.35)
	axis.axhline(0, color="0.65", linewidth=1)
	axis.axvline(0, color="0.65", linewidth=1)
	axis.plot(circle_x, circle_y, color="#2b6cb0", linewidth=2, label="unit circle")
	axis.set_xlabel("Real part")
	axis.set_ylabel("Imaginary part")
	axis.set_title("Euler's Formula on the Complex Plane", fontsize=15, pad=14)
	axis.grid(alpha=0.25)

	axis.plot([0, x], [0, y], color="#d53f8c", linewidth=2.5, label=r"$e^{i\theta}$")
	axis.plot([0, x], [0, 0], color="#dd6b20", linewidth=2, label=r"$\cos\theta$")
	axis.plot([x, x], [0, y], color="#38a169", linewidth=2, label=r"$i\sin\theta$")
	axis.plot(x, y, "o", color="#805ad5", markersize=9)
	angle_theta = np.linspace(0, theta, 40)
	axis.plot(0.22 * np.cos(angle_theta), 0.22 * np.sin(angle_theta), color="#805ad5", linewidth=1.5)
	axis.text(
		0.02,
		0.97,
		r"$e^{i\pi/4} = \cos(45^\circ) + i\sin(45^\circ)$"
		"\n$= 0.707 + 0.707i$",
		transform=axis.transAxes,
		va="top",
		fontsize=18,
		bbox={"facecolor": "white", "alpha": 0.85, "edgecolor": "none"},
	)
	axis.legend(loc="lower left")
	return figure


if __name__ == "__main__":
	make_chart()
	plt.show()
