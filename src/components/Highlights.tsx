import { Highlight } from "../apis/Tldr";

const formatTime = (time: number) => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;
  return `${hours}:${minutes}:${seconds}`;
};



export const HighlightComponent = (highlight: Highlight) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.open(highlight.videoUrl, '_blank', 'noopener,noreferrer');
  };
  const handleReaction = (e: React.MouseEvent<HTMLButtonElement>, type: string) => {
    e.stopPropagation();
    e.preventDefault();
    // TODO: Implement reaction logic here
    console.log(`Reacted with ${type}`);
  };
  return (
    <div className="flex h-fit max-h-20 w-full rounded-md hover:backdrop-blur-lg transition duration-100 p-2">
        <a className="flex w-full gap-x-2" 
          href={highlight.videoUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          onClick={handleClick}
        >
        <img
          src={highlight.videoThumbnail}
          alt="Video Thumbnail"
          className="w-32 h-fit max-h-16 object-cover"
        />
        <div className="flex-1 flex flex-col justify-between gap-y-1 text-xs">
          <div className="font-medium">{highlight.title}</div>
          <div className="flex justify-between text-secondaryText">
            <div>{highlight.kind}</div>
            <div>{formatTime(highlight.timestamp)}</div>
          </div>
          {/* <div className="flex gap-x-4 text-xs">
            <button 
              className="flex items-center gap-x-1 hover:bg-gray-200 rounded px-1 py-0.5 transition duration-150"
              onClick={(e) => handleReaction(e, 'boring')}
            >
              <span className="text-base">😐</span> {highlight.boringCount ?? 0}
            </button>
            <button 
              className="flex items-center gap-x-1 hover:bg-gray-200 rounded px-1 py-0.5 transition duration-150"
              onClick={(e) => handleReaction(e, 'shrug')}
            >
              <span className="text-base">🤷</span> {highlight.shrugCount ?? 0}
            </button>
            <button 
              className="flex items-center gap-x-1 hover:bg-gray-200 rounded px-1 py-0.5 transition duration-150"
              onClick={(e) => handleReaction(e, 'fire')}
            >
              <span className="text-base">🔥</span> {highlight.fireCount ?? 0}
            </button>
          </div> */}
        </div>
      </a>
    </div>
  );
};
