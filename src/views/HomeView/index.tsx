import Link from "next/link";
import { FC, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWalletNfts, NftTokenAccount } from "@nfteyez/sol-rayz-react";
import useSWR from "swr";
import { fetcher } from "utils/fetcher";
import { NftCard } from "./NftCard";

// import { useConnection } from "@solana/wallet-adapter-react";

import { Loader, SolanaLogo, SelectAndConnectWalletButton } from "components";
import styles from "./index.module.css";
const walletPublicKey = "3EqUrFrjgABCWAnqMYjZ36GcktiwDtFdkNYwY6C6cDzy";

export const HomeView: FC = ({}) => {
  // const { connection } = useConnection();
  const [walletToParsePublicKey, setWalletToParsePublicKey] =
    useState<string>(walletPublicKey);
  const [searchResults, setSearchResults] = useState<any[]>();
  const [searchTerm, setSearchTerm] = useState<any>();
  const { publicKey, signMessage } = useWallet();

  const { nfts, isLoading, error } = useWalletNfts({
    publicAddress: walletToParsePublicKey,
    // connection,
  });

  console.log("nfts", nfts);

  const url = "/api/fetch_all"
  const { data } = useSWR(
    url,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  console.log(data);

  function filterByName(arr: any[], query: string) {
    return arr.filter(function(el) {
    return el.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
  })
  }

  function handleSubmit() {
    const collection_results = filterByName(data.collections, searchTerm);
    console.log(collection_results);
    setSearchResults(collection_results);
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchTerm(value);
  };

  const onUseWalletClick = () => {
    if (publicKey) {
      setWalletToParsePublicKey(publicKey?.toBase58());
    }
  };

  return (
    <div className="container mx-auto max-w-6xl p-8 2xl:px-0">
      <div className={styles.container}>
        <div className="navbar mb-2 shadow-lg bg-neutral text-neutral-content rounded-box">
          <div className="flex-none">
            <button className="btn btn-square btn-ghost">
              <span className="text-4xl">🏞</span>
            </button>
          </div>
          <div className="flex-1 px-2 mx-2">
            <div className="text-sm breadcrumbs">
              <ul className="text-xl">
                <li>
                  <Link href="/">
                    <a>SolSearcher</a>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex-none">
            <WalletMultiButton className="btn btn-ghost" />
          </div>
        </div>

        <div className="text-center pt-2">
          <div className="hero min-h-15 p-0 pt-10">
            <div className="text-center hero-content w-full">
              <div className="w-full">
                <h1 className="mb-5 text-5xl">
                  Track your favorite Solana <SolanaLogo /> NFTs
                </h1>

                <div className="w-full min-w-full">
                  <div>
                    <div className="form-control mt-8">
                      <label className="input-group input-group-vertical input-group-lg">
                        <span>Search</span>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            placeholder="Enter NFT name"
                            className="w-full input input-bordered input-lg"
                            onChange={onChange}
                            onKeyDown={e => { if(e.key === 'Enter') handleSubmit()} }
                            style={{
                              borderRadius:
                                "0 0 var(--rounded-btn,.5rem) var(--rounded-btn,.5rem)",
                            }}
                          />
                          <button
                            className="btn btn-primary btn-lg"
                            onClick={handleSubmit}
                          >
                            {<div>Search</div>}
                          </button>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="my-10">
                  {error ? (
                    <div>
                      <h1>Error Occurred</h1>
                      {(error as any)?.message}
                    </div>
                  ) : null}

                  {!error && isLoading && (
                    <div>
                      <Loader />
                    </div>
                  )}
                </div>
                <p>Search Results</p>
                <hr></hr>
                <div className="overflow-x-auto">
                  <table className="table w-full table-zebra">
                    <thead>
                      <tr>
                        <td>Name</td>
                        <td>Floor</td>
                        <td>24h Avg</td>
                        <td>Volume</td>
                        <td>Watch</td>
                      </tr>
                    </thead>
                    <tbody>
                      {searchResults?.map((result) => (
                        <NftCard details={result} onSelect={() => { }} />
                      ))}
                    </tbody>
                  </table>
                </div>
                <p>My Tracked NFTs</p>
                <hr></hr>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
