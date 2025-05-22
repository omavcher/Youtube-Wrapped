export const getCurrentYear = () => new Date().getFullYear();

export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const getRandomEmoji = () => {
  const emojis = ['🎬', '🎥', '📱', '💻', '🎮', '🎯', '🚀', '🔥', '💫', '⭐'];
  return emojis[Math.floor(Math.random() * emojis.length)];
}; 