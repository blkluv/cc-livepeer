import React, { useContext, useEffect, useState } from "react";
import { Background, Video } from "../../components";
import { Header, Sidebar } from "../../layout";
import { apolloClient } from "../../clients";
import { GET_ALL_ESSENCE_VIDEOS } from "../../graphql";
import { essenceResponseToVideo } from "../../utils";
import { AuthContext } from "../../context/auth";
import { ESSENCE_APP_ID} from "../../constants";
export default function Home() {
  const [videos, setVideos] = useState<String[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);
  const [query, setQuery] = useState<String>("");
  const [category, setCategory] = useState<String>("");
  const { address } = useContext(AuthContext);


  const fetchVideos = async () => {
    setLoading(true);
    apolloClient.query({
      query: GET_ALL_ESSENCE_VIDEOS,
      variables: {
        appID: ESSENCE_APP_ID,
        me: address,
      },
      fetchPolicy: "network-only",
    }).then(({ data }) => {
      console.log("Videos", data);
      const parsedVideos = data.essenceByFilter.map((essence: any) => essenceResponseToVideo(essence));
      setVideos(parsedVideos);
      console.log("Parsed Videos", parsedVideos);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchVideos();
  }, [query, category]);

  return (
    <Background className="w-full">
      <div className="w-full flex flex-row">
        <Sidebar updateCategory={(category) => setCategory(category)} />
        <div className="flex-1 h-screen flex flex-col">
          <Header search={(text) => setQuery(text)} />
          <div className="flex flex-row flex-wrap">
            {loading ? (
              <>
                {Array(10)
                  .fill(0)
                  .map((_, index) => (
                    <div className="w-80">
                      <Loader />
                    </div>
                  ))}
              </>
            ) : (
              videos?.map((video: any) => (
                <Video video={video} horizontal={false} />
              ))
            )}
          </div>
        </div>
      </div>
    </Background>
  );
}

const Loader = () => {
  return (
    <div className="flex flex-col m-5 animate-pulse">
      <div className="w-full bg-gray-300 dark:bg-border-dark h-40 rounded-lg "></div>
      <div className="w-50 mt-3 bg-gray-300 dark:bg-border-dark h-6 rounded-md "></div>
      <div className="w-24 bg-gray-300 h-3 dark:bg-border-dark  mt-3 rounded-md "></div>
    </div>
  );
};
