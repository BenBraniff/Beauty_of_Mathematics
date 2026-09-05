import matplotlib.pyplot as plt
import numpy as np


# y = ax^2 + bx + c
a = 1
b = -1
c = -2

discriminant = b**2 - 4 * a * c
roots = tuple(sorted(((-b - np.sqrt(discriminant)) / (2 * a),
	(-b + np.sqrt(discriminant)) / (2 * a))))
vertex_x = -b / (2 * a)
vertex_y = a * vertex_x**2 + b * vertex_x + c
equation = f"y = {a:g}x^2 {b:+g}x {c:+g}"
generic_equation_latex = r"$ax^2 + bx + c = 0$"
equation_latex = rf"$y = {a:g}x^2 {b:+g}x {c:+g}$"
formula_latex = r"$x_{1,2} = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$"
root_values = tuple(a * root**2 + b * root + c for root in roots)

x = np.linspace(-4, 4, 400)
y = a * x**2 + b * x + c

plt.figure(figsize=(8, 5))
plt.plot(x, y, color="royalblue", linewidth=2, label=equation_latex)
plt.scatter(vertex_x, vertex_y, color="crimson", zorder=3, label=f"Vertex ({vertex_x:g}, {vertex_y:g})")
plt.scatter(roots, root_values, color="darkgreen", zorder=3, label="Roots")

plt.annotate(
	rf"$x_1 = ({roots[0]:g}, {root_values[0]:g})$",
	xy=(roots[0], root_values[0]),
	xytext=(-3.7, 0.45),
	fontsize=13,
	arrowprops={"arrowstyle": "->", "color": "darkgreen"},
)
plt.annotate(
	rf"$x_2 = ({roots[1]:g}, {root_values[1]:g})$",
	xy=(roots[1], root_values[1]),
	xytext=(1.1, 0.45),
	fontsize=13,
	arrowprops={"arrowstyle": "->", "color": "darkgreen"},
)

info_text = "\n".join(
	[
		rf"$a = {a}$, $b = {b}$, $c = {c}$",
		generic_equation_latex,
		equation_latex,
	]
)

plt.text(
	0.03,
	0.97,
	info_text,
	transform=plt.gca().transAxes,
	verticalalignment="top",
	bbox={"facecolor": "white", "alpha": 0.85, "edgecolor": "lightgray"},
)
plt.text(
	0.03,
	0.72,
	formula_latex,
	transform=plt.gca().transAxes,
	fontsize=16,
	bbox={"facecolor": "white", "alpha": 0.85, "edgecolor": "lightgray"},
)

plt.axhline(0, color="black", linewidth=0.8)
plt.axvline(0, color="black", linewidth=0.8)
plt.xlim(-4, 4)
plt.ylim(-3, 3)
plt.grid(True, linestyle="--", alpha=0.5)
plt.xlabel("x")
plt.ylabel("y")
plt.title("A Simple Quadratic Function")
plt.legend()
plt.tight_layout()

print(f"a = {a}, b = {b}, c = {c}")
print(f"Equation: {equation}")
for root in roots:
	print(f"Root: x = {root:g}")

plt.show()
