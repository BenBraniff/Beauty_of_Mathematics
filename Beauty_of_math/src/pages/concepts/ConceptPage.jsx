import MandelbrotExplorer from "./MandelbrotExplorer";
import PascalsTriangle from "./PascalsTriangle";
import PlatonicSolids from "./PlatonicSolids";
import SunflowerSpiral from "./SunflowerSpiral";

const conceptArticles = {
  "mandelbrot-set": [
    {
      title: "A simple rule, a world of detail",
      paragraphs: [
        "The Mandelbrot set begins with a tiny operation: pick a complex number, square it, add the starting value, and repeat the process. The set tracks which starting points stay bounded instead of flying off toward infinity.",
        "That simple instruction hides extraordinary complexity. As you zoom in near the boundary, new spirals, filaments, and miniature copies appear, each carrying the same recursive logic as the whole shape.",
      ],
    },
    {
      title: "Why the boundary is so strange",
      paragraphs: [
        "The beauty of the Mandelbrot set is not in the filled-in region alone but in the edge where order and chaos meet. That frontier is a fractal: the same motifs recur at different scales, even when the image looks impossibly intricate.",
        "This means small changes in the input can produce dramatic differences in outcome. The set is a visual summary of how a simple rule can generate an entire landscape of unpredictability.",
      ],
    },
    {
      title: "What it teaches us",
      paragraphs: [
        "The Mandelbrot set is a reminder that complexity does not require complexity in the rule itself. It shows how iteration, feedback, and self-similarity can create patterns that feel alive and infinitely rich.",
        "Mathematicians study it not just for its beauty but for the way it reveals structure inside chaos. In that sense, it stands as one of the clearest examples of how mathematics can turn a tiny rule into a whole universe of form.",
      ],
    },
  ],
  "golden-ratio": [
    {
      title: "The proportion that keeps reappearing",
      paragraphs: [
        "The golden ratio, often written as phi, appears when a whole is divided into two parts so that the larger part relates to the whole in the same way the smaller part relates to the larger. This ratio is approximately 1.618.",
        "It is a number with a remarkable habit: it shows up in geometry, art, architecture, and natural growth patterns. The same proportion recurs because it is tied to the logic of self-similarity and recursive growth.",
      ],
    },
    {
      title: "Fibonacci brings it into view",
      paragraphs: [
        "The Fibonacci sequence, 1, 1, 2, 3, 5, 8, 13, ... is not just a nice list of integers. As the numbers grow, their ratios get closer and closer to the golden ratio.",
        "That connection helps explain why the ratio appears in spirals, branchings, and arrangements of leaves or seeds. Nature often grows by adding the next step to the previous one, and that process naturally tends toward a ratio with a special balance.",
      ],
    },
    {
      title: "Why it feels aesthetically right",
      paragraphs: [
        "People have long noticed that rectangles and compositions based on the golden ratio often feel harmonious. That feeling is not mystical so much as structural: the ratio creates a pleasing balance between repetition and variation.",
        "The idea matters because it links mathematics to visual intuition. A number can be ordinary in one context and deeply expressive in another, and the golden ratio is one of the clearest examples of that bridge.",
      ],
    },
  ],
  "pascals-triangle": [
    {
      title: "A triangle built from addition",
      paragraphs: [
        "Pascal's triangle begins with a single 1 at the top and adds numbers by summing the two entries above. The result is a triangular array that looks simple but carries an extraordinary amount of structure.",
        "Every row encodes coefficients for binomial expansions, which means the triangle is deeply tied to algebra and combinatorics. It is one of the cleanest examples of a pattern that quietly contains several different mathematical worlds.",
      ],
    },
    {
      title: "Patterns hiding inside the rows",
      paragraphs: [
        "The triangle reveals familiar sequences: the row sums are powers of 2, the diagonals produce counting numbers and triangular numbers, and the symmetry of each row reflects the balance of combinations. Even the familiar Sierpinski triangle appears when the odd and even entries are colored differently.",
        "It also connects to probability, because the coefficients in binomial expansions count ways of choosing outcomes. In that sense, Pascal's triangle is both a geometric display and a computational tool.",
      ],
    },
    {
      title: "A map of mathematical relationships",
      paragraphs: [
        "What makes Pascal's triangle so powerful is that it gathers many ideas in one place. It shows how arithmetic, counting, algebra, symmetry, and probability can all be expressed through one elegant structure.",
        "That is why it has stayed relevant for centuries: it is not just a curiosity, but a way of seeing hidden order at the heart of many different problems.",
      ],
    },
  ],
  "platonic-solids": [
    {
      title: "The most regular shapes in three dimensions",
      paragraphs: [
        "A Platonic solid is a three-dimensional shape whose faces are congruent regular polygons, with the same number meeting at each vertex. The familiar cube, tetrahedron, octahedron, dodecahedron, and icosahedron are all examples.",
        "The striking fact is that there are only five such solids. This rarity is not a coincidence: it is a consequence of geometry and symmetry forcing a tight set of possibilities.",
      ],
    },
    {
      title: "Why symmetry matters here",
      paragraphs: [
        "In a Platonic solid, every face and every corner behaves the same way. That regularity gives the shapes a kind of mathematical perfection. They are not just beautiful objects; they are precise states of maximal symmetry.",
        "This made them important to philosophers, artists, and mathematicians throughout history. Their geometry felt like an ideal form, a way of seeing order take visible shape.",
      ],
    },
    {
      title: "From geometry to modern mathematics",
      paragraphs: [
        "Platonic solids are also central to the study of symmetry groups and polyhedra. Their dual relationships are especially elegant: the cube and octahedron are duals, as are the dodecahedron and icosahedron, while the tetrahedron is self-dual.",
        "In modern mathematics, these objects still matter because they reveal how symmetry and structure organize space. They are a perfect example of how a small classification problem can lead to a deep and beautiful theory.",
      ],
    },
  ],
  fractals: [
    {
      title: "A shape built from repetition",
      paragraphs: [
        "A fractal is a pattern that looks self-similar across scales. You can zoom in on part of it and still see structures that echo the whole, even if the details become more intricate or compressed.",
        "This is not just a visual trick. It reflects a recursive process: a rule is applied again and again, producing layers of form from a simple starting shape or transformation.",
      ],
    },
    {
      title: "The dragon curve as an example",
      paragraphs: [
        "The dragon curve is created by repeatedly folding a strip of paper and then unfolding it into a curve. Each iteration doubles the number of segments, and the pattern begins to twist into a shape that feels both orderly and surprising.",
        "The result is a curve that is not smooth in the classical sense, yet it is highly structured. It shows how a simple folding process can generate a complex object with a striking sense of self-similarity.",
      ],
    },
    {
      title: "Why fractals change how we see nature",
      paragraphs: [
        "Fractals appear in coastlines, branching trees, lightning, snowflakes, and many other natural forms. The reason they matter is that many natural processes are irregular at small scales yet patterned at larger scales.",
        "Fractals give us a language for those forms. They help explain why roughness, branching, and repetition can coexist in a single shape, and why the whole may be more informative than any one local detail.",
      ],
    },
  ],
  curves: [
    {
      title: "Curves are the geometry of motion",
      paragraphs: [
        "The word curve covers a great deal of mathematics, from the smooth parabola to the spiraling path traced by a wheel. A curve is often the natural way to describe a system in motion, whether that motion comes from gravity, rolling, or growth.",
        "Different physical situations generate different curves, and each one carries its own characteristic geometry. That is why a hanging chain and a rolling circle can both lead to mathematical objects with a striking identity.",
      ],
    },
    {
      title: "The catenary and the cycloid",
      paragraphs: [
        "A hanging chain adopts a catenary, a curve that is not a parabola but is closely related. It appears when tension and gravity balance each other, and it is one of the classic curves of mechanics.",
        "A cycloid appears when a point on a circle rolls along a line. The resulting path rises and falls in a rhythmic wave that has both elegance and practical significance. It was studied in relation to motion, optics, and geometric construction.",
      ],
    },
    {
      title: "Why curves matter beyond drawing",
      paragraphs: [
        "Curves are not just shapes on a page. They encode relationships between changing quantities, and they let us describe the flow of systems in time and space. A curve can represent the path of a projectile, the shape of a bridge, or the way a population changes over time.",
        "That is why curves connect geometry to physics and calculus. They turn abstract motion into something we can study, predict, and use.",
      ],
    },
  ],
  "conic-sections": [
    {
      title: "A cone sliced in different ways",
      paragraphs: [
        "A conic section is formed by cutting a cone with a plane. Depending on the angle of the slice, the result is a circle, ellipse, parabola, or hyperbola. One object produces a family of shapes that all share the same deeper structure.",
        "This is one of mathematics' great unifying ideas: many seemingly different curves arise from the same underlying geometry. A single construction generates a collection of forms that appear everywhere in nature and technology.",
      ],
    },
    {
      title: "The family of curves",
      paragraphs: [
        "A circle is the most symmetric member of the family, while ellipses describe orbits and stretched shapes. Parabolas appear in the path of projectiles and in the reflective design of telescopes and satellite dishes, where they focus energy efficiently.",
        "Hyperbolas arise when the path or relationship continues without closing in on itself, and they appear in navigation, optics, and other systems where one quantity changes in relation to another. The same cone contains them all.",
      ],
    },
    {
      title: "Why the idea lasts",
      paragraphs: [
        "Conic sections are still central because they are not only beautiful but useful. They model planetary motion, light paths, lenses, and engineering designs in a way that is both exact and manageable.",
        "When a concept connects geometry to physical reality so cleanly, it earns a permanent place in mathematics. Conic sections are a classic example of a bright idea that keeps paying off.",
      ],
    },
  ],
  "eulers-number": [
    {
      title: "The number that grows naturally",
      paragraphs: [
        "Euler's number, written as e, is the base of natural logarithms and one of the most important constants in mathematics. It appears in the study of continuous growth because it describes the limit of repeated compounding.",
        "Its value is about 2.71828..., and it emerges when a quantity grows in proportion to itself. That relationship shows up in population models, bank interest, radioactive decay, and many physical processes.",
      ],
    },
    {
      title: "Why it is the language of change",
      paragraphs: [
        "The exponential function e to the x has the remarkable property that its rate of change equals itself. This makes it the natural description of smooth, self-sustaining growth and decay.",
        "This idea is at the heart of differential equations and modeling. When systems change in proportion to their current state, the mathematics almost always leads back to e.",
      ],
    },
    {
      title: "A constant with universal reach",
      paragraphs: [
        "The number e is not confined to finance or growth models. It also appears in probability, complex analysis, and the geometry of waves. It links exponential behavior with the idea of continuity in a way that is both elegant and powerful.",
        "That universality is why e feels less like a special number and more like a governing law of change. It is a central piece of the mathematical architecture behind the modern world.",
      ],
    },
  ],
  "bell-curve": [
    {
      title: "Around the average, the world clusters",
      paragraphs: [
        "The bell curve, or normal distribution, describes a pattern in which values cluster around an average and become less common as they move away from it. It is the familiar symmetric shape that appears when many small independent influences combine.",
        "This does not mean every dataset looks like a bell, but the distribution shows up often enough that it becomes one of the most important ideas in statistics and the sciences.",
      ],
    },
    {
      title: "The central limit theorem explains the shape",
      paragraphs: [
        "The reason the bell curve is so common is that sums of many small random effects tend to settle into a predictable shape, even if the individual pieces are noisy. This is the central limit theorem in action.",
        "It means that fluctuations can still produce a remarkably stable pattern when viewed in aggregate. The average remains informative, and the spread around it becomes measurable.",
      ],
    },
    {
      title: "Where it matters",
      paragraphs: [
        "The bell curve is used in psychology, economics, measurement, quality control, and natural science. It helps us understand variation, compare scores, estimate uncertainty, and decide whether an outcome is unusual or expected.",
        "Its power is partly conceptual: it turns a messy world into a manageable distribution. That is why the bell curve remains one of the key windows into how randomness and structure interact.",
      ],
    },
  ],
  pi: [
    {
      title: "The ratio that defines circles",
      paragraphs: [
        "Pi, written as pi, is the ratio of a circle's circumference to its diameter. No matter how large or small the circle is, that ratio stays the same. It is one of the oldest and most famous constants in mathematics.",
        "The decimal expansion of pi never ends and never repeats, which gives it a kind of infinite character. Yet its practical meaning is simple: it is the bridge between roundness and measurement.",
      ],
    },
    {
      title: "From geometry to waves",
      paragraphs: [
        "Pi does more than describe circles. It appears in trigonometry, Fourier analysis, probability, and physics because periodic motion and waves are built from circles and sine functions. In these contexts, pi is not just a geometric constant but a structural one.",
        "That is why it shows up in questions about sound, light, electrical systems, and even quantum mechanics. The same number keeps reappearing because the mathematics of repetition is built on cycles.",
      ],
    },
    {
      title: "A symbol of mathematical infinity",
      paragraphs: [
        "Pi is an excellent example of how a simple definition can lead to deep and surprising complexity. It connects familiar geometry to infinite series, approximations, and patterns that escape finite description.",
        "Its enduring role in mathematics comes from this dual nature: it is both concrete and mysterious. It is a constant you can measure with a ruler, but it also invites us into the infinite.",
      ],
    },
  ],
};

