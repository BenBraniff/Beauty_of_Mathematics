"""A Tkinter Mandelbrot explorer with click-to-zoom and clean PNG export."""

from __future__ import annotations

import tkinter as tk
from pathlib import Path
from tkinter import messagebox, ttk

import matplotlib

matplotlib.use("TkAgg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
from matplotlib.colors import LinearSegmentedColormap, Normalize, hsv_to_rgb


IMAGE_WIDTH = 900
IMAGE_HEIGHT = 620
EXPORT_SIZE = 2400
INITIAL_CENTER = (-0.5, 0.0)
INITIAL_SCALE = 3.2


def calculate_fractal(
	center_x: float,
	center_y: float,
	scale: float,
	width: int = IMAGE_WIDTH,
	height: int = IMAGE_HEIGHT,
	max_iterations: int = 260,
	progress_callback=None,
) -> tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
	"""Return coordinates, smooth escape values, escape mask, and bounds."""
	half_width = scale / 2
	half_height = half_width * height / width
	real = np.linspace(center_x - half_width, center_x + half_width, width)
	imaginary = np.linspace(center_y - half_height, center_y + half_height, height)
	coordinates = real[None, :] + 1j * imaginary[:, None]
	values = np.zeros(coordinates.shape, dtype=float)
	escaped = np.zeros(coordinates.shape, dtype=bool)
	current = np.zeros(coordinates.shape, dtype=complex)

	for iteration in range(max_iterations):
		active = ~escaped
		current[active] = current[active] ** 2 + coordinates[active]
		magnitude = np.abs(current)
		newly_escaped = active & (magnitude > 2.0)
		if np.any(newly_escaped):
			values[newly_escaped] = iteration + 1 - np.log2(
				np.log2(magnitude[newly_escaped])
			)
			escaped[newly_escaped] = True
		if progress_callback is not None and (iteration % 8 == 0 or iteration == max_iterations - 1):
			progress_callback((iteration + 1) / max_iterations)
		if np.all(escaped):
			break

	return real, imaginary, values, escaped


def uncertainty_palette(zoom_depth: int, color_shift: float = 0.0) -> LinearSegmentedColormap:
	"""Create a zoom-aware uncertainty spectrum with an adjustable hue."""
	base_hues = (0.54, 0.46, 0.64)
	base_hue = (base_hues[zoom_depth % len(base_hues)] + color_shift) % 1.0
	colors = [
		hsv_to_rgb((base_hue, saturation, value))
		for saturation, value in ((0.08, 1.0), (0.58, 0.92), (0.82, 0.8), (0.9, 0.62), (0.78, 0.45))
	]
	return LinearSegmentedColormap.from_list("cool_uncertainty", colors)


class MandelbrotExplorer:
	"""Tkinter shell around the Mandelbrot canvas and side menu."""

	def __init__(self, root: tk.Tk) -> None:
		self.root = root
		self.root.title("Mandelbrot Explorer")
		self.root.geometry("1240x780")
		self.root.minsize(980, 650)
		self.root.configure(bg="#ffffff")
		self.center_x, self.center_y = INITIAL_CENTER
		self.scale = INITIAL_SCALE
		self.zoom_factor = 2.0
		self.color_shift = 0.0
		self.max_iterations = 260
		self.menu_visible = True

		self.root.columnconfigure(0, weight=1)
		self.root.rowconfigure(0, weight=1)
		self.plot_frame = tk.Frame(root, bg="#ffffff")
		self.plot_frame.grid(row=0, column=0, sticky="nsew")
		self.plot_frame.rowconfigure(0, weight=1)
		self.plot_frame.columnconfigure(0, weight=1)

		self.figure, self.axis = plt.subplots(figsize=(10, 7), facecolor="#ffffff")
		self.figure.subplots_adjust(left=0.08, right=0.98, bottom=0.08, top=0.9)
		self.axis.set_facecolor("#ffffff")
		self.axis.set_title("MANDELBROT / UNCERTAINTY FIELD", color="#16344a", fontsize=16, fontweight="bold", pad=14)
		self.canvas = FigureCanvasTkAgg(self.figure, master=self.plot_frame)
		self.canvas.get_tk_widget().grid(row=0, column=0, sticky="nsew")
		self.canvas.mpl_connect("button_press_event", self.on_canvas_click)
		self.hamburger = ttk.Button(self.plot_frame, text="MENU", command=self.toggle_menu)
		self.hamburger.place(relx=0.98, rely=0.02, anchor="ne")

		self.menu = tk.Frame(root, width=280, bg="#f5fbfe", highlightbackground="#8bb8ca", highlightthickness=1)
		self.menu.grid(row=0, column=1, sticky="ns", padx=(0, 18), pady=18)
		self.menu.grid_propagate(False)
		self.build_menu()
		self.render()

	def build_menu(self) -> None:
		self.menu.columnconfigure(0, weight=1)
		tk.Button(self.menu, text="<  HIDE MENU", command=self.toggle_menu).grid(row=0, column=0, sticky="ew", padx=18, pady=(18, 20))
		self.info = tk.Label(self.menu, text="", justify="left", anchor="w", bg="#f5fbfe", fg="#16344a", font=("Helvetica", 10), wraplength=230)
		self.info.grid(row=1, column=0, sticky="ew", padx=22, pady=(0, 18))
		tk.Label(self.menu, text="ZOOM FACTOR", background="#f5fbfe", foreground="#47758b").grid(row=2, column=0, sticky="w", padx=22)
		self.zoom_entry = ttk.Entry(self.menu, width=18)
		self.zoom_entry.insert(0, "2.0")
		self.zoom_entry.grid(row=3, column=0, sticky="ew", padx=22, pady=(5, 20))
		self.zoom_entry.bind("<Return>", self.apply_zoom)
		tk.Label(self.menu, text="COLOR SHIFT", background="#f5fbfe", foreground="#47758b").grid(row=4, column=0, sticky="w", padx=22)
		self.color_slider = ttk.Scale(self.menu, from_=0.0, to=1.0, orient="horizontal", command=self.change_color)
		self.color_slider.set(0.0)
		self.color_slider.grid(row=5, column=0, sticky="ew", padx=22, pady=(5, 20))
		tk.Button(self.menu, text="APPLY ZOOM", command=self.apply_zoom).grid(row=7, column=0, sticky="ew", padx=22, pady=4)
		tk.Button(self.menu, text="RESET VIEW", command=self.reset).grid(row=8, column=0, sticky="ew", padx=22, pady=4)
		tk.Button(self.menu, text="DOWNLOAD HIGH-RES PNG", command=self.download_image).grid(row=9, column=0, sticky="ew", padx=22, pady=(18, 4))
		tk.Label(self.menu, text="Double-click the image to zoom.\nRight-click opens this menu.\nBlack = convergent, color = divergent uncertainty.", background="#f5fbfe", foreground="#47758b", justify="left", wraplength=230).grid(row=10, column=0, sticky="w", padx=22, pady=(22, 0))

	def render(self, show_loading: bool = False) -> None:
		self.set_loading(show_loading, 0)
		zoom_depth = max(0, int(np.log2(INITIAL_SCALE / self.scale)))
		real, imaginary, values, escaped = calculate_fractal(
			self.center_x,
			self.center_y,
			self.scale,
			progress_callback=self.update_progress if show_loading else None,
		)
		detail = np.ma.masked_where(~escaped, np.clip(values / self.max_iterations, 0, 1))
		cmap = uncertainty_palette(zoom_depth, self.color_shift)
		cmap.set_bad("#000000")
		self.detail = detail
		if not hasattr(self, "image"):
			self.image = self.axis.imshow(detail, extent=(real[0], real[-1], imaginary[0], imaginary[-1]), origin="lower", cmap=cmap, norm=Normalize(0, 1), interpolation="bilinear", aspect="equal")
			self.axis.set_xlabel("real", color="#47758b")
			self.axis.set_ylabel("imaginary", color="#47758b")
			self.axis.tick_params(colors="#47758b")
		else:
			self.image.set_data(detail)
			self.image.set_extent((real[0], real[-1], imaginary[0], imaginary[-1]))
			self.image.set_cmap(cmap)
		self.axis.set_xlim(real[0], real[-1])
		self.axis.set_ylim(imaginary[0], imaginary[-1])
		self.info.config(text=f"MANDELBROT EXPLORER\n\nCENTER\n{self.center_x:.9f} {self.center_y:+.9f}i\n\nVIEW WIDTH\n{self.scale:.6g}\n\nBlack is convergent.\nCool colors show divergent uncertainty.")
		self.set_loading(False, 1)
		self.canvas.draw_idle()

	def set_loading(self, visible: bool, progress: float) -> None:
		if not visible:
			if hasattr(self, "progress_window"):
				self.progress_window.destroy()
			return
		if not hasattr(self, "progress_window") or not self.progress_window.winfo_exists():
			self.progress_window = tk.Toplevel(self.root)
			self.progress_window.title("Rendering")
			self.progress_window.transient(self.root)
			self.progress_window.resizable(False, False)
			tk.Label(self.progress_window, text="RENDERING MANDELBROT SET").pack(padx=28, pady=(20, 8))
			self.progress = ttk.Progressbar(self.progress_window, length=280, mode="determinate", maximum=100)
			self.progress.pack(padx=28, pady=(0, 20))
			self.progress_window.update_idletasks()
		self.progress["value"] = progress * 100
		self.progress_window.update()

	def update_progress(self, progress: float) -> None:
		self.set_loading(True, progress)

	def apply_zoom(self, _event: object = None) -> None:
		try:
			zoom_factor = float(self.zoom_entry.get())
			if zoom_factor <= 1:
				raise ValueError
		except ValueError:
			messagebox.showerror("Invalid zoom", "Enter a number greater than 1.", parent=self.root)
			return
		self.zoom_factor = zoom_factor
		self.scale /= zoom_factor
		self.render(show_loading=True)

	def change_color(self, value: str) -> None:
		"""Recolor the current detail without paying for another fractal render."""
		self.color_shift = float(value)
		if not hasattr(self, "image"):
			return
		cmap = uncertainty_palette(max(0, int(np.log2(INITIAL_SCALE / self.scale))), self.color_shift)
		cmap.set_bad("#000000")
		self.image.set_cmap(cmap)
		self.canvas.draw_idle()

	def on_canvas_click(self, event: object) -> None:
		if event.button == 3:
			self.menu_visible = True
			self.menu.grid()
			return
		if event.button != 1 or not event.dblclick or event.inaxes is not self.axis or event.xdata is None or event.ydata is None:
			return
		self.center_x, self.center_y = event.xdata, event.ydata
		self.scale /= self.zoom_factor
		self.render(show_loading=True)

	def toggle_menu(self) -> None:
		self.menu_visible = not self.menu_visible
		if self.menu_visible:
			self.menu.grid()
			self.hamburger.configure(text="MENU")
		else:
			self.menu.grid_remove()
			self.hamburger.configure(text="MENU +")

	def reset(self) -> None:
		self.center_x, self.center_y = INITIAL_CENTER
		self.scale = INITIAL_SCALE
		self.color_slider.set(0.0)
		self.zoom_entry.delete(0, tk.END)
		self.zoom_entry.insert(0, "2.0")
		self.render(show_loading=True)

	def download_image(self) -> None:
		"""Export a square, high-resolution view without the Tk menu."""
		output_path = Path.cwd() / "mandelbrot_high_resolution.png"
		zoom_depth = max(0, int(np.log2(INITIAL_SCALE / self.scale)))
		real, imaginary, values, escaped = calculate_fractal(
			self.center_x,
			self.center_y,
			self.scale,
			width=EXPORT_SIZE,
			height=EXPORT_SIZE,
			max_iterations=self.max_iterations,
		)
		detail = np.ma.masked_where(
			~escaped,
			np.clip(values / self.max_iterations, 0, 1),
		)
		cmap = uncertainty_palette(zoom_depth, self.color_shift)
		cmap.set_bad("#000000")
		clean_figure, clean_axis = plt.subplots(figsize=(10, 10), facecolor="white")
		clean_axis.imshow(
			detail,
			extent=(real[0], real[-1], imaginary[0], imaginary[-1]),
			origin="lower",
			cmap=cmap,
			norm=Normalize(0, 1),
			interpolation="bilinear",
			aspect="equal",
		)
		clean_axis.axis("off")
		clean_figure.savefig(output_path, dpi=300, facecolor="white", bbox_inches="tight", pad_inches=0)
		plt.close(clean_figure)
		messagebox.showinfo("Image saved", f"Saved:\n{output_path}", parent=self.root)


if __name__ == "__main__":
	root = tk.Tk()
	MandelbrotExplorer(root)
	root.mainloop()
