import React from 'react';
import { render, screen } from '@testing-library/react';
import { HighlightComponent } from './Highlights';
import { Highlight } from '../apis/Tldr';

// Test the formatTime function
describe('formatTime', () => {
  it('formats time correctly', () => {
    const { getByText } = render(<HighlightComponent 
      videoUrl="https://example.com" 
      videoThumbnail="https://example.com/thumbnail.jpg" 
      title="Test Video" 
      game="Test Game" 
      channel_name="Test Channel"
      videoId='TestID'
      kind='Voice'
      timestamp={3661} // 1 hour, 1 minute, 1 second
    />);
    expect(getByText('1:1:1')).toBeInTheDocument();
  });
});

// Test the Highlight component
describe('Highlight', () => {
  const defaultProps:Highlight = {
    videoUrl: 'https://example.com',
    videoThumbnail: 'https://example.com/thumbnail.jpg',
    title: 'Test Video',
    game: 'Test Game',
    channel_name: 'Test Channel',
    videoId: 'TestId',
    kind: 'Voice',
    timestamp: 3600, // 1 hour
  };

  it('renders correctly', () => {
    render(<HighlightComponent {...defaultProps} />);
    
    // Check if the link is rendered with correct href
    expect(screen.getByRole('link')).toHaveAttribute('href', defaultProps.videoUrl);
    
    // Check if the thumbnail is rendered
    expect(screen.getByAltText('Video Thumbnail')).toHaveAttribute('src', defaultProps.videoThumbnail);
    
    // Check if the video title is rendered
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    
    // Check if the game name is rendered
    expect(screen.getByText(defaultProps.game)).toBeInTheDocument();
    
    // Check if the formatted time is rendered
    expect(screen.getByText('1:0:0')).toBeInTheDocument();
  });

  it('opens link in new tab', () => {
    render(<HighlightComponent {...defaultProps} />);
    expect(screen.getByRole('link')).toHaveAttribute('target', '_blank');
    expect(screen.getByRole('link')).toHaveAttribute('rel', 'noopener noreferrer');
  });
});