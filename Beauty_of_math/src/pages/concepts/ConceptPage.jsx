export default function ConceptPage({ item, onClose }) {
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
          <div className="concept-hero">
            <div>
              <h1 id="concept-title">{item.name}</h1>
              <p>{item.description}</p>
            </div>
            <div className="concept-visuals">
              {(item.images ?? [item.image]).map((image, index) => (
                <img
                  key={image}
                  src={image}
                  alt={`${item.name} illustration ${index + 1}`}
                />
              ))}
            </div>
          </div>
          <div className="concept-sections">
            <section>
              <h2>A small idea with a long reach</h2>
              <p>
                This concept is a useful lens for seeing structure in the world.
                It turns a familiar pattern into a precise question, then gives
                us a way to test what we notice.
              </p>
            </section>
            <section>
              <h2>Look for the pattern first</h2>
              <p>
                Try sketching a few examples, changing one part at a time, and
                describing what stays the same. The most interesting mathematics
                often starts with a patient observation.
              </p>
            </section>
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
