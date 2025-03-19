export interface TwitchUser {
  id: string;
  login: string;
  display_name: string;
  type: string;
  broadcaster_type: string;
  description: string;
  profile_image_url: string;
  offline_image_url: string;
  view_count: number;
  email: string;
  created_at: string;
}

export const fetchBroadcasterInfo = async (
  auth: TwitchAuth
): Promise<TwitchUser | null> => {
  try {
    const response = await fetch(
      `https://api.twitch.tv/helix/users?id=${auth.channelId}`,
      {
        headers: {
          "Client-ID": auth.clientId,
          // Note we need to use Extension here instead of Bearer
          Authorization: `Extension ${auth.helixToken}`,
        },
      }
    );

    const data = await response.json();
    if (data.data && data.data.length > 0) {
      return data.data[0];
    } else {
      console.error("No channel name found");
    }
  } catch (error) {
    console.error("Error fetching channel name:", error);
  }
  return null;
};

export interface StreamMetadata {
  id: string;
  user_id: string;
  user_login: string;
  user_name: string;
  game_id: string;
  game_name: string;
  type: string;
  title: string;
  tags: string[];
  viewer_count: number;
  started_at: string;
  language: string;
  thumbnail_url: string;
  tag_ids: any[];
  is_mature: boolean;
}

export const fetchMetadata = async (auth: TwitchAuth): Promise<StreamMetadata | null> => {
  try{
    const response = await fetch(
      `https://api.twitch.tv/helix/streams?user_id=${auth.channelId}`,
      {
        headers: {
          "Client-ID": auth.clientId,
          // Note we need to use Extension here instead of Bearer
          Authorization: `Extension ${auth.helixToken}`,
        },
      }
    );
    const data = await response.json();
    if(data.data && data.data.length > 0) {
      return data.data[0] ?? null;
    }
  } catch(error) {
    console.error(`Error fetching channel metadata:${error}`)
  }
  return null;
}
