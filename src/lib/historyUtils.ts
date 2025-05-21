
// Interface for animation history data
interface AnimationData {
  id: string;
  prompt: string;
  videoUrl: string;
  thumbnailUrl?: string;
  timestamp: string;
}

const HISTORY_STORAGE_KEY = 'visual-math-animator-history';

// Save prompt to local storage history
export const savePromptToHistory = (data: AnimationData): void => {
  try {
    // Get existing history
    const existingHistory = getAllPromptHistory();
    
    // Add new item to beginning of array
    const updatedHistory = [data, ...existingHistory];
    
    // Save to localStorage
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Error saving prompt to history:', error);
  }
};

// Get all prompt history
export const getAllPromptHistory = (): AnimationData[] => {
  try {
    const historyJson = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!historyJson) return [];
    
    return JSON.parse(historyJson) as AnimationData[];
  } catch (error) {
    console.error('Error retrieving prompt history:', error);
    return [];
  }
};

// Get a specific prompt from history by ID
export const getPromptFromHistory = (id: string): AnimationData | null => {
  try {
    const allHistory = getAllPromptHistory();
    const foundItem = allHistory.find(item => item.id === id);
    
    return foundItem || null;
  } catch (error) {
    console.error('Error retrieving specific prompt:', error);
    return null;
  }
};

// Clear all history
export const clearPromptHistory = (): void => {
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing prompt history:', error);
  }
};
