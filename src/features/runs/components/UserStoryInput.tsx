"use client";

interface UserStoryInputProps {
  story: string;
  updateStory: (value: string) => void;
  storyError: string;
}

export function UserStoryInput({
  story,
  updateStory,
  storyError,
}: UserStoryInputProps) {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor="input-story">
        <span className="material-icons-round">auto_stories</span>
        User Story
      </label>
      <p className="form-hint">
        Describe the user journey in natural language. The agent will
        interpret these instructions.
      </p>
      <textarea
        id="input-story"
        className={`form-textarea${storyError ? " form-input-error" : ""}`}
        placeholder="User tries to log in with valid credentials, navigates to the dashboard, and verifies their profile information is displayed correctly..."
        rows={6}
        value={story}
        onChange={(e) => updateStory(e.target.value)}
        aria-invalid={Boolean(storyError)}
        aria-describedby={storyError ? "input-story-error" : undefined}
      ></textarea>
      {storyError && (
        <span className="field-error" id="input-story-error">
          <span className="material-icons-round">error_outline</span>
          {storyError}
        </span>
      )}
    </div>
  );
}