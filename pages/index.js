import Head from "next/head";

const projects = [
  {
    title: "City Comparator",
    href: "/city-comparator",
    blurb:
      "Comparing European cities by their public-transport networks — interactive maps and graph-theoretic stats.",
    tags: ["maps", "data", "transit"],
    live: true,
  },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>Pontus Lüthi</title>
        <meta
          name="description"
          content="Pontus Lüthi — projects in maps, data, and software."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="wrap">
        <header className="intro">
          <h1>Pontus Lüthi</h1>
          <p>Maps, data, and things I build for the fun of it.</p>
        </header>

        <section aria-label="Projects" className="projects">
          {projects.map((p) => (
            <a key={p.href} href={p.href} className="card">
              <div className="card-head">
                <h2>{p.title}</h2>
                {p.live && <span className="badge">live</span>}
              </div>
              <p className="blurb">{p.blurb}</p>
              <div className="tags">
                {p.tags.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
            </a>
          ))}

          <div className="card card--soon">
            <div className="card-head">
              <h2>More soon</h2>
            </div>
            <p className="blurb">Other experiments will land here.</p>
          </div>
        </section>

        <footer className="foot">
          <a href="https://github.com/pontusluthi">github.com/pontusluthi</a>
        </footer>
      </main>
    </>
  );
}
