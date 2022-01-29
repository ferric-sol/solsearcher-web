import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../views";

const Home: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>SolSearcher!</title>
        <meta
          name="description"
          content="Track your favorite Solana NFTs"
        />
      </Head>
      <HomeView />
    </div>
  );
};

export default Home;
