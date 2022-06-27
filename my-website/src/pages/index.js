import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from './index.module.css';

const features = [
  {
    title: <>Free and Easy to Use</>,
    imageUrl: "img/undraw_watch_application.svg",
    description: (
      <>
        Building occupants can complete a right-here-right-now survey directly
        from their Fitbit watch. Without the need of having to open an app on
        their Phone or a survey link.
      </>
    ),
  },
  {
    title: <>Open Source</>,
    imageUrl: "img/undraw_dev_productivity_umsq.svg",
    description: (
      <>
        Cozie is an Open Source project and together with{" "}
        <a href={"https://cozie-apple.app"}>Cozie Apple</a>, allows researchers to
        focus on the data collection. We have taken care of all the programming
        for you!
      </>
    ),
  },
];

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div
      className={clsx(
        "avatar avatar--vertical col col--4 text--center",
        styles.features
      )}
    >
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

const contributors = [
  {
    name: <>Prageeth Jayathissa</>,
    imageUrl: "img/pjjayasthissa.jpeg",
    role: <>Lead developer</>,
    profession: <>Senior Sustainabilit Partner at Vector Limited</>,
    link: "https://www.linkedin.com/in/pjayathissa/",
  },
  {
    name: <>Federico Tartarini</>,
    imageUrl: "img/federico.jpg",
    role: <>Developer, UI design, Back End</>,
    profession: <>Postdoctoral scholar at SinBerBEST</>,
    link: "https://federicotartarini.github.io",
  },
  {
    name: <>Kairat Talantbekov</>,
    imageUrl: "img/kairat.jpeg",
    role: <>Front End</>,
    profession: <>Node.js Software Engineer</>,
    link: "https://www.linkedin.com/in/kairat-talantbekov/",
  },
  {
    name: <>Matias Quintana</>,
    imageUrl: "img/matiasquintana.png",
    role: <>Back End</>,
    profession: <>Ph.D Candidate at NUS</>,
    link: "https://www.linkedin.com/in/matiasqr/",
  },
  {
    name: <>Tapeesh Sood</>,
    imageUrl: "img/tapeesh.png",
    role: <>UI design</>,
    profession: <>Product at Saltmine</>,
    link: "https://www.linkedin.com/in/tapeeshsood/",
  },
  {
    name: <>Clayton Miller</>,
    imageUrl: "img/clayton.png",
    role: <>Project coordinator and supervisor</>,
    profession: <>Assistant Professor at NUS</>,
    link: "https://www.linkedin.com/in/claytonmiller/",
  },
  
];

function Contributor({ imageUrl, name, profession, role, link }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div
      className={clsx(
        "avatar avatar--vertical col col--3 text--center",
        styles.features
      )}
    >
      <img
        className="avatar__photo avatar__photo--xl"
        src={imgUrl}
        alt={name}
      />
      <a className="avatar__intro" href={link}>
        <h4 className="avatar__name">{name}</h4>
        <small className="avatar__subtitle">{profession}</small>
        <small className="avatar__subtitle">{role}</small>
      </a>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Cozie - A Fitbit clockface for indoor environmental quality satisfaction and physiological data collection."
    >
      <header className={clsx("hero hero--primary", styles.heroBanner)}>
        <div className="container">
          <div className="row">
            <div className={clsx("col", styles.profileImgContainer)}>
              <img
                alt="cozie main question"
                className={styles.mainImage}
                src={"img/cozieHomescreen.png"}
              />
            </div>
            <div className={clsx("col", styles.profileHeroContainer)}>
              <h1 className="hero__title">{siteConfig.title}</h1>
              <p className="hero__subtitle">{siteConfig.tagline}</p>
              <a
                className={clsx(
                  "button button--outline button--active button--secondary button--lg margin--sm"
                )}
                href={"mailto:cozie.app@gmail.com"}
              >
                Contact us
              </a>
              <a
                className={clsx(
                  "button button--outline button--active button--secondary button--lg margin--sm"
                )}
                href={"mailto:cozie.app@gmail.com"}
              >
                Become a tester
              </a>
            </div>
          </div>
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
        <hr />
        <section className={styles.features}>
          <div className="container">
            <div className="row">
              <div className={clsx("col col--3")}>
                <img
                  alt="cozie main question"
                  className={styles.mainImage}
                  src={"img/iphone.png"}
                />
              </div>
              <div className={clsx("col col--9")}>
                <h1 className="hero__title">Taylor your survey</h1>
                <p className="hero__subtitle">
                  Choose which questions to show to the study participants
                </p>
                <img
                  alt="Cozie flow of questions"
                  src={"img/flow.png"}
                />
              </div>
            </div>
          </div>
        </section>
        <hr />
        {contributors && contributors.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <h1>Developed and designed by:</h1>
              <div className="row">
                {contributors.map((props, idx) => (
                  <Contributor key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;