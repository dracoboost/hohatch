import DocusaurusLink from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import React from "react";
import HomepageParticles from "../components/HomepageParticles";

function HoHatchGetStarted() {
  const version = "1.2.2";

  return (
    <div className="flex flex-col items-center py-8 text-center">
      <div className="flex flex-col">
        <img
          alt="HoHatch Logo"
          src="/img/logos/hohatch-logo.png"
          className="w-[427px] aspect-[427/73] max-w-[80vw]"
        />
        <a
          className="block"
          href="https://github.com/dracoboost/hohatch/releases"
          rel="noopener noreferrer"
          target="_blank"
        >
          <img
            alt="version"
            src={`https://img.shields.io/badge/version-${version}-b7465a`}
            className="w-[90px] h-[20px]"
          />
        </a>
      </div>
      <p className="text-muted-foreground mt-14 max-w-md text-lg sm:text-xl md:max-w-3xl md:text-2xl">
        JPG/DDS image converter for Shadowverse: Worlds Beyond
      </p>
      {/* Container for buttons with increased margin and gap */}
      <div className="mt-12 flex flex-wrap gap-4">
        <DocusaurusLink
          className="button button--secondary button--lg"
          to="/docs/intro"
        >
          Get Started
        </DocusaurusLink>
      </div>
    </div>
  );
}

function HomepageContent() {
  return (
    <main className="container md:px-5 flex h-screen items-center justify-center">
      <HomepageParticles />
      <div className="relative z-10 flex w-full max-w-screen-lg flex-row sm:flex-row items-center justify-between">
        {/* Left Column (Text Content) */}
        <div className="flex flex-col md:w-1/2">
          <HoHatchGetStarted />
        </div>
        {/* Right Column (Image) */}
        <div className="mt-8 flex md:mt-0 w-1/2 md:w-1/2">
          <img
            src="/img/screenshot/hohatch-screenshot-v1.1.0.png"
            alt="HoHatch Screenshot v1.1.0"
            className="w-[632px] aspect-[632/340]"
          />
        </div>
      </div>
      {/* <div className="flex flex-col border">
        <div className="w-32 h-32 bg-red-500">A</div>
        <div className="w-32 h-32 bg-blue-500">B</div>
        <div className="test">TEST</div>
      </div> */}
    </main>
  );
}

export default function Home(): React.ReactElement {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="JPG/DDS image converter for Shadowverse: Worlds Beyond"
    >
      <HomepageContent />
    </Layout>
  );
}
