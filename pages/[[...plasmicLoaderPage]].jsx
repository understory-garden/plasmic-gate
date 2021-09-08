import * as React from "react";
import { initPlasmicLoader, PlasmicComponent } from "@plasmicapp/loader-nextjs";
import { PlasmicRootProvider } from "@plasmicapp/loader-react";
import Error from "next/error";
import { PLASMIC } from "../init";

export default function PlasmicLoaderPage(props) {
  const { plasmicData } = props;
  if (!plasmicData || plasmicData.entryCompMetas.length === 0) {
    return <Error statusCode={404} />;
  }
  return (
    <PlasmicRootProvider
      loader={PLASMIC}
      prefetchedData={plasmicData}
    >
      <PlasmicComponent component={plasmicData.entryCompMetas[0].name} />
    </PlasmicRootProvider>
  );
}

export const getStaticProps = async (context) => {
  const { plasmicLoaderPage } = context.params ?? {};
  const plasmicPath = typeof plasmicLoaderPage === 'string' ? plasmicLoaderPage : Array.isArray(plasmicLoaderPage) ? `/${plasmicLoaderPage.join('/')}` : '/';
  const plasmicData = await PLASMIC.maybeFetchComponentData(plasmicPath);
  if (plasmicData) {
    return {
      props: { plasmicData },
    };
  }
  return {
    // non-Plasmic catch-all
    props: {},
  };
}

export const getStaticPaths = async () => {
  const pageModules = await PLASMIC.fetchPages();
  return {
    paths: pageModules.map((mod) => ({
      params: {
        plasmicLoaderPage: mod.path.substring(1).split("/"),
      },
    })),
    fallback: false,
  };
}