import "../runDetails.css"

interface StoryBlockProps {
  story?: string | null;
}

export function StoryBlock({ story }: StoryBlockProps) {
  if (!story) return null;

  return (
    <div className="story-block">
      <div className="story-label">
        <span className="material-icons-round">menu_book</span>
        User Story
      </div>
      <p className="story-text">{story}</p>
    </div>
  );
}