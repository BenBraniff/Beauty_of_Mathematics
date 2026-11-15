import { useEffect, useRef, useState } from "react";
import sandpileLogoAnimation from "./assets/sandpile-identity-cycle.gif";
import sandpileLogo from "./assets/sandpile-420x420.png";
import xTwitterIcon from "./assets/bxl-x-twitter.svg";
import mandelbrotImg from "./assets/mandelbrot_high_resolution.png";
import piConstantImg from "./assets/pi_constant_2.png";
import platonicSolidsImg from "./assets/Platonic_Solids.png";
import archimedeanSolidsImg from "./assets/ARCHIMEDEAN_SOLIDS.jpg";
import eConstantImg from "./assets/e_constant.png";
import goldenRatioConstantImg from "./assets/golden_ratio_constant.png";
import feigenbaumConstantImg from "./assets/Feigenbaums_constant.webp";
import imaginaryUnitConstantImg from "./assets/i_constant.png";
import plasticNumberImg from "./assets/plastic_number.webp";
import squareRootTwoConstantImg from "./assets/square_root_2_constant.png";
import universalParabolicConstantImg from "./assets/universal_parabolic_constant.webp";
import dragonCurveImg from "./assets/dragon_curve_12.png";
import einsteinTilesImg from "./assets/einstein_tiles_3.png";
import eulersIdentityImg from "./assets/eulers_Identity.png";
import pythagoreanImg from "./assets/a_square_b_square_c_square.webp";
import areaUnderCurveImg from "./assets/area_under_curve.webp";
import bellCurveImg from "./assets/bell_curve.webp";
import fourierTransformImg from "./assets/Fourier_Transform.webp";
import eulersFormulaImg from "./assets/eulers_formula.png";
import bayesTheoremImg from "./assets/bayes_theorem.webp";
import quadraticFormulaImg from "./assets/quadratic_formula.png";
import turbulentFlowImg from "./assets/turbulent_flow.webp";
import archimedesImg from "./assets/Archimedes.jpg";
import pascalImg from "./assets/Blaise_Pascal_Versailles.jpeg";
import gaussImg from "./assets/Carl_Friedrich_Gauss.jpg";
import fermatImg from "./assets/Fermat.jpeg";
import leibnizImg from "./assets/Leibniz.jpg";
import eulerImg from "./assets/Leonhard_Euler.jpg";
import descartesImg from "./assets/René_Descartes.jpg";
import newtonImg from "./assets/Sir_Isaac_Newton.jpg";
import ramanujanImg from "./assets/Srinivasa_Ramanujan.jpg";
import euclidImg from "./assets/euclid_2.webp";
import numberphileImg from "./assets/numberphile.jpg";
import threeBlueOneBrownImg from "./assets/3blue1brown.jpg";
import mathologerImg from "./assets/mathologer.jpg";
import veritasiumImg from "./assets/veritasium.jpg";
import vsauceImg from "./assets/vsauce.jpg";
import standUpMathsImg from "./assets/stand_up_maths.jpg";
import organicChemistryTutorImg from "./assets/organic_chemist.jpg";
import blackpenredpenImg from "./assets/blackpenredpen.jpg";
import kuvinaImg from "./assets/ Kuvina Saydaki.jpg";
import terenceTaoImg from "./assets/Terence Tao.jpg";
import theGrayCuberImg from "./assets/TheGrayCuber.jpg";
import grantSandersonImg from "./assets/Grant_Sanderson.jpg";
import moneyballImg from "./assets/Moneyball.webp";
import thinkLikeMathGeniusImg from "./assets/Think_like_a_math_genius.avif";
import profilePhotoImg from "./assets/profile_photo_square.png";
import goodWillHuntingImg from "./assets/Good_Will_Hunting.webp";
import hiddenFiguresImg from "./assets/Hidden Figures.webp";
import standAndDeliverImg from "./assets/stand_and_deliver.webp";
import octoberSkyImg from "./assets/october_sky.webp";
import theMartianImg from "./assets/the_martian.webp";
import aBeautifulMindImg from "./assets/a_beautiful_mind.webp";
import theImitationGameImg from "./assets/the_imitation_game.webp";
import manWhoKnewInfinityImg from "./assets/The_man_who_knew_infinity.webp";
import xPlusYImg from "./assets/x_plus_y.webp";
import theoryOfEverythingImg from "./assets/the_theory_of_everything.webp";
import surrealNumbersImg from "./assets/surreal_numbers.jpg";
import numberDevilImg from "./assets/the_number_devil.avif";
import infinitePowersImg from "./assets/infinite_powers.avif";
import joyOfXImg from "./assets/the_joy_of_x.avif";
import sixMathEssentialsImg from "./assets/Six_Math_Essentials.jpg";
import preAlgebraNotebookImg from "./assets/pre_algebra_albegra_everything_notebook.avif";
import humblePiImg from "./assets/Humble_Pi.jpg";
import manLovedNumbersImg from "./assets/The_Man_Who_Loved_Only_Numbers.avif";
import fermatEnigmaImg from "./assets/Fermats_Enigma.avif";
import codeBookImg from "./assets/the_code_book.avif";
import "boxicons/css/boxicons.min.css";
import katex from "katex";
import "katex/dist/katex.min.css";
import ConceptPage from "./pages/concepts/ConceptPage";
import "./App.css";

const pages = [
  { slug: "", label: "Top 10^2", shortLabel: "Top 10^2", number: "00" },
  {
    slug: "concepts",
    label: "Top 10 Math Concepts",
    shortLabel: "Concepts",
    number: "01",
  },
  {
    slug: "mathematicians",
    label: "Top 10 Mathematicians",
    shortLabel: "People",
    number: "02",
  },
  {
    slug: "youtubers",
    label: "Top 10 Math YouTubers",
    shortLabel: "Video",
    number: "03",
  },
  {
    slug: "movies",
    label: "Top 10 Math Movies",
    shortLabel: "Movies",
    number: "04",
  },
  {
    slug: "equations",
    label: "Top 10 Equations",
    shortLabel: "Equations",
    number: "05",
  },
  {
    slug: "books",
    label: "Top 10 Math Books",
    shortLabel: "Books",
    number: "06",
  },
  {
    slug: "constants",
    label: "Top 10 Constants",
    shortLabel: "Constants",
    number: "07",
  },
  {
    slug: "problems",
    label: "Top 10 Problems & Conjectures",
    shortLabel: "Problems",
    number: "08",
  },
  {
    slug: "resources",
    label: "Top 10 Math Resources",
    shortLabel: "Resources",
    number: "09",
  },
  {
    slug: "honorary",
    label: "Top 10 Honorary Mentions",
    shortLabel: "Honorable mentions",
    number: "10",
  },
];

