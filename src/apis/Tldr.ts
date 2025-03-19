export interface Highlight {
  videoUrl: string;
  videoThumbnail: string;
  title: string;
  game: string;
  timestamp: number;
  channel_name: string;
  videoId: string;
  kind: string;
  boringCount?: number;
  fireCount?: number;
  shrugCount?: number;
}

export const getHighlights = async (
  id: string
): Promise<Highlight[]> => {
  try {
    const endpoint = process.env.REACT_APP_TLDR_ENDPOINT;
    const url = `${endpoint}/highlights/${id.toLowerCase()}`;
    const response = await fetch(url);
    const highlights = await response.json();
    return highlights;
  } catch (err) {
    console.error(`Failed to get Highlights for ${id} due to ${err}`);
  }
  return [];
};

export const verifyUser = async (
  channelName: string
) : Promise<Boolean> => {
  try {
    const endpoint = process.env.REACT_APP_TLDR_ENDPOINT;
    const url = `${endpoint}/user/verify/${channelName}`;
    const response = await fetch(url);
    const user = await response.json();
    if (user) {
      return true;
    }
    return false;
  } catch (err) {
    console.error(`Failed to get user for ${channelName} due to ${err}`)
  }
  return false;
}
