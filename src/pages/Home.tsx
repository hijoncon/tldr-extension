import React, { useEffect, useState } from "react";
import Divider from "@mui/material/Divider";
import bg from "../bg.png";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { fetchBroadcasterInfo, fetchMetadata } from "../apis/StreamInfo";
import { HighlightComponent } from "../components/Highlights";
import { getHighlights, Highlight, verifyUser } from "../apis/Tldr";
import { getProcessedHighlights } from "../controllers/highlightsController";

const Home = () => {
  const [channelId, setChannelId] = useState<string | null>(null);
  const [channelName, setChannelName] = useState<string>("Channel Name");
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(bg);
  const [configChecked, setConfigChecked] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [streamId, setStreamId] = useState<string>("");
  const [authorized, setAuthorized] = useState<Boolean>(false);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [game, setGame] = useState<string>("Unknown");
  const [isConfig, setIsConfig] = useState<boolean>(false);
  const intervalDuration = 60 * 1000;

  useEffect(() => {
    if (window.Twitch) {
      window.Twitch.ext.onContext((context) => {
        if (context.mode === "config") {
          setIsConfig(true);
          setThumbnailUrl(bg);
        }
        setConfigChecked(true);
      });
    }
  }, []);

  useEffect(() => {
    // wait until config mode is checked
    if (!configChecked) {
      return;
    }

    // exit if inside config mode
    if (isConfig) {
      return;
    }

    const getChannelInfo = async (auth: TwitchAuth) => {
      try {
        const userInfo = await fetchBroadcasterInfo(auth);
        setChannelName(userInfo?.display_name || "Channel Name");
        setThumbnailUrl(userInfo?.profile_image_url ?? "");
        return userInfo?.display_name ?? "";
      } catch (err) {
        console.error(`Failed to set user info due to:${err}`);
      }
      return "";
    };

    const getUserInfo = async (channelName: string) => {
      const userVerificationStatus = await verifyUser(channelName);
      setAuthorized(userVerificationStatus);
    };

    const getStreamInfo = async (auth: TwitchAuth) => {
      let streamId = "";
      let timestamp = 0;
      let game = "";
      try {
        const metadata = await fetchMetadata(auth);
        game = metadata?.game_name ?? "Unknown";
        setGame(game);
        streamId = metadata?.id ?? "";
        setStreamId(streamId);
        const utcDate = metadata?.started_at ?? "";
        if (utcDate === "") {
          timestamp = new Date().getTime() / 1000;
        } else {
          timestamp = Math.floor(new Date(utcDate).getTime() / 1000);
        }
        setStartTime(timestamp);
      } catch (err) {
        console.error(`Failed to set Stream info due to:${err}`);
      }
      return {
        streamId: streamId,
        timestamp: timestamp,
        game: game,
      };
    };

    const loadHighlights = async (
      channelName: string,
      startTime: number,
      game: string
    ) => {
      const loadHighlightsSnapshot = async () => {
        try {
          const highlights = await getProcessedHighlights({
            game: game,
            channelId: channelName,
            startedAt: startTime,
          });
          setHighlights(highlights);
        } catch (err) {
          console.error(
            `Failed to fetch highlights for ${channelId} due to:${err}`
          );
        }
      };
      await loadHighlightsSnapshot();
      return setInterval(loadHighlightsSnapshot, intervalDuration);
    };

    let intervalId: NodeJS.Timer;

    if (window.Twitch) {
      window.Twitch.ext.onAuthorized(async (auth) => {
        setChannelId(auth.channelId);
        const { streamId, timestamp, game } = await getStreamInfo(auth);
        const channelName = await getChannelInfo(auth);
        intervalId = await loadHighlights(channelName, timestamp, game);
        getUserInfo(channelName);
      });
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isConfig, configChecked]);

  const HighlightsContent = (
    <div>
      <div className="text-lg font-semibold flex justify-center">
        {`Highlights for ${channelName}`}
      </div>
      <div className="flex flex-col h-80 overflow-y-auto">
        {highlights.length > 0 &&
          highlights.map((highlight, i) => {
            if (!highlight) {
              return null;
            }
            return (
              <div key={i}>
                <HighlightComponent {...highlight} />
                <Divider flexItem />
              </div>
            );
          })}
      </div>
    </div>
  );

  const LoginComponent = (
    <div className="h-[500px] flex flex-col align-middle justify-center items-center text-md">
      <span>To access the extension features,</span>
      <a
        className="underline-1 text-purple-500"
        href="https://dashboard.tl-dr.tv/auth/signup.html"
        target="_blank"
        rel="noopener noreferrer"
      >
        register here{" "}
      </a>
      <span>if not already registered</span>
    </div>
  );

  const NoAccessComponent = (
    <div className="h-[340px] flex justify-center items-center text-md p-2 pb-5">
      It seems that the streamer is not registered, visit the configuration page
      to register and access the features.
    </div>
  );

  if (isConfig) {
    // Render LoginComponent when in config mode
    return (
      <div
        className="h-full w-full bg-cover bg-center"
        style={{ background: `url(${thumbnailUrl})` }}
      >
        <div className="h-full bg-white/70 backdrop-blur-sm flex flex-col gap-y-2 p-2">
          {LoginComponent}
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-full w-full bg-cover bg-center"
      style={{ background: `url(${thumbnailUrl})` }}
    >
      <div className="h-full bg-white/70 backdrop-blur-sm flex flex-col gap-y-2 p-2">
        <div className="flex justify-between p-2">
          <img src="./logo.svg" height="30px" width="100px" alt="Logo" />
          <img
            className="rounded-lg"
            src={thumbnailUrl ?? "/logo192.png"}
            height="50px"
            width="50px"
            alt="Channel Thumbnail"
          />
        </div>
        {/* <div className="text-lg font-semibold flex justify-center">
          {`Highlights for ${channelName}`}
        </div> */}

        {authorized ? HighlightsContent : NoAccessComponent}

        <footer className="text-xs px-2 pt-2 flex justify-between items-center border-t border-gray-50">
          <div className="flex items-center space-x-1">
            <span>Are you a streamer?</span>
            <a
              className="font-semibold text-blue-600 hover:underline flex items-center"
              href="https://beta.tl-dr.tv"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get TLDR
              <ArrowForwardIcon fontSize="small" className="ml-1" />
            </a>
          </div>
          <div className="flex items-center">
            <Divider orientation="vertical" flexItem className="h-4" />
            <a
              href="https://tl-dr.tv"
              className="pl-2 hover:underline cursor-pointer"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit TL-DR.tv
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