const collections = {
  concepts: {
    title: "Top 10 Math Concepts",
    intro:
      "The ideas that changed how we describe patterns, space, chance, and change.",
    items: [
      {
        name: "Mandelbrot set",
        slug: "mandelbrot-set",
        image: mandelbrotImg,
        description:
          "A simple repeating rule creates an infinitely intricate boundary. The Mandelbrot set is a map of which complex numbers remain bounded when the rule is iterated.",
      },
      {
        name: "Golden Ratio (Fibonacci sequence)",
        slug: "golden-ratio",
        image: goldenRatioConstantImg,
        description:
          "The golden ratio appears when a line is divided so the whole relates to the larger part as the larger part relates to the smaller. Fibonacci numbers approach this ratio as they grow.",
      },
      {
        name: "Pascal's Triangle",
        slug: "pascals-triangle",
        image: pascalImg,
        description:
          "Each number is the sum of the two above it. The triangle quietly contains binomial coefficients, powers of two, and patterns of symmetry.",
      },
      {
        name: "Platonic Solids (plus Archimedean solids)",
        slug: "platonic-solids",
        image: platonicSolidsImg,
        images: [platonicSolidsImg, archimedeanSolidsImg],
        description:
          "Platonic solids are perfectly regular three-dimensional shapes. Their faces, edges, and vertices fit together with a rare and satisfying kind of symmetry.",
      },
      {
        name: "Fractals (Dragon curve)",
        slug: "fractals",
        image: dragonCurveImg,
        description:
          "Fractals repeat a pattern across scales, producing detail that echoes the whole. The Dragon curve is a striking example built from a simple folding process.",
      },
      {
        name: "Curves (Cycloid and Catenary)",
        slug: "curves",
        image: areaUnderCurveImg,
        description:
          "Different physical questions create different remarkable curves. A hanging chain forms a catenary, while a rolling circle traces a cycloid.",
      },
      {
        name: "Conic Sections",
        slug: "conic-sections",
        image: quadraticFormulaImg,
        description:
          "Cut a cone at different angles and you get circles, ellipses, parabolas, or hyperbolas. One geometric family explains many paths in nature and engineering.",
      },
      {
        name: "Spirograph",
        slug: "spirograph",
        image: goldenRatioConstantImg,
        description:
          "Spirographs turn rolling circles into intricate curves. A simple geometric motion creates looping patterns that reveal symmetry, rotation, and periodicity.",
      },
      {
        name: "Sandpiles",
        slug: "sandpiles",
        image: mandelbrotImg,
        description:
          "Sandpile models show how simple local rules can produce large-scale patterns. Grains accumulate, topple, and reorganize into structures with surprising order.",
      },
      {
        name: "Tiling",
        slug: "tiling",
        image: einsteinTilesImg,
        description:
          "Tiling covers a surface with shapes without gaps or overlaps. From repeating patterns to aperiodic designs, tilings reveal how geometry creates order across a plane.",
      },
    ],
  },
  mathematicians: {
    title: "Top 10 Mathematicians",
    intro:
      "Ten thinkers whose questions still shape the language of mathematics today.",
    items: [
      {
        name: "Leonhard Euler",
        image: eulerImg,
        dates: "1707–1783",
        origin: "Basel, Switzerland",
        knownFor: ["Euler's number", "Euler's identity", "Graph theory"],
        description:
          "A prolific Swiss mathematician whose work connected analysis, number theory, geometry, and mechanics. Euler introduced much of the notation still used in mathematics today.",
      },
      {
        name: "Carl Friedrich Gauss",
        image: gaussImg,
        dates: "1777–1855",
        origin: "Brunswick, Germany",
        knownFor: ["Number theory", "Gaussian distribution", "Least squares"],
        description:
          "A German mathematician often called the Prince of Mathematicians. His discoveries ranged from modular arithmetic and geometry to astronomy, statistics, and physics.",
      },
      {
        name: "Isaac Newton",
        image: newtonImg,
        dates: "1643–1727",
        origin: "Woolsthorpe, England",
        knownFor: ["Calculus", "Laws of motion", "Universal gravitation"],
        description:
          "An English mathematician and physicist who transformed the study of motion and the heavens. He developed calculus independently while building the foundations of classical mechanics.",
      },
      {
        name: "Archimedes",
        image: archimedesImg,
        dates: "c. 287–c. 212 BCE",
        origin: "Syracuse, Sicily",
        knownFor: ["Archimedes' principle", "Method of exhaustion", "Buoyancy"],
        description:
          "An ancient Greek mathematician, engineer, and inventor whose geometric methods anticipated ideas from calculus. He is remembered for solving practical problems with extraordinary mathematical precision.",
      },
      {
        name: "Euclid",
        image: euclidImg,
        dates: "c. 300 BCE",
        origin: "Alexandria, Egypt",
        knownFor: ["The Elements", "Euclidean geometry", "Prime numbers"],
        description:
          "A Greek mathematician whose Elements organized geometry and number theory into a system of definitions, axioms, and proofs. His approach shaped mathematical education for more than two millennia.",
      },
      {
        name: "Gottfried Wilhelm Leibniz",
        image: leibnizImg,
        dates: "1646–1716",
        origin: "Leipzig, Germany",
        knownFor: ["Calculus", "Integral notation", "Binary numbers"],
        description:
          "A German polymath who developed calculus independently of Newton and gave it much of its modern notation. He also made foundational contributions to logic, computation, and philosophy.",
      },
      {
        name: "Pierre de Fermat",
        image: fermatImg,
        dates: "1607–1665",
        origin: "Beaumont-de-Lomagne, France",
        knownFor: [
          "Fermat's Last Theorem",
          "Fermat's principle",
          "Probability",
        ],
        description:
          "A French mathematician and lawyer whose playful marginal notes led to deep advances in number theory. His correspondence with Pascal also helped establish the mathematics of probability.",
      },
      {
        name: "René Descartes",
        image: descartesImg,
        dates: "1596–1650",
        origin: "La Haye en Touraine, France",
        knownFor: [
          "Cartesian coordinates",
          "Analytic geometry",
          "Descartes' rule",
        ],
        description:
          "A French philosopher and mathematician who joined algebra to geometry through the coordinate plane. This partnership created analytic geometry and changed how shapes could be studied.",
      },
      {
        name: "Blaise Pascal",
        image: pascalImg,
        dates: "1623–1662",
        origin: "Clermont-Ferrand, France",
        knownFor: ["Pascal's triangle", "Probability theory", "Pascal's law"],
        description:
          "A French mathematician, physicist, and inventor who made influential contributions while still young. His work linked combinatorics and chance, and his studies of pressure shaped fluid mechanics.",
      },
      {
        name: "Srinivasa Ramanujan",
        image: ramanujanImg,
        dates: "1887–1920",
        origin: "Erode, India",
        knownFor: ["Number theory", "Infinite series", "Partition function"],
        description:
          "An Indian mathematician whose extraordinary intuition revealed surprising identities in number theory. Working with G. H. Hardy, he produced results that continue to inspire modern mathematics.",
      },
    ],
  },
  youtubers: {
    title: "Top 10 Math YouTubers",
    intro:
      "Channels that make difficult ideas feel visual, surprising, and worth chasing.",
    items: [
      {
        name: "Numberphile",
        image: numberphileImg,
        link: "https://www.youtube.com/@numberphile",
        description:
          "A playful, interview-driven channel exploring curious numbers, puzzles, proofs, and the people who love them.",
      },
      {
        name: "3Blue1Brown",
        image: threeBlueOneBrownImg,
        link: "https://www.youtube.com/@3blue1brown",
        description:
          "Animated visual explanations that build intuition for linear algebra, calculus, probability, and other deep ideas.",
      },
      {
        name: "Mathologer",
        image: mathologerImg,
        link: "https://www.youtube.com/@Mathologer",
        description:
          "Long-form mathematical explorations that uncover surprising patterns, elegant proofs, and beautiful connections.",
      },
      {
        name: "Veritasium",
        image: veritasiumImg,
        link: "https://www.youtube.com/@veritasium",
        description:
          "Science and mathematics stories that challenge intuition through experiments, explanations, and unexpected questions.",
      },
      {
        name: "Vsauce",
        image: vsauceImg,
        link: "https://www.youtube.com/@Vsauce",
        description:
          "Thought-provoking investigations into mathematics, science, philosophy, perception, and the strange edges of everyday life.",
      },
      {
        name: "Stand-up Maths",
        image: standUpMathsImg,
        link: "https://www.youtube.com/@standupmaths",
        description:
          "Matt Parker turns recreational mathematics, puzzles, errors, and real-world patterns into sharp, funny lessons.",
      },
      {
        name: "The Organic Chemistry Tutor",
        image: organicChemistryTutorImg,
        link: "https://www.youtube.com/@TheOrganicChemistryTutor",
        description:
          "Clear, step-by-step tutorials covering algebra, geometry, trigonometry, calculus, statistics, and chemistry.",
      },
      {
        name: "blackpenredpen",
        image: blackpenredpenImg,
        link: "https://www.youtube.com/@blackpenredpen",
        description:
          "Detailed problem-solving sessions focused on calculus, algebra, equations, and the craft of working through a solution.",
      },
      {
        name: "Kuvina Saydaki",
        image: kuvinaImg,
        link: "https://www.youtube.com/@Kuvina",
        description:
          "A channel sharing accessible mathematical ideas, visual explanations, and thoughtful explorations of problem solving.",
      },
      {
        name: "TheGrayCuber",
        image: theGrayCuberImg,
        link: "https://www.youtube.com/@TheGrayCuber",
        description:
          "A math-focused creator sharing engaging explorations of mathematical ideas, patterns, and puzzles.",
      },
    ],
  },
  movies: {
    title: "Top 10 Math Movies",
    intro:
      "Stories about genius, obsession, discovery, and the beautiful mess of being human.",
    items: [
      {
        name: "Good Will Hunting",
        image: goodWillHuntingImg,
        releaseDate: "1997",
        duration: "2h 6m",
        keyActors: ["Matt Damon", "Robin Williams", "Ben Affleck"],
        description:
          "A troubled young janitor with an extraordinary gift for mathematics finds an unlikely mentor who helps him face the fear and possibility behind his talent.",
      },
      {
        name: "Hidden Figures",
        image: hiddenFiguresImg,
        releaseDate: "2016",
        duration: "2h 7m",
        keyActors: ["Taraji P. Henson", "Octavia Spencer", "Janelle Monáe"],
        description:
          "Three brilliant Black women at NASA become essential to the space race, using mathematics, engineering, and persistence to break through institutional barriers.",
      },
      {
        name: "Stand and Deliver",
        image: standAndDeliverImg,
        releaseDate: "1988",
        duration: "1h 43m",
        keyActors: [
          "Edward James Olmos",
          "Lou Diamond Phillips",
          "Rosana DeSoto",
        ],
        description:
          "Inspired by a true story, a determined teacher pushes his East Los Angeles students toward advanced calculus and a new belief in what they can achieve.",
      },
      {
        name: "October Sky",
        image: octoberSkyImg,
        releaseDate: "1999",
        duration: "1h 48m",
        keyActors: ["Jake Gyllenhaal", "Chris Cooper", "Laura Dern"],
        description:
          "After watching Sputnik cross the sky, a coal miner's son turns to science, mathematics, and rocketry to build a different future for himself and his friends.",
      },
      {
        name: "The Martian",
        image: theMartianImg,
        releaseDate: "2015",
        duration: "2h 24m",
        keyActors: ["Matt Damon", "Jessica Chastain", "Chiwetel Ejiofor"],
        description:
          "Stranded alone on Mars, an astronaut uses botany, engineering, and relentless mathematical problem-solving to survive long enough for NASA to bring him home.",
      },
      {
        name: "A Beautiful Mind",
        image: aBeautifulMindImg,
        releaseDate: "2001",
        duration: "2h 15m",
        keyActors: ["Russell Crowe", "Jennifer Connelly", "Ed Harris"],
        description:
          "A gifted mathematician pursues an original idea in game theory while navigating the devastating effects of schizophrenia and the steady support of the people around him.",
      },
      {
        name: "The Imitation Game",
        image: theImitationGameImg,
        releaseDate: "2014",
        duration: "1h 54m",
        keyActors: ["Benedict Cumberbatch", "Keira Knightley", "Matthew Goode"],
        description:
          "Alan Turing and his team race to crack the German Enigma code, transforming abstract logic and early computing into a weapon that could change the course of war.",
      },
      {
        name: "The Man Who Knew Infinity",
        image: manWhoKnewInfinityImg,
        releaseDate: "2015",
        duration: "1h 48m",
        keyActors: ["Dev Patel", "Jeremy Irons", "Devika Bhise"],
        description:
          "Srinivasa Ramanujan travels from India to Cambridge, where his extraordinary mathematical intuition finds both a champion and a formidable academic world to challenge.",
      },
      {
        name: "X+Y",
        image: xPlusYImg,
        releaseDate: "2014",
        duration: "1h 51m",
        keyActors: ["Asa Butterfield", "Rafe Spall", "Sally Hawkins"],
        description:
          "A gifted teenager finds friendship, confidence, and a wider world through the international mathematics olympiad, even as competition tests his carefully ordered life.",
      },
      {
        name: "The Theory of Everything",
        image: theoryOfEverythingImg,
        releaseDate: "2014",
        duration: "2h 3m",
        keyActors: ["Eddie Redmayne", "Felicity Jones", "Charlie Cox"],
        description:
          "Stephen Hawking's early career, groundbreaking cosmological work, and relationship with Jane Wilde are portrayed against the progression of motor neurone disease.",
      },
    ],
  },
  resources: {
    title: "Top 10 Math Resources",
    resourceList: true,
    textDetails: true,
    intro:
      "A hand-picked shelf of places to learn, practice, visualize, and go further.",
    items: [
      {
        name: "Khan Academy",
        link: "https://www.khanacademy.org/",
        description:
          "Free lessons and practice covering math from arithmetic through advanced topics.",
      },
      {
        name: "Desmos",
        link: "https://www.desmos.com/calculator",
        description:
          "An interactive graphing calculator for plotting functions and exploring equations.",
      },
      {
        name: "GeoGebra",
        link: "https://www.geogebra.org/calculator",
        description:
          "Interactive tools for exploring graphing, geometry, algebra, and 3D mathematics.",
      },
      {
        name: "Excalidraw",
        link: "https://excalidraw.com/",
        description:
          "A collaborative whiteboard for sketching diagrams and visualizing mathematical ideas.",
      },
      {
        name: "Wolfram Alpha",
        link: "https://www.wolframalpha.com/",
        description:
          "A computational knowledge engine for answering questions and solving mathematical problems.",
      },
      {
        name: "OEIS",
        link: "https://oeis.org/",
        description:
          "A searchable encyclopedia of integer sequences, with formulas, references, and related sequences.",
      },
      {
        name: "Figma",
        link: "https://www.figma.com/",
        description:
          "A collaborative design tool for creating diagrams and visuals to explain mathematical ideas.",
      },
      {
        name: "NIST Digital Library of Mathematical Functions",
        link: "https://dlmf.nist.gov/",
        description:
          "A detailed reference for mathematical functions, identities, formulas, and numerical methods.",
      },
      {
        name: "MIT OpenCourseWare",
        link: "https://ocw.mit.edu/",
        description:
          "Free access to MIT course materials, including lecture notes, problem sets, and math courses.",
      },
      {
        name: "Cut the Knot",
        link: "https://www.cut-the-knot.org/",
        description:
          "Interactive puzzles, proofs, and visual explanations that make mathematical ideas engaging.",
      },
    ],
  },
  equations: {
    title: "Top 10 Equations",
    intro:
      "Equations that reveal surprising connections between the abstract and the real.",
    items: [
      {
        name: "Euler's Identity",
        image: eulersIdentityImg,
        equation: String.raw`e^{i\pi} + 1 = 0`,
        description:
          "Often described as the most beautiful formula in mathematics, it links five fundamental constants (π, e, i, 1, and 0) using addition, multiplication, and exponentiation in a single equation.",
      },
      {
        name: "Pythagorean Theorem",
        image: pythagoreanImg,
        equation: String.raw`a^2 + b^2 = c^2`,
        description:
          "The fundamental geometric relation connecting the side lengths of a right triangle. It forms the foundation of Euclidean geometry, trigonometry, and distance calculations in coordinate space.",
      },
      {
        name: "Fundamental Theorem of Calculus",
        image: areaUnderCurveImg,
        equation: String.raw`\int_a^b f(x)\,dx = F(b) - F(a)`,
        description:
          "Bridges the two major branches of calculus by establishing that differentiation and integration are inverse operations, providing a method to calculate precise areas under continuous curves.",
      },
      {
        name: "Normal Distribution Formula (Bell Curve)",
        image: bellCurveImg,
        equation: String.raw`f(x) = \frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{1}{2}\left(\frac{x - \mu}{\sigma}\right)^2}`,
        description:
          "The mathematical expression behind the Gaussian distribution. It models how continuous random variables cluster around a mean (μ) in fields ranging from quantum mechanics to sociology.",
      },
      {
        name: "Fourier Transform",
        image: fourierTransformImg,
        equation: String.raw`\hat{f}(\xi) = \int_{-\infty}^{\infty} f(x)\,e^{-2\pi i x \xi}\,dx`,
        description:
          "Decomposes functions or time-dependent signals into their individual constituent frequencies. It serves as a cornerstone of modern digital communication, signal processing, and image compression.",
      },
      {
        name: "Euler's Formula for Planar Graphs",
        image: eulersFormulaImg,
        equation: String.raw`V - E + F = 2`,
        description:
          "Relates the number of vertices (V), edges (E), and faces (F) of any convex polyhedron or planar graph. It established the foundation of modern topology.",
      },
      {
        name: "Mandelbrot Set Iteration",
        image: mandelbrotImg,
        equation: String.raw`z_{n+1} = z_n^2 + c`,
        description:
          "A simple recursive equation using complex numbers that generates an infinitely detailed, self-similar fractal pattern containing infinite visual complexity.",
      },
      {
        name: "Bayes' Theorem",
        image: bayesTheoremImg,
        equation: String.raw`P(A \mid B) = \frac{P(B \mid A)P(A)}{P(B)}`,
        description:
          "Formulates how to update the probability of a hypothesis (A) as new evidence (B) becomes available. It forms the foundation of modern statistical inference, machine learning, and decision theories.",
      },
      {
        name: "The Quadratic Formula",
        image: quadraticFormulaImg,
        equation: String.raw`x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}`,
        description:
          "Provides the exact solutions to any quadratic equation ax² + bx + c = 0. It is a core algebraic tool taught worldwide for finding roots of polynomial functions.",
      },
      {
        name: "Navier-Stokes Equations",
        image: turbulentFlowImg,
        equation: String.raw`\rho\left(\frac{\partial \mathbf{u}}{\partial t} + \mathbf{u} \cdot \nabla \mathbf{u}\right) = -\nabla p + \mu\nabla^2\mathbf{u} + \mathbf{f}`,
        description:
          "Describes the motion of viscous fluid substances, such as air and water. It forms the basis of weather prediction, ocean current modeling, and aerospace engineering.",
      },
    ],
  },
  books: {
    title: "Top 10 Math Books",
    intro:
      "Books that invite us to understand mathematics, its history, and its strange beauty.",
    items: [
      {
        book: true,
        name: "Surreal Numbers",
        image: surrealNumbersImg,
        author: "Donald E. Knuth",
        releaseDate: "1974",
        pages: "119 pages",
        link: "https://www.amazon.com/Surreal-Numbers-Donald-Knuth/dp/0201038129",
        description:
          "A mathematical novelette in dialogue form, introducing Conway's surreal numbers and the playful ideas behind a number system that includes infinite and infinitesimal values.",
      },
      {
        book: true,
        name: "Infinite Powers",
        image: infinitePowersImg,
        author: "Steven Strogatz",
        releaseDate: "April 14, 2020",
        pages: "400 pages",
        link: "https://www.amazon.com/dp/0358299284/",
        description:
          "A lively history of calculus that connects infinity and change to the practical tools behind GPS, phones, medicine, physics, and our understanding of the universe.",
      },
      {
        book: true,
        name: "The Joy of X",
        image: joyOfXImg,
        author: "Steven H. Strogatz",
        releaseDate: "October 1, 2013",
        pages: "336 pages",
        link: "https://www.amazon.com/dp/0544105850/",
        description:
          "An inviting tour through numbers, algebra, geometry, calculus, probability, and infinity, showing how mathematical ideas illuminate ordinary life.",
      },
      {
        book: true,
        name: "Six Math Essentials",
        image: sixMathEssentialsImg,
        author: "Terence Tao",
        link: "https://www.amazon.com/dp/0374621799/",
        description:
          "An accessible exploration of six essential mathematical ideas from mathematician Terence Tao.",
      },
      {
        book: true,
        name: "Big Fat Pre-Algebra & Algebra 1",
        image: preAlgebraNotebookImg,
        author: "Workman Publishing and Jason Wang",
        releaseDate: "October 5, 2021",
        pages: "640 pages",
        link: "https://www.amazon.com/dp/1523504382/",
        description:
          "A visual, approachable study guide covering number systems, equations, functions, graphing, roots, polynomials, quadratics, and more with examples and memory aids.",
      },
      {
        book: true,
        name: "The Number Devil",
        image: numberDevilImg,
        author: "Hans Magnus Enzensberger",
        releaseDate: "1997",
        pages: "261 pages",
        link: "https://www.amazon.com/dp/0805062998/",
        description:
          "In twelve dreamlike encounters, a boy who dislikes math meets a Number Devil and discovers the playful power of primes, infinity, Fibonacci numbers, and patterns.",
      },
      {
        book: true,
        name: "Humble Pi: When Math Goes Wrong in the Real World",
        image: humblePiImg,
        author: "Matt Parker",
        link: "https://www.amazon.com/dp/0593084691/",
        description:
          "A witty look at real-world mathematical mistakes and the surprising consequences they can have.",
      },
      {
        book: true,
        name: "The Man Who Loved Only Numbers",
        image: manLovedNumbersImg,
        author: "Paul Hoffman",
        releaseDate: "January 1, 1998",
        pages: "352 pages",
        link: "https://www.amazon.com/dp/0786884061/",
        description:
          "A vivid biography of the eccentric, prolific mathematician Paul Erdos and the collaborative, wandering life he devoted to discovering mathematical truth.",
      },
      {
        book: true,
        name: "Fermat's Enigma",
        image: fermatEnigmaImg,
        author: "Simon Singh",
        releaseDate: "September 8, 1998",
        pages: "315 pages",
        link: "https://www.amazon.com/dp/0385493622/",
        description:
          "The centuries-long pursuit of Fermat's Last Theorem, told as a human drama of ideas, setbacks, obsession, and Andrew Wiles's eventual proof.",
      },
      {
        book: true,
        name: "The Code Book",
        image: codeBookImg,
        author: "Simon Singh",
        releaseDate: "August 29, 2000",
        pages: "432 pages",
        link: "https://www.amazon.com/dp/0385495323/",
        description:
          "A compelling history of cryptography, from ancient ciphers and wartime codebreaking to public-key encryption and the future of secure communication.",
      },
    ],
  },
  problems: {
    title: "Top 10 Problems & Conjectures",
    intro:
      "The great unanswered questions that keep mathematicians searching for new ideas. Several are Millennium Prize Problems; see the Clay Mathematics Institute's list.",
    introLink: {
      label: "Millennium Prize Problems",
      url: "https://www.claymath.org/millennium-problems/",
    },
    problemList: true,
    textDetails: true,
    items: [
      {
        name: "Riemann hypothesis",
        description:
          "A Millennium Prize Problem conjecturing that every nontrivial zero of the Riemann zeta function has real part 1/2. It is closely connected to the distribution of prime numbers.",
        link: "https://en.wikipedia.org/wiki/Riemann_hypothesis",
      },
      {
        name: "P versus NP",
        description:
          "A Millennium Prize Problem asking whether every problem whose solution can be checked efficiently can also be solved efficiently.",
        link: "https://en.wikipedia.org/wiki/P_versus_NP_problem",
      },
      {
        name: "Birch and Swinnerton-Dyer conjecture",
        description:
          "A Millennium Prize Problem connecting the number of rational points on an elliptic curve to the behavior of its L-function at 1.",
        link: "https://en.wikipedia.org/wiki/Birch_and_Swinnerton-Dyer_conjecture",
      },
      {
        name: "Hodge conjecture",
        description:
          "A Millennium Prize Problem asking whether certain cohomology classes on a nonsingular projective algebraic variety come from algebraic cycles.",
        link: "https://en.wikipedia.org/wiki/Hodge_conjecture",
      },
      {
        name: "Navier-Stokes existence and smoothness",
        description:
          "A Millennium Prize Problem about whether smooth solutions to the three-dimensional Navier-Stokes equations always remain smooth. OpenAI announced a proof in 2026; see its article for the claim and formalized proof.",
        link: "https://en.wikipedia.org/wiki/Navier%E2%80%93Stokes_existence_and_smoothness",
        openAiLink: "https://openai.com/index/navier-stokes-solution/",
      },
      {
        name: "Yang-Mills existence and mass gap",
        description:
          "A Millennium Prize Problem asking for a rigorous mathematical foundation for quantum Yang-Mills theory and proof that it has a positive mass gap.",
        link: "https://en.wikipedia.org/wiki/Yang%E2%80%93Mills_existence_and_mass_gap",
      },
      {
        name: "Goldbach's conjecture",
        description:
          "The conjecture that every even integer greater than 2 can be written as the sum of two prime numbers.",
        link: "https://en.wikipedia.org/wiki/Goldbach%27s_conjecture",
      },
      {
        name: "Twin prime conjecture",
        description:
          "The conjecture that there are infinitely many pairs of primes that differ by 2, such as 11 and 13.",
        link: "https://en.wikipedia.org/wiki/Twin_prime",
      },
      {
        name: "Collatz conjecture",
        description:
          "Starting with any positive integer, repeatedly halve it if it is even or replace it with 3n + 1 if it is odd. The conjecture says this process always reaches 1.",
        link: "https://en.wikipedia.org/wiki/Collatz_conjecture",
      },
      {
        name: "Legendre's conjecture",
        description:
          "The conjecture that for every positive integer n, there is at least one prime between n squared and (n + 1) squared.",
        link: "https://en.wikipedia.org/wiki/Legendre%27s_conjecture",
      },
    ],
  },
  constants: {
    title: "Top 10 Constants",
    intro:
      "Special numbers that appear again and again across mathematics and the sciences.",
    items: [
      {
        name: "Pi (π)",
        image: piConstantImg,
        approximation: String.raw`\pi \approx 3.14159265`,
        equation: String.raw`\pi = 4\sum_{n=0}^{\infty} \frac{(-1)^n}{2n+1}`,
        description:
          "The ratio of a circle's circumference to its diameter. Pi appears throughout geometry, trigonometry, probability, and physics.",
      },
      {
        name: "Euler's number (e)",
        image: eConstantImg,
        approximation: String.raw`e \approx 2.71828182`,
        equation: String.raw`e = \sum_{n=0}^{\infty} \frac{1}{n!}`,
        description:
          "The natural base for continuous growth and change, e connects compound interest, calculus, probability, and differential equations.",
      },
      {
        name: "The golden ratio (φ)",
        image: goldenRatioConstantImg,
        approximation: String.raw`\varphi \approx 1.61803399`,
        equation: String.raw`\boldsymbol{\varphi = 1 + \cfrac{1}{1 + \cfrac{1}{1 + \cfrac{1}{\ddots}}} = \frac{1 + \sqrt{5}}{2}}`,
        description:
          "A proportion in which the whole relates to the larger part as the larger part relates to the smaller. It links geometry, Fibonacci numbers, and continued fractions.",
      },
      {
        name: "The imaginary unit (i)",
        image: imaginaryUnitConstantImg,
        approximation: String.raw`i = \sqrt{-1}`,
        description:
          "The imaginary unit extends the real numbers so equations such as x² + 1 = 0 have solutions. It is the foundation of complex numbers and much of modern signal analysis.",
      },
      {
        name: "The square root of 2",
        image: squareRootTwoConstantImg,
        approximation: String.raw`\sqrt{2} \approx 1.41421356`,
        equation: String.raw`\boldsymbol{\sqrt{2} = 1 + \cfrac{1}{2 + \cfrac{1}{2 + \cfrac{1}{\ddots}}}}`,
        description:
          "The diagonal of a unit square has length √2. Its irrationality was an early sign that the number line is richer than the rational numbers.",
      },
      {
        name: "Apéry's constant (ζ(3))",
        noImage: true,
        approximation: String.raw`\zeta(3) \approx 1.20205690`,
        equation: String.raw`\boldsymbol{\zeta(3) = \sum_{n=1}^{\infty} \frac{1}{n^3}}`,
        description:
          "A special value of the Riemann zeta function. Apéry's constant appears in number theory and in calculations involving three-dimensional lattices.",
      },
      {
        name: "The Euler-Mascheroni constant (γ)",
        noImage: true,
        approximation: String.raw`\gamma \approx 0.57721566`,
        equation: String.raw`\boldsymbol{\gamma = \lim_{n \to \infty} \left(\sum_{k=1}^{n} \frac{1}{k} - \ln n\right)}`,
        description:
          "The limiting difference between the harmonic series and the natural logarithm. It connects elementary sums with asymptotic analysis.",
      },
      {
        name: "The Feigenbaum constant (δ)",
        image: feigenbaumConstantImg,
        approximation: String.raw`\delta \approx 4.66920160`,
        equation: String.raw`\boldsymbol{\delta = \lim_{n \to \infty} \frac{r_{n-1} - r_{n-2}}{r_n - r_{n-1}}}`,
        description:
          "A universal number that describes how period-doubling cascades approach chaos in many different dynamical systems.",
      },
      {
        name: "The plastic number (ρ)",
        image: plasticNumberImg,
        approximation: String.raw`\rho \approx 1.32471795`,
        equation: String.raw`\boldsymbol{\rho^3 = \rho + 1}`,
        description:
          "The unique real solution of x³ = x + 1. The plastic number appears in recurrence sequences, architecture, and some self-similar designs.",
      },
      {
        name: "The universal parabolic constant (P)",
        image: universalParabolicConstantImg,
        approximation: String.raw`P \approx 2.29558714`,
        description:
          "A constant defined by the arc length of a particular parabola. It provides a bridge between the geometry of curves and the constants of classical analysis.",
      },
    ],
  },
  honorary: {
    title: "Top 10 Honorary Mentions",
    intro:
      "A bonus pick from every part of this collection, from mathematical ideas to the person behind this site.",
    noFallbackImages: true,
    items: [
      {
        name: "Honorary Concept",
        articleSlug: "monty-hall-problem",
        detailsTitle: "The Monty Hall Problem",
        articleDescription:
          "A famous probability puzzle about three doors, a hidden prize, and whether switching your choice improves your odds.",
      },
      {
        name: "Honorary Mathematician",
        detailsTitle: "Terence Tao",
        image: terenceTaoImg,
        dates: "Born 1975",
        knownFor: ["Number theory", "Analysis", "Combinatorics"],
        description:
          "A mathematician whose wide-ranging work and clear explanations have made him an inspiring figure across many areas of mathematics.",
      },
      {
        name: "Honorary YouTuber",
        detailsTitle: "Grant Sanderson",
        image: grantSandersonImg,
        link: "https://www.youtube.com/@GrantSanderson",
        linkLabel: "Visit channel",
        description:
          "The creator of 3Blue1Brown, known for visual explanations that build intuition for beautiful and powerful mathematical ideas.",
      },
      {
        name: "Honorary Math Movie",
        detailsTitle: "Moneyball (2011)",
        image: moneyballImg,
        releaseDate: "2011",
        duration: "2h 13m",
        keyActors: [
          "Brad Pitt",
          "Jonah Hill",
          "Philip Seymour Hoffman",
          "Robin Wright",
          "Chris Pratt",
        ],
        description:
          "A data-driven baseball story about using statistical analysis to find value where conventional scouting sees little.",
      },
      {
        name: "Honorary Math Resource",
        detailsTitle: "Mathigon",
        link: "https://mathigon.org/",
        linkLabel: "Visit resource",
        description:
          "An interactive mathematics learning platform with visual lessons, explorations, and activities.",
      },
      {
        name: "Honorary Equation",
        detailsTitle: "Einstein's Mass–Energy Equivalence",
        equation: String.raw`E = mc^2`,
        description:
          "This equation states that mass and energy are equivalent: an object's mass corresponds to an amount of energy equal to its mass multiplied by the speed of light squared.",
      },
      {
        name: "Honorary Math Book",
        detailsTitle: "Think Like a Maths Genius",
        book: true,
        image: thinkLikeMathGeniusImg,
        author: "Arthur Benjamin and Michael Shermer",
        releaseDate: "October 19, 2006",
        pages: "304 pages",
        link: "https://www.amazon.com/dp/0285637762/",
        description:
          "A practical collection of mental calculation methods, memory techniques, and everyday number tricks designed to make arithmetic faster and more intuitive.",
      },
      {
        name: "Honorary Unsolved Problem & Conjecture",
        detailsTitle: "Beal's Conjecture",
        link: "https://en.wikipedia.org/wiki/Beal%27s_conjecture",
        linkLabel: "Read on Wikipedia",
        description:
          "If A^x + B^y = C^z for positive integers A, B, C and exponents x, y, z greater than 2, then A, B, and C must share a common prime factor. The conjecture remains open.",
      },
      {
        name: "Honorary Fundamental Mathematical Constant",
        detailsTitle: "Catalan's Constant",
        approximation: String.raw`G \approx 0.915965594`,
        equation: String.raw`G = \sum_{n=0}^{\infty} \frac{(-1)^n}{(2n+1)^2}`,
        description:
          "The value of the Dirichlet beta function at 2, also given by this alternating sum of reciprocal odd squares. It appears in combinatorics, number theory, and mathematical analysis.",
      },
      {
        name: "Honorary Honorary Mention: ME",
        detailsTitle: "Benjamin Braniff",
        image: profilePhotoImg,
        link: "https://benbraniff.github.io/",
        linkLabel: "Visit website",
        description:
          "The creator of Beauty of Mathematics. This spot is reserved for me.",
      },
    ],
  },
};

