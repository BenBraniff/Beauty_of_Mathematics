import { useEffect, useState } from "react";
import mandelbrotImg from "./assets/mandelbrot_high_resolution.png";
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
import "boxicons/css/boxicons.min.css";
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
      {
        name: "Mandelbrot set",
        slug: "mandelbrot-set",
        description:
          "A simple repeating rule creates an infinitely intricate boundary. The Mandelbrot set is a map of which complex numbers remain bounded when the rule is iterated.",
      },
      {
        name: "Golden Ratio (Fibonacci sequence)",
        slug: "golden-ratio",
        description:
          "The golden ratio appears when a line is divided so the whole relates to the larger part as the larger part relates to the smaller. Fibonacci numbers approach this ratio as they grow.",
      },
      {
        name: "Pascal's Triangle",
        slug: "pascals-triangle",
        description:
          "Each number is the sum of the two above it. The triangle quietly contains binomial coefficients, powers of two, and patterns of symmetry.",
      },
      {
        name: "Platonic Solids (plus Archimedean solids)",
        slug: "platonic-solids",
        description:
          "Platonic solids are perfectly regular three-dimensional shapes. Their faces, edges, and vertices fit together with a rare and satisfying kind of symmetry.",
      },
      {
        name: "Fractals (Dragon curve)",
        slug: "fractals",
        description:
          "Fractals repeat a pattern across scales, producing detail that echoes the whole. The Dragon curve is a striking example built from a simple folding process.",
      },
      {
        name: "Curves (Cycloid and Catenary)",
        slug: "curves",
        description:
          "Different physical questions create different remarkable curves. A hanging chain forms a catenary, while a rolling circle traces a cycloid.",
      },
      {
        name: "Conic Sections",
        slug: "conic-sections",
        description:
          "Cut a cone at different angles and you get circles, ellipses, parabolas, or hyperbolas. One geometric family explains many paths in nature and engineering.",
      },
      {
        name: "Euler's Number e",
        slug: "eulers-number",
        description:
          "The number e is the natural language of continuous growth and change. It appears in compound interest, decay, probability, and differential equations.",
      },
      {
        name: "Bell curve",
        slug: "bell-curve",
        description:
          "The bell curve models how values cluster around an average. It is the familiar shape of the normal distribution, one of statistics' central ideas.",
      },
      {
        name: "Pi",
        slug: "pi",
        description:
          "Pi is the constant ratio between a circle's circumference and its diameter. Its digits never end, yet it connects geometry, waves, probability, and physics.",
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
        name: "Terence Tao",
        image: terenceTaoImg,
        link: "https://www.youtube.com/@TerenceTao27",
        description:
          "Lectures and mathematical perspectives from Terence Tao, spanning research ideas, problem solving, and mathematical practice.",
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
            <i className="bx bxl-twitter" aria-hidden="true"></i>
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
      <section className="home-image">
        <img src={mandelbrotImg} alt="Mandelbrot set" />
      </section>
      <section className="home-heading">
        <h1>Top 10^2</h1>
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
        <p className="page-intro">{collection.intro}</p>
      </section>
      <ol className="ranking-list">
        {collection.items.map((item, index) => (
          <li
            className={item.description ? "has-details" : ""}
            key={item.name ?? item}
          >
            {item.description ? (
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
                <span className="item-name">{item}</span>
                <span className="item-arrow" aria-hidden="true">
                  <i className="bx bx-caret-right"></i>
                </span>
              </>
            )}
            {item.description && openItem === index && (
              <div
                className={`item-details ${item.releaseDate ? "movie-details" : item.image ? "person-details" : ""}`}
                id={`item-detail-${index}`}
              >
                <img
                  className={item.image ? "" : "mandelbrot-image"}
                  src={item.image ?? mandelbrotImg}
                  alt={`${item.name} poster`}
                />
                <div className="item-copy">
                  {item.releaseDate && (
                    <div className="person-meta movie-meta">
                      <span>{item.releaseDate}</span>
                      <span>{item.duration}</span>
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
                      Visit channel <span aria-hidden="true">↗</span>
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

export default App;
