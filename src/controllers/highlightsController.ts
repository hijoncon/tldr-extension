import { getHighlights, Highlight } from "../apis/Tldr";

export interface HighlightsParam {
  game: string;
  channelId: string;
  startedAt: number;
}

export const getProcessedHighlights = async ({
  game,
  channelId,
  startedAt
}: HighlightsParam): Promise<Highlight[]> => {
  try {
    const endpoint = process.env.REACT_APP_TLDR_ENDPOINT;
    const highlights = await getHighlights(channelId);
    const result: Highlight[] = highlights.map((highlight: any) => {
      return {
        ...highlight,
        game: game,
        videoUrl: `${endpoint}/player?video_id=${highlight.videoId}`,
      };
    });
    return result;
  } catch (error) {
    console.error(`Failed to fetch highlights due to:${error}`);
  }
  return [];
};