const imageSources = [
  ...new Set([
    mandelbrotImg,
    ...Object.values(collections)
      .flatMap(({ items }) => items)
      .filter((item) => typeof item === "object" && item.image)
      .map((item) => item.image),
  ]),
];

function getPage() {
  return window.location.hash.replace(/^#\/?/, "");
}

function App() {
  const [currentPage, setCurrentPage] = useState(getPage());
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoAnimationComplete, setLogoAnimationComplete] = useState(false);
  const logoAnimationTimerRef = useRef(null);

  useEffect(() => () => {
    if (logoAnimationTimerRef.current) {
      window.clearTimeout(logoAnimationTimerRef.current);
    }
  }, []);

  const finishLogoAnimation = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLogoAnimationComplete(true);
      return;
    }
    logoAnimationTimerRef.current = window.setTimeout(
      () => setLogoAnimationComplete(true),
      5000,
    );
  };

  useEffect(() => {
    imageSources.forEach((source) => {
      const image = new Image();
      image.src = source;
    });
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      setCurrentPage(getPage());
      setMenuOpen(false);
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;

      if (currentPage.startsWith("honorary/")) {
        window.location.hash = "honorary";
      } else if (currentPage.startsWith("concepts/")) {
        window.location.hash = "concepts";
      } else if (currentPage) {
        window.location.hash = "";
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [currentPage]);

  const selectedPage =
    pages.find((page) => page.slug === currentPage.split("/")[0]) ?? pages[0];
  const conceptPageSlug = currentPage.split("/")[0];
  const conceptSlug = ["concepts", "honorary"].includes(conceptPageSlug)
    ? currentPage.slice(`${conceptPageSlug}/`.length)
    : null;
  const conceptItem =
    collections.concepts.items.find(
    (item) => item.slug === conceptSlug,
    ) ??
    (conceptPageSlug === "honorary"
      ? (() => {
          const item = collections.honorary.items.find(
            (honoraryItem) => honoraryItem.articleSlug === conceptSlug,
          );
          return item
            ? {
                name: item.detailsTitle,
                slug: item.articleSlug,
                description: item.articleDescription,
                breadcrumbLabel: collections.honorary.title,
                breadcrumbHref: "#honorary",
              }
            : null;
        })()
      : null);

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#" aria-label="Beauty of Mathematics home">
          <img
            className="brand-logo"
            src={logoAnimationComplete ? sandpileLogo : sandpileLogoAnimation}
            alt=""
            onLoad={logoAnimationComplete ? undefined : finishLogoAnimation}
          />
          <span className="brand-name">
            <span>
              Beauty of
              <br />
              <strong>Mathematics</strong>
            </span>
            <small>By: Benjamin Braniff</small>
          </span>
        </a>
        <div className="header-tools">
          <span className="current-section">{selectedPage.shortLabel}</span>
          <button
            className="menu-button"
            type="button"
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        {menuOpen && (
          <nav className="menu" aria-label="Main navigation">
            <p className="menu-kicker">Explore the collection</p>
            {pages.map((page) => (
              <a
                className={[
                  selectedPage.slug === page.slug ? "active" : "",
                  page.slug === "" ? "menu-parent" : "menu-child",
                ]
                  .filter(Boolean)
                  .join(" ")}
                href={`#${page.slug}`}
                key={page.slug || "home"}
              >
                <span>{page.number}</span>
                {page.label}
              </a>
            ))}
          </nav>
        )}
      </header>
      {conceptItem ? (
        <ConceptPage
          item={conceptItem}
          onClose={() => {
            window.location.hash = currentPage.startsWith("honorary/")
              ? "honorary"
              : "concepts";
          }}
        />
      ) : currentPage === "concepts" ? (
        <ConceptsPage collection={collections.concepts} />
      ) : collections[currentPage] ? (
        <RankingPage key={currentPage} collection={collections[currentPage]} />
      ) : (
        <HomePage />
      )}
      <footer>
        <span>Beauty of Mathematics</span>
        <span>Curiosity is a form of intelligence.</span>
        <nav className="social-links" aria-label="Social media links">
          <a
            href="https://www.linkedin.com/in/ben-braniff-74965a299/"
            aria-label="LinkedIn"
            target="_blank"
            rel="noreferrer"
          >
            <i className="bx bxl-linkedin" aria-hidden="true"></i>
          </a>
          <a
            href="https://github.com/benbraniff"
            aria-label="GitHub"
            target="_blank"
            rel="noreferrer"
          >
            <i className="bx bxl-github" aria-hidden="true"></i>
          </a>
          <a
            href="https://x.com/BenjaminBraniff"
            aria-label="X"
            target="_blank"
            rel="noreferrer"
          >
            <img className="social-icon" src={xTwitterIcon} alt="" aria-hidden="true" />
          </a>
          <a
            href="https://www.youtube.com/@Cowbob1"
            aria-label="YouTube"
            target="_blank"
            rel="noreferrer"
          >
            <i className="bx bxl-youtube" aria-hidden="true"></i>
          </a>
          <a
            href="mailto:Ben.Braniff37@gmail.com"
            aria-label="Email Benjamin Braniff"
          >
            <i className="bx bx-envelope" aria-hidden="true"></i>
          </a>
        </nav>
        <span>© 2026</span>
      </footer>
    </div>
  );
}

