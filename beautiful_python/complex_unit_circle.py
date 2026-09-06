import matplotlib.pyplot as plt


figure, axis = plt.subplots(figsize=(8, 8))

circle = plt.Circle((0, 0), 1, fill=False, color="royalblue", linewidth=3)
axis.add_patch(circle)

axis.axhline(0, color="black", linewidth=1.5)
axis.axvline(0, color="black", linewidth=1.5)
axis.set_xlim(-1.35, 1.35)
axis.set_ylim(-1.35, 1.35)
axis.set_aspect("equal")

axis.set_xlabel("Real axis", fontsize=14)
axis.set_ylabel("Imaginary axis", fontsize=14)
axis.set_title("Unit Circle in the Complex Plane", fontsize=18, pad=16)

axis.text(1.08, 0.1, r"$1$", fontsize=28, fontweight="bold", math_fontfamily="stix", ha="center", va="center")
axis.text(0.12, 1.08, r"$i$", fontsize=28, fontweight="bold", math_fontfamily="stix", ha="center", va="center")
axis.text(-1.16, 0.1, r"$-1$", fontsize=28, fontweight="bold", math_fontfamily="stix", ha="center", va="center")
axis.text(0.12, -1.08, r"$-i$", fontsize=28, fontweight="bold", math_fontfamily="stix", ha="center", va="center")

axis.text(
	0.03,
	0.97,
	r"$z = \cos(\theta) + i*\sin(\theta)$",
	transform=axis.transAxes,
	fontsize=20,
	math_fontfamily="stix",
	ha="left",
	va="top",
)

axis.set_xticks([-1, 0, 1])
axis.set_yticks([-1, 0, 1])
axis.grid(True, linestyle="--", alpha=0.35)

plt.tight_layout()
plt.show()
