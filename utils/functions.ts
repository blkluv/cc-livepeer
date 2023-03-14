import axios from "axios";
import format from "date-fns/format";
import getImage from "../lib/getImage";
import {IVideo} from "../types";
const apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY || "";
const apiSecret = process.env.NEXT_PUBLIC_PINATA_API_SECRET || "";


export const essenceResponseToVideo = (essence: any): IVideo =>  {
    let essenceObj = {
      id: essence.metadata?.metadata_id,
      hash: essence.contentId,
      title: essence.name || "No Title",
      description: essence.metadata?.content,
      location: essence?.location || "",
      category: essence?.category && essence?.category !== "" ? essence?.category : "Other", 
      thumbnailHash: essence.metadata?.image.length === 46 ? getImage(essence.metadata?.image) :  parseURL(essence.metadata?.image), // essence.metadata?.image.split('/').pop(),
      isAudio: false,
      date: essence.metadata?.issue_date,
      author: essence.createdBy?.handle || essence.createdBy?.owner?.address || "Unknown",
      handle: essence.createdBy?.handle,
      isCollectedByMe: essence?.isCollectedByMe,
      collectMw: essence?.collectMw?.type === "COLLECT_FREE" ? "Free" : "Paid",
    }
    essence.metadata?.attributes.map((attribute: any) => {
      if (attribute.trait_type === "title") {
        essenceObj['name'] = attribute.value;
      } else if (attribute.trait_type === "description") {
        essenceObj['description'] = attribute.value;
      } else if (attribute.trait_type === "location") {
        essenceObj['location'] = attribute.value;
      } else if (attribute.trait_type === "category") {
        essenceObj['category'] = attribute.value;
      } else if (attribute.trait_type === "thumbnailHash") {
        essenceObj['thumbnailHash'] = attribute.value;
      }else if (attribute.trait_type === "livepeer_id") {
        essenceObj['hash'] = attribute.value;
      }
    });

    return essenceObj;};


export const pinFileToIPFS = async (file: any) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  //we gather a local file for this example, but any valid readStream source will work here.
  let data = new FormData();
  data.append("file", file);
  //pinataOptions are optional
  const pinataOptions = JSON.stringify({
    cidVersion: 1,
    customPinPolicy: {
      regions: [
        {
          id: "FRA1",
          desiredReplicationCount: 1,
        },
        {
          id: "NYC1",
          desiredReplicationCount: 2,
        },
      ],
    },
  });
  data.append("pinataOptions", pinataOptions);

  return axios
    .post(url, data, {
      maxBodyLength: Infinity, //this is needed to prevent axios from erroring out with large files
      headers: {
        // @ts-ignore
        "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        pinata_api_key: apiKey,
        pinata_secret_api_key: apiSecret,
      },
    })
    .then(function (response) {
      return { ipfshash: response.data.IpfsHash };
      //handle response here
    })
    .catch(function (error) {
      //handle error here

      return { error: true };
    });
};

export const pinJSONToIPFS = async (json: { [key: string]: any }) => {
  const data = JSON.stringify(json);
  const url = "https://api.pinata.cloud/pinning/pinJSONToIPFS";

  return axios
    .post(url, data, {
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: apiKey,
        pinata_secret_api_key: apiSecret,
      },
    })
    .then((response) => response.data.IpfsHash)
    .catch((error) => {
      throw error;
    });
};

export const parseURL = (url: string) => {
  if (!url) return "";
  const str = url.substring(0, 4);

  if (str === "http") {
    return url;
  } else {
    return `https://gateway.pinata.cloud/ipfs/${url}`;
  }
};