const defaultConceptArticle = [
  {
    title: "A small idea with a long reach",
    paragraphs: [
      "This concept turns a familiar pattern into a precise mathematical idea, giving us a way to describe structure, motion, or symmetry with greater clarity.",
      "The value of the idea lies in how it connects a concrete question to a broader theory. Once the pattern is named, it becomes easier to compare, test, and extend it.",
    ],
  },
  {
    title: "Look for the pattern first",
    paragraphs: [
      "The most fruitful way to approach this idea is to start with examples. Try changing one detail, tracing a few cases, and asking which features remain stable as the pattern evolves.",
      "That patient observation is often the beginning of real mathematical insight. A beautiful concept usually begins as a question about how a system behaves, not as a finished theorem.",
    ],
  },
];

export default function ConceptPage({ item, onClose }) {
  const articleSections = conceptArticles[item.slug] ?? defaultConceptArticle;

  return (
    <div
      className="concept-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="concept-title"
    >
      <div className="concept-modal-backdrop" onClick={onClose}></div>
      <article className="concept-modal-panel">
        <div className="concept-modal-topbar">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <a href="#">Homepage</a>
            <span aria-hidden="true">&gt;</span>
            <a href="#concepts">Top 10 Math Concepts</a>
            <span aria-hidden="true">&gt;</span>
            <span aria-current="page">{item.name}</span>
          </nav>
          <button
            className="concept-close"
            type="button"
            onClick={onClose}
            aria-label="Close concept page"
          >
            <i className="bx bx-x" aria-hidden="true"></i>
          </button>
        </div>
        <div className="concept-modal-content">
          <div
            className={`concept-hero ${
              item.slug === "mandelbrot-set" ? "concept-hero-mandelbrot" : ""
            }`}
          >
            <div>
              <h1 id="concept-title">{item.name}</h1>
              <p>{item.description}</p>
            </div>
            {item.slug !== "mandelbrot-set" &&
              item.slug !== "pascals-triangle" && (
              <div className="concept-visuals">
                {(item.images ?? [item.image]).map((image, index) => (
                  <img
                    key={image}
                    src={image}
                    alt={`${item.name} illustration ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="concept-sections">
            {item.slug === "mandelbrot-set" && <MandelbrotExplorer />}
            {item.slug === "pascals-triangle" && <PascalsTriangle />}
            {item.slug === "platonic-solids" && <PlatonicSolids />}
            {item.slug === "golden-ratio" && <SunflowerSpiral />}
            {articleSections.map((section) => (
              <section key={section.title}>
                <h2>{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}
            {item.slug === "platonic-solids" && (
              <section className="concept-video-section">
                <h2>The ALMOST Platonic Solids</h2>
                <div className="concept-video">
                  <iframe
                    src="https://www.youtube-nocookie.com/embed/_QxrkEqOrWM"
                    title="The ALMOST Platonic Solids"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              </section>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
