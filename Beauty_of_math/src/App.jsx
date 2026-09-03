import { useEffect, useState } from "react";
import heroImg from "./assets/hero.png";
import "./App.css";

const pages = [
  { slug: "", label: "Homepage", shortLabel: "Home" },
  { slug: "concepts", label: "Math concepts", shortLabel: "Concepts" },
  { slug: "mathematicians", label: "Mathematicians", shortLabel: "People" },
  { slug: "youtubers", label: "Math YouTubers", shortLabel: "Video" },
  { slug: "movies", label: "Math movies", shortLabel: "Movies" },
  { slug: "resources", label: "Math resources", shortLabel: "Resources" },
];

const collections = {
  concepts: {
    eyebrow: "The big ideas",
    title: "Top 10 math concepts",
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
    eyebrow: "The brilliant minds",
    title: "Top 10 mathematicians",
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
    eyebrow: "The curious creators",
    title: "Top 10 math YouTubers",
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
    eyebrow: "Math on screen",
    title: "Top 10 math movies",
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
    eyebrow: "Keep exploring",
    title: "Top 10 math resources",
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
          <span className="brand-mark">∑</span>
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
            {pages.map((page, index) => (
              <a
                className={selectedPage.slug === page.slug ? "active" : ""}
                href={`#${page.slug}`}
                key={page.slug || "home"}
              >
                <span>0{index + 1}</span>
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
          {pages.map((page, index) => (
            <a href={`#${page.slug}`} key={page.slug}>
              <span>0{index + 1}</span>
              <strong>{page.label}</strong>
              <b>↗</b>
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
      <section className="page-heading">
        <p className="eyebrow">{collection.eyebrow}</p>
        <h1>{collection.title}</h1>
        <p className="page-intro">{collection.intro}</p>
      </section>
      <ol className="ranking-list">
        {collection.items.map((item, index) => (
          <li key={item}>
            <span className="rank">{String(index + 1).padStart(2, "0")}</span>
            <span className="item-name">{item}</span>
            <span className="item-arrow">↗</span>
          </li>
        ))}
      </ol>
    </main>
  );
}

export default App;
