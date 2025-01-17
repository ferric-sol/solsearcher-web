import { FC, useState, useEffect } from "react";
import useSWR from "swr";
import { useWallet } from "@solana/wallet-adapter-react";
import { sign } from 'tweetnacl';

import { fetcher } from "utils/fetcher";

type Props = {
  details: any;
  onSelect: (id: string) => void;
  onTokenDetailsFetched?: (props: any) => unknown;
};

export const NftCard: FC<Props> = ({
  details,
  onSelect,
  onTokenDetailsFetched = () => {},
}) => {

  const [collectionName, setCollectionName] = useState<string>();
  const [floorPrice, setFloorPrice] = useState<number>();
  const [avgPrice, setAvgPrice] = useState<number>();
  const [collectionSymbol, setCollectionSymbol] = useState<string>();
  const [volume, setVolume] = useState<number>();
  const [listedCount, setListedCount] = useState<number>();
  const { publicKey, signMessage } = useWallet();

  console.log('details: ', details)

  const uri = "/api/symbol/"+details?.symbol;
  const buyurl = "https://magiceden.io/marketplace/"+details?.symbol

  const { data, error } = useSWR(
    uri,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  async function addToWatchList() {
    let message = new TextEncoder().encode(collectionSymbol)
   
    if (!signMessage) throw new Error('Wallet does not support message signing!');
    if (!publicKey) throw new Error('Wallet not connected!');
    const signature = await signMessage(message);
    // Verify that the bytes were signed using the private key that matches the known public key
    if (!sign.detached.verify(message, signature, publicKey.toBytes())) throw new Error('Invalid signature!');
    console.log('pkey', publicKey.toBase58());
  }

  useEffect(() => {
    if (!error && !!data) {
      onTokenDetailsFetched(data);
      setCollectionName(details?.name)
      const exponent = 9
      setFloorPrice(data?.results?.floorPrice/Math.pow(10, exponent))
      setAvgPrice(data?.results?.floorPrice/Math.pow(10, exponent))
      setCollectionSymbol(details?.symbol)
      setVolume(Math.round(data?.results?.volumeAll/Math.pow(10, exponent)))
      setListedCount(Math.round(data?.results?.listedCount/Math.pow(10, exponent)))
    }
  }, [data, error]);

  return (
    <>
    <tr>
      <td>{collectionName}</td>
      <td>{floorPrice}</td>
      <td>{avgPrice}</td>
      <td>{volume}</td>
      <td></td>
      <td></td>
      <td>
        <button
          className="btn btn-primary btn-lg"
          onClick={addToWatchList}
        >
          {<div>Watch</div>}
        </button>
      </td>
      <td>
        <a href={buyurl} target="_blank">
        <button
          className="btn btn-primary btn-lg"
        >
          {<div>Buy</div>}
        </button>
        </a>
      </td>
    </tr>
    </>
  );
};
