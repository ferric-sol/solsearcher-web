// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { request } from 'http';
import type { NextApiRequest, NextApiResponse } from 'next'
import createFetch from '@vercel/fetch';
const fetch = createFetch();

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  result: NextApiResponse
) {

	const url = "https://api.solsearcher.space/cors/https://api-mainnet.magiceden.io/all_collections"
	const res = await fetch(url, {
		"headers": {
			"user-agent": "Mozilla"
		}
	})

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    // Attach extra info to the error object.
    const info = await res.json();
    (error as any).status = res.status;

    console.warn(url, "\nAn error occured while fetching:\n", info);

    throw error;
  }

  const cjson = await res.json();
  result.status(200).json(cjson);
}
