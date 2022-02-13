import { FC, useState, useEffect } from "react";
import useSWR from "swr";
import { useWallet } from "@solana/wallet-adapter-react";

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
  const { signMessage } = useWallet();

  console.log('details: ', details)

  const uri = "https://stark-lake-75007.herokuapp.com:8080/https://api-mainnet.magiceden.io/rpc/getCollectionEscrowStats/"+details?.symbol;

  const { data, error } = useSWR(
    uri,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  console.log("data", data);

  function addToWatchList() {
    let message = new TextEncoder().encode(collectionSymbol)
    console.log('symbol, message', collectionSymbol, message)
    if (!signMessage) throw new Error('Wallet does not support message signing!');
    if(message) signMessage(message);
  }

  useEffect(() => {
    if (!error && !!data) {
      onTokenDetailsFetched(data);
      setCollectionName(details?.name)
      const exponent = 9
      setFloorPrice(data?.results.floorPrice/Math.pow(10, exponent))
      setAvgPrice(data?.results.floorPrice/Math.pow(10, exponent))
      setCollectionSymbol(details?.symbol)
      setVolume(Math.round(data?.results.volumeAll/Math.pow(10, exponent)))
      setListedCount(Math.round(data?.results.listedCount/Math.pow(10, exponent)))
    }
  }, [data, error]);

  return (
    <>
    <tr>
      <td>{collectionName}</td>
      <td>{floorPrice}</td>
      <td>{avgPrice}</td>
      <td>{volume}</td>
      <td>
        <button
          className="btn btn-primary btn-lg"
          onClick={addToWatchList}
        >
          {<div>Watch</div>}
        </button>
      </td>
    </tr>
    </>
  );
};