export const getEssenceSVGData = () => {
  const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="350" height="350" viewBox="0 0 888 483.61099"><path d="M1,421.53481H888v-2H1c-.55228,0-1,.44772-1,1H0c0,.55228,.44771,1,1,1Z" fill="#3f3d56"/><path d="M406,438.53481c5,24,33.5-5.5,33.5-5.5l34-4s21.5,.5,35.5,11.5,23.5-3.5,23.5-3.5c15.77283,5.2576,35.09692,5.23627,51.83264,3.55252,24.11597-2.42627,43.44604-21.04041,46.76044-45.05038,18.69678-135.44147-84.09314-202.00211-84.09314-202.00211l-30-81s9.5-23.5,12.5-44.5-19-41-46-61c-11.8125-8.75-25.34766-8.12109-36.83716-4.64502-12.88892,3.89946-24.13214,11.9183-32.4397,22.51616-6.88251,8.77995-18.68735,21.21468-31.66315,23.36885-4.48999,.73999-8.91998,2.52002-13.06,5.76001-4.28003,3.34998-6.16998,8.94-6.22998,15.89001-.32001,30.35999,24.75,66.90998,46.72998,72.60999,27,7,12.5,73.5,12.5,73.5-44,62-13,131-13,131l-8,56s-.5,11.5,4.5,35.5l.00006-.00003Z" fill="#3f3d56"/><path d="M553,309.53481l-11,137s15,38-36,36-21-80-21-80l16-102" fill="#3f3d56"/><path d="M509.79492,483.61099c-1.24707,0-2.52344-.02539-3.83398-.07715-11.29004-.44238-19.60352-4.60059-24.71094-12.3584-14.60254-22.18164,1.63867-65.90625,2.77832-68.89941l15.9834-101.89648c.08594-.5459,.59375-.91309,1.14355-.83301,.54492,.08594,.91797,.59766,.83301,1.14355l-16,102c-.01172,.06934-.0293,.1377-.05469,.2041-.1748,.45215-17.25195,45.55566-3.01172,67.18359,4.73242,7.18652,12.50977,11.04199,23.11719,11.45801,16.65234,.64941,27.85254-2.90332,33.29785-10.56836,7.12402-10.02832,1.78711-23.92676,1.73242-24.06641-.05566-.1416-.07812-.29492-.06641-.44629l11-137c.04395-.5498,.5166-.95117,1.07715-.91699,.55078,.04492,.96094,.52637,.91699,1.07715l-10.98242,136.77539c.72656,1.96094,5.28223,15.4043-2.03906,25.72363-5.41699,7.63574-15.89844,11.49707-31.18066,11.49707Z" fill="#2f2e41"/><path d="M462,337.53481s3,127-60,124-6-43-6-43l5.5-15.5" fill="#3f3d56"/><path d="M404.16211,462.58657c-.73145,0-1.4668-.01758-2.20996-.05273-17.98828-.85645-28.15186-4.88672-30.20801-11.97852-3.7041-12.7793,20.43945-30.52148,23.41895-32.65332l5.39453-15.20117c.18457-.52148,.75586-.79297,1.27637-.6084s.79297,.75586,.6084,1.27637l-5.5,15.5c-.06934,.19629-.19824,.36523-.36816,.48438-.26367,.18555-26.37744,18.68457-22.90869,30.64551,1.79248,6.18066,11.34131,9.72559,28.38232,10.53711,11.34863,.5459,21.29688-3.27051,29.55078-11.3291,30.95215-30.21582,29.4209-110.83789,29.40137-111.64844-.0127-.55176,.42383-1.00977,.97656-1.02344,.52246,.00098,1.00977,.4248,1.02344,.97656,.0791,3.3457,1.57227,82.29785-30.00293,113.125-8.12793,7.93555-17.82031,11.9502-28.83496,11.9502Z" fill="#2f2e41"/><path d="M363.27002,69.92484c7.17999,.85999,18.41998,.81995,27.72998-5.39001,9.96997-6.65002-.38-12.85004-8.44-16.26001-4.48999,.73999-8.91998,2.52002-13.06,5.76001-4.28003,3.34998-6.16998,8.94-6.22998,15.89001Z" fill="#2f2e41"/><path d="M479.2984,51.94393s-17.44968-44.81639,7.54245-45.4435,44.73257,38.20994,44.73257,38.20994c0,0,62.72797,114.34248-23.21378,108.17637-85.94171-6.16615-44.87375-51.81067-44.87375-51.81067,0,0,19.60165-24.09928,15.81253-49.13211h-.00003v-.00002h0Z" fill="#2f2e41"/><path d="M575.03857,386.85064c11.06787,4.92365,22.63171,9.948,34.73578,9.46738s24.84155-8.27557,26.72772-20.24146c.97363-6.17697-.95746-12.80396,1.40759-18.59268,3.18213-7.78867,13.44672-10.79233,21.42578-8.12323s13.84076,9.55188,18.04358,16.84058c7.86328,13.63672,11.0141,31.53461,2.58307,44.82779-7.30878,11.52368-21.17084,16.73105-34.06519,21.19748-17.17535,5.94928-36.35114,11.854-52.99396,4.54617-16.7381-7.34964-25.85565-28.58435-19.65753-45.7821" fill="#3f3d56"/><path d="M538.1142,170.92143s22,11,11,23-79,46-104,41-31-20-31-24,1.88583-52.38661,9.88583-50.38661,58.11417,47.38661,114.11417,10.38661Z" fill="#EB5757"/></svg>
    `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

export const getSubscriberSVGData = () => {
  const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="350" height="350" viewBox="0 0 888 342.09037"  backgroundColor="#fdf5f2"><path d="M560.17353,337.74452l-141.49021-4.01703s10.64948-63.71004-23.51937-81.39458c-23.2902-12.05805-43.96498-68.39325-38.08171-106.71786,.07639-.51339,.15956-1.01984,.24984-1.51935,2.98313-17.1642,11.50282-30.45026,27.7859-34.0579,52.65828-11.6556,90.24049-2.61558,90.24049-2.61558,0,0,8.70007,.11111,21.59063,2.53224,.45784,.08334,.91584,.17345,1.38062,.27067,36.49292,7.15295,103.94255,32.61478,106.86352,123.01483,4.01687,124.20117-45.01972,104.50456-45.01972,104.50456Z" fill="#3f3d56"/><path d="M496.94911,109.95447c-.23595,6.48-1.70685,12.91833-4.3917,19.0445-5.56416,12.68933-15.70041,22.38147-28.54219,27.29334-38.45655,14.72224-83.34432,.11806-106.04491-15.71413-.09028,.4995-1.89392,9.98611-1.97031,10.4995,10.05292,6.87534,59.24219,13.51225,68.57355,13.51225,14.16701,0,27.8069-2.35185,39.94117-7.00017,13.18883-5.05077,23.59559-15.00646,29.31236-28.03591,2.72652-6.21627,4.23198-12.75166,4.50265-19.32872-.46478-.09722-.92279-.18734-1.38062-.27067Z" fill="#EB5757"/><path d="M507.41196,118.20499l-22.55432-56.70799s27.06518-46.39745,5.79968-51.55272c-21.2655-5.15527-43.17541,22.55432-43.17541,22.55432,0,0-40.59777-14.177-56.06359-2.57764,0,0-25.77636-36.08691-41.24218-28.99841-15.46582,7.0885,5.49524,58.17995,5.49524,58.17995,0,0-31.91601,46.85873-7.42846,73.9239,24.48754,27.06518,116.63804,48.97509,159.16903-14.82141Z" fill="#3f3d56"/><path d="M1,336.07768H888s0-2,0-2H1c-.55228,0-1,.44771-1,1H0c0,.55229,.44771,1,1,1Z" fill="#3f3d56"/><path d="M555.78296,303.8031c7.67872,3.41594,15.7015,6.90177,24.09913,6.56832,8.39763-.33344,17.23466-5.74145,18.54324-14.04319,.67551-4.28548-.66427-8.88317,.97655-12.89931,2.2077-5.40365,9.32913-7.48754,14.86485-5.63576,5.53573,1.85179,9.60248,6.62694,12.51835,11.68373,5.45541,9.46093,7.64139,21.87821,1.79208,31.1008-5.0707,7.99495-14.68796,11.60773-23.63386,14.70646-11.91599,4.12752-25.21981,8.2241-36.76632,3.15406-11.6126-5.09906-17.93822-19.83135-13.63807-31.76289" fill="#3f3d56"/><path d="M428.73625,92.7071s-13.87567-5.55027-22.89486,1.38757l10.40676,15.95702,12.48811-17.34459Z" fill="#EB5757"/><path d="M355.88896,165.55439l25.67,136.67539s-38.85189,39.54567,11.10054,38.85189c49.95243-.69378,35.38297-26.36378,35.38297-26.36378l-15.95702-118.63701" fill="#3f3d56"/><path d="M391.39893,342.09037c-13.52734,0-21.70996-3.10107-24.32861-9.2251-4.77002-11.15576,10.75732-28.16797,13.41895-30.96631l-17.26074-102.18262,1.97168-.33301,17.42969,103.18262-.35742,.36426c-.17969,.18311-17.93994,18.44922-13.36279,29.1499,2.35059,5.49609,10.32129,8.19385,23.73633,8.00146,18.64697-.25879,30.67188-4.1665,34.77441-11.29932,3.69434-6.42383-.2085-13.50146-.24854-13.57227l-.09424-.16748-.02637-.19141-11.10059-82.56006,1.98242-.2666,11.07617,82.37842c.65674,1.24756,4.10889,8.45801,.15576,15.35693-4.52832,7.90234-16.80566,12.04834-36.4917,12.32178-.42969,.00586-.85449,.00879-1.27441,.00879Z" fill="#2f2e41"/><path d="M421.10463,165.55439l25.67,136.67539s-38.85189,39.54567,11.10054,38.85189c49.95243-.69378,35.38297-26.36378,35.38297-26.36378l-15.95702-118.63701" fill="#3f3d56"/><path d="M456.61426,342.09037c-13.52734,0-21.70947-3.10107-24.32812-9.2251-4.76562-11.14453,10.72607-28.13477,13.41016-30.95801l-10.31152-54.99609,1.96582-.36816,10.50293,56.01514-.36572,.37207c-.17969,.18311-17.93994,18.44922-13.3623,29.1499,2.35107,5.49561,10.32617,8.2041,23.73584,8.00146,18.6626-.25928,30.69092-4.17236,34.78467-11.31641,3.69238-6.44434-.21729-13.4834-.25732-13.55371l-.0957-.16846-15.98291-118.82861,1.98242-.2666,15.93262,118.45508c.65674,1.24756,4.10889,8.45801,.15576,15.35693-4.52832,7.90234-16.80615,12.04834-36.49219,12.32178-.42969,.00586-.85449,.00879-1.27441,.00879Z" fill="#2f2e41"/></svg>
    `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

export const timeout = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const timeSince = (date: any) => {
  let seconds = Math.floor(((new Date() as any) - date) / 1000);
  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + "y";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + "mo";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + "d";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + "h";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + "m";
  }
  return Math.floor(seconds) + "s";
};

export const formatDate = (date: any) => {
  return format(new Date(date), "MMM d, yyyy");
};

export const pollRelayActionStatus = async (relayActionId: string) => {
  const res = await fetch(
    "https://api.cyberconnect.dev/testnet/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "X-API-KEY": "3Oc2eWR771lttA7KoHYGEstNboFZqKVi",
      },
      body: JSON.stringify({
        query: `query relayActionStatus($relayActionId: ID!) {
      relayActionStatus(relayActionId: $relayActionId){ 
      ... on RelayActionStatusResult {
      txHash
      }
      ... on RelayActionError {
      reason
      }
      ... on RelayActionQueued {
      reason
      }
      }
      }
          `,
        variables: {
          relayActionId,
        },
      }),
    }
  );

  const resData = await res.json();

  return resData.data.relayActionStatus;
};

