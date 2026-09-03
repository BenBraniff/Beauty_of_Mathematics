import { useEffect, useState } from "react";
import heroImg from "./assets/hero.png";
import "boxicons/css/boxicons.min.css";
import "./App.css";

const pages = [
  { slug: "", label: "Homepage", shortLabel: "Home", number: "00" },
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
    slug: "resources",
    label: "Top 10 Math Resources",
    shortLabel: "Resources",
    number: "05",
  },
  {
    slug: "equations",
    label: "Top 10 Equations",
    shortLabel: "Equations",
    number: "06",
  },
  {
    slug: "books",
    label: "Top 10 Math Books",
    shortLabel: "Books",
    number: "07",
  },
  {
    slug: "problems",
    label: "Top 10 Famous Unsolved Problems & Conjectures",
    shortLabel: "Problems",
    number: "08",
  },
  {
    slug: "constants",
    label: "Top 10 Fundamental Mathematical Constants",
    shortLabel: "Constants",
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
      "Mandelbrot set",
      "Golden Ratio (Fibonacci sequence)",
      "Pascal's Triangle",
      "Platonic Solids (plus Archimedean solids)",
      "Fractals (Dragon curve)",
      "Curves(Cycloid and Catenary)",
      "Conic Sections",
      "Euler's Number e",
      "Bell curve",
      "Pi",
    ],
  },
  mathematicians: {
    title: "Top 10 Mathematicians",
    intro:
      "Ten thinkers whose questions still shape the language of mathematics today.",
    items: [
      "Leonhard Euler",
      "Carl Friedrich Gauss",
      "Isaac Newton",
      "Archimedes",
      "Euclid",
      "Gottfried Wilhelm Leibniz",
      "Pierre de Fermat",
      "René Descartes",
      "Blaise Pascal",
      "Srinivasa Ramanujan",
    ],
  },
  youtubers: {
    title: "Top 10 Math YouTubers",
    intro:
      "Channels that make difficult ideas feel visual, surprising, and worth chasing.",
    items: [
      "Numberphile",
      "3Blue1Brown",
      "Mathologer",
      "Veritasium",
      "Vsauce",
      "Stand-up Math",
      "The Organic Chemistry Tutor",
      "blackpenredpen",
      "Kuvina Saydaki",
      "Terence Tao",
    ],
  },
  movies: {
    title: "Top 10 Math Movies",
    intro:
      "Stories about genius, obsession, discovery, and the beautiful mess of being human.",
    items: [
      "Good will Hunting",
      "Hidden Figures",
      "Stand and deliver",
      "October Sky",
      "The Martian",
      "A beautiful mind",
      "The imitation game",
      "The man who knew infinity",
      "X+Y (movie)",
      "The theory of everything",
    ],
  },
  resources: {
    title: "Top 10 Math Resources",
    intro:
      "A hand-picked shelf of places to learn, practice, visualize, and go further.",
    items: [
      "Khan Academy",
      "MIT OpenCourseWare",
      "Wolfram MathWorld",
      "Brilliant",
      "Desmos",
      "GeoGebra",
      "Project Euler",
      "Art of Problem Solving",
      "NRICH",
      "Numberphile",
    ],
  },
  equations: {
    title: "Top 10 equations",
    intro:
      "Equations that reveal surprising connections between the abstract and the real.",
    items: [
      "Pythagorean theorem",
      "Euler's identity",
      "Newton's second law",
      "Mass-energy equivalence",
      "The quadratic formula",
      "The wave equation",
      "The heat equation",
      "Maxwell's equations",
      "The ideal gas law",
      "The logistic map",
    ],
  },
  books: {
    title: "Top 10 Math Books",
    intro:
      "Books that invite us to understand mathematics, its history, and its strange beauty.",
    items: [
      "The Joy of x",
      "A Mathematician's Apology",
      "Gödel, Escher, Bach",
      "The Man Who Knew Infinity",
      "Flatland",
      "Chaos",
      "The Princeton Companion to Mathematics",
      "How Not to Be Wrong",
      "Love and Math",
      "The Elements",
    ],
  },
  problems: {
    title: "Top 10 Famous Unsolved Problems & Conjectures",
    intro:
      "The great unanswered questions that keep mathematicians searching for new ideas.",
    items: [
      "Riemann hypothesis",
      "P versus NP",
      "Birch and Swinnerton-Dyer conjecture",
      "Hodge conjecture",
      "Navier-Stokes existence and smoothness",
      "Yang-Mills existence and mass gap",
      "Goldbach's conjecture",
      "Twin prime conjecture",
      "Collatz conjecture",
      "Legendre's conjecture",
    ],
  },
  constants: {
    title: "Top 10 Fundamental Mathematical Constants",
    intro:
      "Special numbers that appear again and again across mathematics and the sciences.",
    items: [
      "Pi (π)",
      "Euler's number (e)",
      "The golden ratio (φ)",
      "The imaginary unit (i)",
      "The square root of 2",
      "Apéry's constant (ζ(3))",
      "The Euler-Mascheroni constant (γ)",
      "The Feigenbaum constant (δ)",
      "The plastic number (ρ)",
      "The universal parabolic constant (P)",
    ],
  },
  honorary: {
    title: "Top 10 Honorary Mentions",
    intro:
      "More beautiful corners of mathematics that deserve a little extra attention.",
    items: [
      "The four-color theorem",
      "The Monty Hall problem",
      "The birthday paradox",
      "The Möbius strip",
      "The Banach-Tarski paradox",
      "The Königsberg bridges",
      "The Seven Bridges of Königsberg",
      "The barber paradox",
      "The Koch snowflake",
      "The Look-and-say sequence",
    ],
  },
};

function getPage() {
  return window.location.hash.replace(/^#\/?/, "");
}

function App() {
  const [currentPage, setCurrentPage] = useState(getPage());
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onHashChange = () => {
      setCurrentPage(getPage());
      setMenuOpen(false);
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const selectedPage =
    pages.find((page) => page.slug === currentPage) ?? pages[0];

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#" aria-label="Beauty of Mathematics home">
          <span>
            Beauty of
            <br />
            <strong>Mathematics</strong>
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
                className={selectedPage.slug === page.slug ? "active" : ""}
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
      {collections[currentPage] ? (
        <RankingPage collection={collections[currentPage]} />
      ) : (
        <HomePage />
      )}
      <footer>
        <span>Beauty of Mathematics</span>
        <span>Curiosity is a form of intelligence.</span>
        <span>© 2026</span>
      </footer>
    </div>
  );
}

function HomePage() {
  return (
    <main className="home-page">
      <section className="home-image">
        <img src={heroImg} alt="Abstract mathematical artwork" />
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
  return (
    <main className="ranking-page">
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
          <li key={item}>
            <span className="rank">{String(index + 1).padStart(2, "0")}</span>
            <span className="item-name">{item}</span>
            <span className="item-arrow" aria-hidden="true">
              <i className="bx bx-caret-right"></i>
            </span>
          </li>
        ))}
      </ol>
    </main>
  );
}

export default App;
