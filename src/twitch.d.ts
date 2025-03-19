interface Window {
  Twitch: {
    ext: {
      onContext(arg0: (context: any) => void): unknown;
      onAuthorized: (
        callback: (auth: TwitchAuth) => void
      ) => void;
    };
  };
}

interface TwitchAuth {
  channelId: string;
  channelName: string;
  clientId: string;
  token: string;
  helixToken: string;
  userId: string;
}
