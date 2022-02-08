// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { request } from 'http';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  result: NextApiResponse<Data>
) {

	const url = "https://api-mainnet.magiceden.io/all_collections"
	const res = await fetch(url, {
		"headers": {
			"accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
			"accept-language": "en-US,en;q=0.9",
			"cache-control": "no-cache",
			"pragma": "no-cache",
			"user-agent": "\"Chromium\";v=\"97\", \" Not;A Brand\";v=\"99\"",
			"sec-ch-ua": "\"Chromium\";v=\"97\", \" Not;A Brand\";v=\"99\"",
			"sec-ch-ua-mobile": "?0",
			"sec-ch-ua-platform": "\"Linux\"",
			"sec-fetch-dest": "document",
			"sec-fetch-mode": "navigate",
			"sec-fetch-site": "none",
			"sec-fetch-user": "?1",
			"upgrade-insecure-requests": "1",
			"cookie": "rl_page_init_referrer=RudderEncrypt%3AU2FsdGVkX1%2B9ndMDlOIAhTedI2aQQxFssxsERUosUKI%3D; rl_page_init_referring_domain=RudderEncrypt%3AU2FsdGVkX1%2B72YGabnGCojtTfhKEiiD8ZMR0Qgfk16s%3D; _clck=bdg4we|1|eym|0; rl_user_id=RudderEncrypt%3AU2FsdGVkX1%2BoVR2kzB69jjWUAw%2FOjPEf8cJsZNQjD1M8Bs85iGl7ouHzwoPyis8IUdPXuamwXQNvROBiuEpZrg%3D%3D; rl_anonymous_id=RudderEncrypt%3AU2FsdGVkX19qahNroF5fHFiG8UGDJBKGunaw9w%2FPDbKK8%2BLB7IISxNepvauQMoon%2FavJJbvPBjScPZTwpHJgZg%3D%3D; rl_group_id=RudderEncrypt%3AU2FsdGVkX1%2FPrkmaoOFdOgxnuWbF5lJpf9RaguPcLKQ%3D; rl_trait=RudderEncrypt%3AU2FsdGVkX1%2BsvgY4WS7hlf3qIfbfIsAILxGXQBEZKTQY2zEuzDcEIJ8ORnvm9urj0%2Bse7BAJwTRlYHgtaWe4pg%2F1P7qqxcOnr0rIRpPiiRtK2FB4Jv3rebPS1dgQ5ZPguq3KqT994e6j1D%2BmmcJUQXRBlV1K8o58JkVJvT78cqmJ7pZIVIT9eKi%2F13ikFB7HNpD6%2BR5QMQwCHRSn68JNoA%3D%3D; rl_group_trait=RudderEncrypt%3AU2FsdGVkX1%2Bgm%2FEC1LVDC4aUaRheBljg1rRZRq%2BIbio%3D; connect.sid=s%3AAYCeriUIKUUpY6kmU5-m5E3bB3zcMb5i.jbyviyLk%2FRKdrV5v%2FGiRJT2bG1zuijMPfY8AL2PLvxA"
		},
		"referrerPolicy": "strict-origin-when-cross-origin",
		"body": null,
		"method": "GET"
	});

	console.log('>>>', res.status)

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

  result.status(200).json(res.json);
}