function HomePage() {
  return (
    <main className="home-page">
      <section className="home-heading">
        <h1>Top 10^2</h1>
        <p className="page-intro">
          A curated collection of mathematical ideas, people, media, books,
          equations, and resources to help you explore the beauty of
          mathematics.
        </p>
      </section>
      <section className="home-index">
        <div className="index-grid">
          {pages.slice(1).map((page) => (
            <a href={`#${page.slug}`} key={page.slug}>
              <span>{page.number}</span>
              <strong>{page.label}</strong>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}

function RankingPage({ collection }) {
  const [openItem, setOpenItem] = useState(null);

  return (
    <main className="ranking-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <a href="#">Homepage</a>
        <span aria-hidden="true">&gt;</span>
        <span aria-current="page">{collection.title}</span>
      </nav>
      <section className="page-heading">
        <h1>{collection.title}</h1>
        <p className="page-intro">
          {collection.intro}
          {collection.introLink && (
            <>
              {" "}
              <a
                className="page-intro-link"
                href={collection.introLink.url}
                target="_blank"
                rel="noreferrer"
              >
                {collection.introLink.label}
              </a>
            </>
          )}
        </p>
      </section>
      <ol className="ranking-list">
        {collection.items.map((item, index) => (
          <li
            className={item.description ? "has-details" : ""}
            key={item.name ?? item}
          >
            {item.articleSlug ? (
              <a
                className="item-trigger"
                href={`#honorary/${item.articleSlug}`}
              >
                <span className="rank">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="item-name">{item.name}</span>
                <span className="item-arrow" aria-hidden="true">
                  <i className="bx bx-right-arrow-alt"></i>
                </span>
              </a>
            ) : item.description ? (
              <button
                className="item-trigger"
                type="button"
                aria-expanded={openItem === index}
                aria-controls={`item-detail-${index}`}
                onClick={() => setOpenItem(openItem === index ? null : index)}
              >
                <span className="rank">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="item-name">{item.name}</span>
                <span className="item-arrow" aria-hidden="true">
                  <i className="bx bx-caret-right"></i>
                </span>
              </button>
            ) : (
              <>
                <span className="rank">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="item-name">{item.name ?? item}</span>
                <span className="item-arrow" aria-hidden="true">
                  <i className="bx bx-caret-right"></i>
                </span>
              </>
            )}
            {item.description && openItem === index && (
              <div
                className={`item-details ${
                  collection.textDetails ||
                  item.noImage ||
                  (collection.noFallbackImages && !item.image)
                    ? "text-details"
                    : item.approximation
                      ? "constant-details"
                      : item.equation
                        ? "equation-details"
                        : item.book
                          ? "book-details"
                          : item.releaseDate
                            ? "movie-details"
                            : item.image
                              ? "person-details"
                              : ""
                } ${item.equation?.length > 100 ? "long-equation" : ""}`}
                id={`item-detail-${index}`}
              >
                {!collection.textDetails &&
                  !item.noImage &&
                  (item.image || !collection.noFallbackImages) && (
                  <img
                    className={
                      item.image === mandelbrotImg || !item.image
                        ? "mandelbrot-image"
                        : ""
                    }
                    src={item.image ?? mandelbrotImg}
                    alt={item.detailsTitle ?? item.name}
                  />
                )}
                <div className="item-copy">
                  {item.detailsTitle && (
                    <h3 className="honorary-detail-title">
                      {item.detailsTitle}
                    </h3>
                  )}
                  {item.approximation && (
                    <div
                      className="equation-display constant-approximation"
                      aria-label={`${item.name}: ${item.approximation}`}
                      dangerouslySetInnerHTML={{
                        __html: katex.renderToString(item.approximation, {
                          displayMode: true,
                          throwOnError: false,
                        }),
                      }}
                    />
                  )}
                  {item.equation && (
                    <div
                      className={
                        item.approximation
                          ? "constant-formula"
                          : "equation-display"
                      }
                      aria-label={`${item.name}: ${item.equation}`}
                      dangerouslySetInnerHTML={{
                        __html: katex.renderToString(item.equation, {
                          displayMode: true,
                          throwOnError: false,
                        }),
                      }}
                    />
                  )}
                  {item.releaseDate && !item.book && (
                    <div className="person-meta movie-meta">
                      <span>{item.releaseDate}</span>
                      <span>{item.duration}</span>
                    </div>
                  )}
                  {item.book && (
                    <div className="book-meta">
                      {item.author && <span>{item.author}</span>}
                      {item.releaseDate && <span>{item.releaseDate}</span>}
                      {item.pages && <span>{item.pages}</span>}
                    </div>
                  )}
                  {item.keyActors && (
                    <div className="known-for">
                      <span className="known-for-label">Key actors</span>
                      <div className="known-for-list">
                        {item.keyActors.map((actor) => (
                          <span key={actor}>{actor}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {item.dates && (
                    <div className="person-meta">
                      <span>{item.dates}</span>
                      <span>{item.origin}</span>
                    </div>
                  )}
                  {item.knownFor && (
                    <div className="known-for">
                      <span className="known-for-label">Known for</span>
                      <div className="known-for-list">
                        {item.knownFor.map((fact) => (
                          <span key={fact}>{fact}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <p>{item.description}</p>
                  {item.link && (
                    <a
                      className="channel-link"
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.linkLabel
                        ? item.linkLabel
                        : item.book
                        ? "View on Amazon"
                        : collection.resourceList
                          ? "Visit resource"
                          : collection.problemList
                            ? "Read on Wikipedia"
                            : "Visit channel"}{" "}
                      <span aria-hidden="true">↗</span>
                    </a>
                  )}
                  {item.openAiLink && (
                    <a
                      className="channel-link"
                      href={item.openAiLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      OpenAI article and proof <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </li>
        ))}
      </ol>
    </main>
  );
}

function ConceptsPage({ collection }) {
  return (
    <main className="ranking-page concepts-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <a href="#">Homepage</a>
        <span aria-hidden="true">&gt;</span>
        <span aria-current="page">{collection.title}</span>
      </nav>
      <section className="page-heading">
        <h1>{collection.title}</h1>
        <p className="page-intro">{collection.intro}</p>
      </section>
      <ol className="ranking-list">
        {collection.items.map((item, index) => (
          <li className="concept-list-item" key={item.slug}>
            <a className="item-trigger" href={`#concepts/${item.slug}`}>
              <span className="rank">{String(index + 1).padStart(2, "0")}</span>
              <span className="item-name">{item.name}</span>
              <span className="item-arrow" aria-hidden="true">
                <i className="bx bx-right-arrow-alt"></i>
              </span>
            </a>
          </li>
        ))}
      </ol>
    </main>
  );
}

export default App;
