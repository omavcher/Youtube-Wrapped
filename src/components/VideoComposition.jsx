import { AbsoluteFill, useCurrentFrame, interpolate, spring, Sequence, useVideoConfig, Audio } from 'remotion';
import { useEffect, useState } from 'react';

const VideoComposition = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const [wrappedData, setWrappedData] = useState(null);
  const [selectedSong, setSelectedSong] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem('wrappedData');
    if (data) {
      setWrappedData(JSON.parse(data));
    }
    // Randomly select one of the two songs
    const songs = [
      '/music/Energetic.mp3',
      '/music/oo.mp3',
      '/music/Modern.mp3'
    ];
    setSelectedSong(songs[Math.floor(Math.random() * songs.length)]);
  }, []);

  if (!wrappedData || !selectedSong) {
    return null;
  }

  const { channelInfo, topPlaylists, topVideo } = wrappedData;
  const [mostViewed, secondMost, thirdMost] = topPlaylists;

  // Calculate frame durations (30fps)
  const INTRO_DURATION = 4 * fps;
  const CHANNEL_OVERVIEW_DURATION = 6 * fps;
  const CONTENT_FOOTPRINT_DURATION = 8 * fps;
  const TRENDING_DURATION = 6 * fps;
  const ABOUT_SECTION_DURATION = 7 * fps;
  const COMMENTS_DURATION = 8 * fps;
  const SUBSCRIBE_SECTION_DURATION = 5 * fps;
  const GITHUB_STAR_DURATION = 15 * fps; // New GitHub star section duration

  // Enhanced star particles
  const stars = Array.from({ length: 100 }).map((_, i) => {
    const x = interpolate(frame + i * 10, [0, 180], [0, width], { extrapolateRight: 'clamp' });
    const y = interpolate(frame + i * 10, [0, 180], [0, height], { extrapolateRight: 'clamp' });
    const size = interpolate(frame + i * 10, [0, 45], [1, 3], { extrapolateRight: 'clamp' });
    const opacity = interpolate(frame + i * 10, [0, 22, 45], [0, 1, 0], { extrapolateRight: 'clamp' });
    const rotation = interpolate(frame + i * 10, [0, 180], [0, 360], { extrapolateRight: 'clamp' });
    return { x, y, size, opacity, rotation };
  });

  // Floating shapes
  const shapes = Array.from({ length: 20 }).map((_, i) => {
    const x = interpolate(Math.sin(frame * 0.02 + i) * 50, [-50, 50], [0, width], { extrapolateRight: 'clamp' });
    const y = interpolate(Math.cos(frame * 0.02 + i) * 50, [-50, 50], [0, height], { extrapolateRight: 'clamp' });
    const scale = interpolate(Math.sin(frame * 0.01 + i), [-1, 1], [0.5, 1.5], { extrapolateRight: 'clamp' });
    const rotation = interpolate(frame + i * 20, [0, 180], [0, 360], { extrapolateRight: 'clamp' });
    return { x, y, scale, rotation };
  });

  // Bouncing emojis
  const emojis = ['🚀', '🔥', '💫', '⭐', '✨', '🎬', '📱', '💻', '🎮', '🎯'];
  const bouncingEmojis = Array.from({ length: 15 }).map((_, i) => {
    const x = interpolate(frame + i * 15, [0, 180], [0, width], { extrapolateRight: 'clamp' });
    const y = interpolate(Math.sin(frame * 0.05 + i) * 50, [-50, 50], [0, height], { extrapolateRight: 'clamp' });
    const scale = interpolate(Math.sin(frame * 0.02 + i), [-1, 1], [0.8, 1.2], { extrapolateRight: 'clamp' });
    const rotation = interpolate(frame + i * 10, [0, 180], [0, 360], { extrapolateRight: 'clamp' });
    return { x, y, scale, rotation, emoji: emojis[i % emojis.length] };
  });

  // Counter animation
  const counterValue = interpolate(frame, [0, 30], [0, parseInt(channelInfo.subscribers)], { extrapolateRight: 'clamp' });

  // Subscriber badge function
  const getSubscriberBadge = (subscribers) => {
    const subCount = parseInt((subscribers || '').replace(/[^0-9]/g, '')) || 0;
    if (subCount >= 10000000) {
      return { type: 'diamond', image: '/playbutton/diamond.png', text: '10M+ Subscribers' };
    } else if (subCount >= 1000000) {
      return { type: 'gold', image: '/playbutton/gold.png', text: '1M+ Subscribers' };
    } else if (subCount >= 100000) {
      return { type: 'silver', image: '/playbutton/silver.png', text: '100K+ Subscribers' };
    }
    return null;
  };
  

  const subscriberBadge = getSubscriberBadge(channelInfo.subscribers);

  // Subscribe button color transition
  const buttonColor = interpolate(
    frame - (INTRO_DURATION + CHANNEL_OVERVIEW_DURATION + CONTENT_FOOTPRINT_DURATION + TRENDING_DURATION + ABOUT_SECTION_DURATION + COMMENTS_DURATION),
    [0, fps], // 1 second transition
    [0, 1], // From 0 to 1
    { extrapolateRight: 'clamp' }
  );
  const buttonBackground = buttonColor < 1 ? '#FF0000' : '#808080'; // Red to gray

  // GitHub star button animation
  const starButtonScale = spring({
    frame: frame - (INTRO_DURATION + CHANNEL_OVERVIEW_DURATION + CONTENT_FOOTPRINT_DURATION + TRENDING_DURATION + ABOUT_SECTION_DURATION + COMMENTS_DURATION + SUBSCRIBE_SECTION_DURATION),
    fps: 30,
    from: 0.8,
    to: 1,
    damping: 10,
  });

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Add Audio Component */}
      <Audio src={selectedSong} volume={0.5} />

      {/* Star particles */}
      {stars.map((star, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: star.x,
            top: star.y,
            width: star.size,
            height: star.size,
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '50%',
            opacity: star.opacity,
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
            transform: `rotate(${star.rotation}deg)`,
            transition: 'all 0.2s ease',
          }}
        />
      ))}

      {/* Floating shapes */}
      {shapes.map((shape, i) => (
        <div
          key={`shape-${i}`}
          style={{
            position: 'absolute',
            left: shape.x,
            top: shape.y,
            width: '20px',
            height: '20px',
            background: `linear-gradient(45deg, ${i % 2 === 0 ? '#FF0000' : '#FFD700'}, ${i % 2 === 0 ? '#FF6B6B' : '#4ECDC4'})`,
            borderRadius: i % 2 === 0 ? '50%' : '0',
            transform: `scale(${shape.scale}) rotate(${shape.rotation}deg)`,
            opacity: 0.3,
            filter: 'blur(1px)',
          }}
        />
      ))}

      {/* Bouncing emojis */}
      {bouncingEmojis.map((emoji, i) => (
        <div
          key={`emoji-${i}`}
          style={{
            position: 'absolute',
            left: emoji.x,
            top: emoji.y,
            fontSize: '2rem',
            transform: `scale(${emoji.scale}) rotate(${emoji.rotation}deg)`,
            filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))',
            zIndex: 1,
          }}
        >
          {emoji.emoji}
        </div>
      ))}

      {/* Intro Section */}
      <Sequence from={0} durationInFrames={INTRO_DURATION}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            opacity: spring({ frame: frame - 15, fps: 30, from: 0, to: 1 }),
          }}
        >
          <h1
            style={{
              fontSize: '7rem',
              fontWeight: '800',
              color: '#ffffff',
              margin: 0,
              background: 'linear-gradient(45deg, #FF0000, #FFD700)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 30px rgba(255, 0, 0, 0.5)',
              transform: `scale(${spring({ frame: frame - 15, fps: 30, from: 0.8, to: 1 })}) rotate(${interpolate(frame, [0, 30], [-5, 5], { extrapolateRight: 'clamp' })}deg)`,
            }}
          >
            YouTube Unwrapped 2025
          </h1>
          <p
            style={{
              fontSize: '3rem',
              color: '#ffffff',
              marginTop: '2rem',
              opacity: 0.8,
              transform: `translateY(${spring({ frame: frame - 30, fps: 30, from: 50, to: 0 })}px) rotate(${interpolate(frame, [0, 30], [-3, 3], { extrapolateRight: 'clamp' })}deg)`,
            }}
          >
            Your Year in Review 🎬
          </p>
        </div>
      </Sequence>

      {/* Channel Overview Section */}
      <Sequence from={INTRO_DURATION} durationInFrames={CHANNEL_OVERVIEW_DURATION}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            opacity: spring({ frame: frame - INTRO_DURATION, fps: 30, from: 0, to: 1 }),
          }}
        >
          <div
            style={{
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              margin: '0 auto',
              background: `url(${channelInfo.icon})`,
              backgroundSize: 'cover',
              boxShadow: '0 0 50px rgba(255, 0, 0, 0.4)',
              transform: `scale(${spring({ frame: frame - INTRO_DURATION, fps: 30, from: 0.5, to: 1 })}) rotate(${interpolate(frame - INTRO_DURATION, [0, 30], [0, 360], { extrapolateRight: 'clamp' })}deg)`,
              animation: 'pulse 2s infinite',
            }}
          />
          <h2
            style={{
              fontSize: '4rem',
              color: '#ffffff',
              marginTop: '2rem',
              textShadow: '0 0 20px rgba(255, 0, 0, 0.3)',
              transform: `translateY(${spring({ frame: frame - INTRO_DURATION - 15, fps: 30, from: 50, to: 0 })}px)`,
            }}
          >
            {channelInfo.name}
          </h2>
          <div
            style={{
              fontSize: '3rem',
              color: '#ffffff',
              marginTop: '1rem',
              background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {channelInfo.subscribers} subscribers
          </div>
          <div
            style={{
              fontSize: '2rem',
              color: '#ffffff',
              marginTop: '1rem',
              opacity: 0.8,
            }}
          >
            {channelInfo.totalViews} total views
          </div>
          {subscriberBadge && (
            <div
              style={{
                marginTop: '2rem',
                transform: `scale(${spring({ frame: frame - INTRO_DURATION - 30, fps: 30, from: 0.5, to: 1 })})`,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={subscriberBadge.image}
                alt={subscriberBadge.text}
                style={{
                  width: '1200px',
                  height: '1200px',
                  filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))',
                  marginBottom: '-20%',
                }}
              />
              <h2
                style={{
                  position: 'absolute',
                  top: subscriberBadge.type === 'gold' ? '68%' : subscriberBadge.type === 'diamond' ? '95%' : '70%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: '4rem',
                  color: subscriberBadge.type === 'gold' ? 'rgba(67, 1, 1, 0.78)' : subscriberBadge.type === 'diamond' ? 'rgb(47, 47, 47)' : 'rgb(49, 49, 49)',
                  zIndex: 1,
                  margin: 0,
                  textAlign: 'center',
                }}
              >
                {channelInfo.name}
              </h2>
            </div>
          )}
        </div>
      </Sequence>

      {/* Content Footprint Section */}
      <Sequence from={INTRO_DURATION + CHANNEL_OVERVIEW_DURATION} durationInFrames={CONTENT_FOOTPRINT_DURATION}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            opacity: spring({ frame: frame - (INTRO_DURATION + CHANNEL_OVERVIEW_DURATION), fps: 30, from: 0, to: 1 }),
          }}
        >
          <h2
            style={{
              fontSize: '4rem',
              color: '#ffffff',
              marginBottom: '3rem',
              textShadow: '0 0 20px rgba(255, 0, 0, 0.3)',
              transform: `scale(${spring({ frame: frame - (INTRO_DURATION + CHANNEL_OVERVIEW_DURATION), fps: 30, from: 0.8, to: 1 })})`,
              background: 'linear-gradient(45deg, #FF0000, #FFD700)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Your Top Playlists 🎬
          </h2>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4rem',
              alignItems: 'center',
              padding: '0 2rem',
            }}
          >
            {topPlaylists.map((playlist, index) => {
              const delay = index * 20;
              const progress = spring({ frame: frame - (INTRO_DURATION + CHANNEL_OVERVIEW_DURATION) - delay, fps: 30, from: 0, to: 1 });
              const bounce = spring({ frame: frame - (INTRO_DURATION + CHANNEL_OVERVIEW_DURATION) - delay, fps: 30, from: 0, to: 1, damping: 10 });
              const glowColor = index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32';
              return (
                <div
                  key={playlist.playlistId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3rem',
                    background: `linear-gradient(135deg, ${glowColor}15, rgba(255, 255, 255, 0.05))`,
                    padding: '2.5rem',
                    borderRadius: '30px',
                    width: '100%',
                    maxWidth: '1000px',
                    transform: `translateX(${interpolate(progress, [0, 1], [-100, 0])}px) scale(${1 + bounce * 0.03})`,
                    opacity: progress,
                    backdropFilter: 'blur(10px)',
                    boxShadow: `0 0 40px ${glowColor}40`,
                    border: `2px solid ${glowColor}40`,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `radial-gradient(circle at ${50 + Math.sin(frame * 0.02 + index) * 20}% ${50 + Math.cos(frame * 0.02 + index) * 20}%, ${glowColor}10 0%, transparent 70%)`,
                      opacity: 0.5,
                      transform: `scale(${1 + Math.sin(frame * 0.01 + index) * 0.1})`,
                    }}
                  />
                  <div
                    style={{
                      fontSize: '5rem',
                      fontWeight: 'bold',
                      color: glowColor,
                      width: '120px',
                      textAlign: 'center',
                      textShadow: `0 0 20px ${glowColor}80`,
                      transform: `rotate(${bounce * 10}deg) scale(${1 + Math.sin(frame * 0.02 + index) * 0.1})`,
                    }}
                  >
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '2rem',
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        position: 'relative',
                        transform: `scale(${1 + bounce * 0.05})`,
                      }}
                    >
                      <img
                        src={playlist.thumbnail}
                        alt={playlist.title}
                        style={{
                          width: '320px',
                          height: '220px',
                          objectFit: 'cover',
                          borderRadius: '15px',
                          boxShadow: `0 0 30px ${glowColor}40`,
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          top: '-15px',
                          right: '-15px',
                          background: `linear-gradient(45deg, ${glowColor}, ${glowColor}80)`,
                          color: 'white',
                          padding: '0.8rem 1.5rem',
                          borderRadius: '20px',
                          fontSize: '1.6rem',
                          fontWeight: 'bold',
                          boxShadow: `0 0 20px ${glowColor}40`,
                          transform: `rotate(${bounce * 15}deg)`,
                        }}
                      >
                        #{index + 1}
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1rem',
                      }}
                    >
                      <h3
                        style={{
                          fontSize: '2.5rem',
                          color: '#ffffff',
                          margin: 0,
                          textAlign: 'center',
                          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                          maxWidth: '400px',
                          lineHeight: '1.3',
                          transform: `translateY(${spring({ frame: frame - (INTRO_DURATION + CHANNEL_OVERVIEW_DURATION) - delay - 10, fps: 30, from: 20, to: 0 })}px)`,
                        }}
                      >
                        {playlist.title}
                      </h3>
                      <div
                        style={{
                          fontSize: '1.2rem',
                          color: '#ffffff',
                          opacity: 0.8,
                          transform: `translateY(${spring({ frame: frame - (INTRO_DURATION + CHANNEL_OVERVIEW_DURATION) - delay - 15, fps: 30, from: 20, to: 0 })}px)`,
                        }}
                      >
                        Playlist ID: {playlist.playlistId}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Sequence>

      {/* Trending Section */}
      <Sequence from={INTRO_DURATION + CHANNEL_OVERVIEW_DURATION + CONTENT_FOOTPRINT_DURATION} durationInFrames={TRENDING_DURATION}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            opacity: spring({ frame: frame - (INTRO_DURATION + CHANNEL_OVERVIEW_DURATION + CONTENT_FOOTPRINT_DURATION), fps: 30, from: 0, to: 1 }),
            width: '100%',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          {Array.from({ length: 15 }).map((_, i) => {
            const angle = (i * 24) + frame * 0.5;
            const radius = 300 + Math.sin(frame * 0.02 + i) * 50;
            const x = Math.cos(angle * Math.PI / 180) * radius;
            const y = Math.sin(angle * Math.PI / 180) * radius;
            const scale = 0.5 + Math.sin(frame * 0.01 + i) * 0.3;
            const opacity = 0.3 + Math.sin(frame * 0.015 + i) * 0.2;
            return (
              <div
                key={`bg-${i}`}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: `translate(${x}px, ${y}px) scale(${scale})`,
                  width: '20px',
                  height: '20px',
                  background: `linear-gradient(45deg, #FF0000, #FFD700)`,
                  borderRadius: '50%',
                  opacity: opacity,
                  filter: 'blur(2px)',
                  zIndex: 0,
                }}
              />
            );
          })}
          {['🚀', '🔥', '💫', '⭐', '✨'].map((emoji, i) => {
            const x = interpolate(frame + i * 30, [0, 300], [-20, 100], { extrapolateRight: 'clamp' });
            const y = interpolate(Math.sin(frame * 0.02 + i) * 50, [-50, 50], [20, 80], { extrapolateRight: 'clamp' });
            const scale = interpolate(Math.sin(frame * 0.01 + i), [-1, 1], [0.8, 1.2], { extrapolateRight: 'clamp' });
            const rotation = interpolate(frame + i * 20, [0, 180], [0, 360], { extrapolateRight: 'clamp' });
            return (
              <div
                key={`emoji-${i}`}
                style={{
                  position: 'absolute',
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: `scale(${scale}) rotate(${rotation}deg)`,
                  fontSize: '4rem',
                  filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))',
                  zIndex: 1,
                }}
              >
                {emoji}
              </div>
            );
          })}
          <h2
            style={{
              fontSize: '4.5rem',
              color: '#ffffff',
              marginTop: '38rem',
              marginBottom: '1rem',
              textShadow: '0 0 20px rgba(255, 0, 0, 0.3)',
              transform: `scale(${spring({ frame: frame - (INTRO_DURATION + CHANNEL_OVERVIEW_DURATION + CONTENT_FOOTPRINT_DURATION), fps: 30, from: 0.8, to: 1 })})`,
              background: 'linear-gradient(45deg, #FF0000, #FFD700)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              position: 'relative',
              zIndex: 2,
            }}
          >
            Your Viral Hit {new Date().getFullYear()}! 🚀
          </h2>

         
          <div
            style={{
              position: 'relative',
              width: '800px',
              margin: '0 auto',
              transform: `scale(${spring({ frame: frame - (INTRO_DURATION + CHANNEL_OVERVIEW_DURATION + CONTENT_FOOTPRINT_DURATION), fps: 30, from: 0.8, to: 1 })})`,
              zIndex: 2,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                position: 'relative',
                borderRadius: '30px',
                overflow: 'hidden',
                boxShadow: '0 0 50px rgba(255, 0, 0, 0.4)',
                transform: `rotate(${interpolate(Math.sin(frame * 0.02), [-1, 1], [-2, 2])}deg)`,
                border: '4px solid rgba(255, 255, 255, 0.2)',
                width: '100%',
                height: '450px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <img
                src={topVideo.thumbnail}
                alt={topVideo.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform: `scale(${1 + Math.sin(frame * 0.01) * 0.02})`,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
                  padding: '3rem',
                  borderRadius: '0 0 30px 30px',
                }}
              >
                <h3
                  style={{
                    color: '#ffffff',
                    fontSize: '2.5rem',
                    margin: '0 0 1rem 0',
                    textShadow: '0 0 10px rgba(255, 0, 0, 0.3)',
                    transform: `translateY(${spring({ frame: frame - (INTRO_DURATION + CHANNEL_OVERVIEW_DURATION + CONTENT_FOOTPRINT_DURATION) - 15, fps: 30, from: 50, to: 0 })}px)`,
                  }}
                >
                  {topVideo.title}
                </h3>
                <div
                  style={{
                    display: 'flex',
                    gap: '2rem',
                    justifyContent: 'center',
                    marginTop: '1.5rem',
                  }}
                >
                  {[
                    { icon: '👁️', value: topVideo.views, label: 'Views' },
                    { icon: '❤️', value: topVideo.likes, label: 'Likes' },
                    { icon: '💬', value: topVideo.comments, label: 'Comments' },
                  ].map((stat, index) => (
                    <div
                      key={stat.label}
                      style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        padding: '1.5rem 2.5rem',
                        borderRadius: '20px',
                        backdropFilter: 'blur(5px)',
                        transform: `translateY(${spring({ frame: frame - (INTRO_DURATION + CHANNEL_OVERVIEW_DURATION + CONTENT_FOOTPRINT_DURATION) - (20 + index * 5), fps: 30, from: 50, to: 0 })}px) scale(${1 + Math.sin(frame * 0.02 + index) * 0.05})`,
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 0 20px rgba(255, 0, 0, 0.2)',
                      }}
                    >
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
                      <div style={{ fontSize: '2rem', color: '#ffffff', fontWeight: 'bold' }}>{stat.value}</div>
                      <div style={{ fontSize: '1.2rem', color: '#ffffff', opacity: 0.8 }}>{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Sequence>

      {/* About & Category Section */}
      <Sequence from={INTRO_DURATION + CHANNEL_OVERVIEW_DURATION + CONTENT_FOOTPRINT_DURATION + TRENDING_DURATION} durationInFrames={ABOUT_SECTION_DURATION}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            opacity: spring({ frame: frame - (INTRO_DURATION + CHANNEL_OVERVIEW_DURATION + CONTENT_FOOTPRINT_DURATION + TRENDING_DURATION), fps: 30, from: 0, to: 1 }),
            width: '100%',
            maxWidth: '1200px',
            padding: '0 2rem',
          }}
        >
          <h2
            style={{
              fontSize: '4rem',
              color: '#ffffff',
              marginBottom: '3rem',
              textShadow: '0 0 20px rgba(255, 0, 0, 0.3)',
              background: 'linear-gradient(45deg, #FF0000, #FFD700)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              transform: `scale(${spring({ frame: frame - (INTRO_DURATION + CHANNEL_OVERVIEW_DURATION + CONTENT_FOOTPRINT_DURATION + TRENDING_DURATION), fps: 30, from: 0.8, to: 1 })})`,
            }}
          >
            About & Category 🎯
          </h2>
          <div
            style={{
              display: 'flex',
              gap: '4rem',
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '3rem',
                borderRadius: '30px',
                backdropFilter: 'blur(10px)',
                transform: `scale(${spring({ frame: frame - (INTRO_DURATION + CHANNEL_OVERVIEW_DURATION + CONTENT_FOOTPRINT_DURATION + TRENDING_DURATION), fps: 30, from: 0.8, to: 1 })})`,
                border: '2px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 0 30px rgba(255, 0, 0, 0.2)',
                width: '300px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `radial-gradient(circle at ${50 + Math.sin(frame * 0.02) * 20}% ${50 + Math.cos(frame * 0.02) * 20}%, rgba(255, 0, 0, 0.1) 0%, transparent 70%)`,
                  opacity: 0.5,
                  transform: `scale(${1 + Math.sin(frame * 0.01) * 0.1})`,
                }}
              />
              <div style={{ fontSize: '5rem', marginBottom: '2rem', transform: `rotate(${interpolate(Math.sin(frame * 0.02), [-1, 1], [-5, 5])}deg)` }}>🎬</div>
              <div
                style={{
                  fontSize: '2.5rem',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  marginBottom: '1rem',
                  textShadow: '0 0 10px rgba(255, 0, 0, 0.3)',
                }}
              >
                Category
              </div>
              <div
                style={{
                  fontSize: '2rem',
                  color: '#ffffff',
                  opacity: 0.9,
                  background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  padding: '1rem',
                  borderRadius: '15px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                {channelInfo.category}
              </div>
            </div>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '3rem',
                borderRadius: '30px',
                backdropFilter: 'blur(10px)',
                transform: `scale(${spring({ frame: frame - (INTRO_DURATION + CHANNEL_OVERVIEW_DURATION + CONTENT_FOOTPRINT_DURATION + TRENDING_DURATION) - 10, fps: 30, from: 0.8, to: 1 })})`,
                border: '2px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 0 30px rgba(255, 0, 0, 0.2)',
                flex: 1,
                maxWidth: '600px',
                position: 'relative',
                overflow: 'hidden',
            }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `radial-gradient(circle at ${50 + Math.sin(frame * 0.02 + 1) * 20}% ${50 + Math.cos(frame * 0.02 + 1) * 20}%, rgba(255, 0, 0, 0.1) 0%, transparent 70%)`,
                  opacity: 0.5,
                  transform: `scale(${1 + Math.sin(frame * 0.01 + 1) * 0.1})`,
                }}
              />
              <div style={{ fontSize: '5rem', marginBottom: '2rem', transform: `rotate(${interpolate(Math.sin(frame * 0.02 + 1), [-1, 1], [-5, 5])}deg)` }}>📝</div>
              <div
                style={{
                  fontSize: '2.5rem',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  marginBottom: '1rem',
                  textShadow: '0 0 10px rgba(255, 0, 0, 0.3)',
                }}
              >
                About
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: '2rem',
                  marginBottom: '2rem',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    padding: '1rem 2rem',
                    borderRadius: '15px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    transform: `translateY(${spring({ frame: frame - (INTRO_DURATION + CHANNEL_OVERVIEW_DURATION + CONTENT_FOOTPRINT_DURATION + TRENDING_DURATION) - 15, fps: 30, from: 30, to: 0 })}px)`,
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌍</div>
                  <div
                    style={{
                      fontSize: '1.8rem',
                      color: '#ffffff',
                      fontWeight: 'bold',
                      background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {channelInfo.country === 'IN' ? 'India' : channelInfo.country}
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    padding: '1rem 2rem',
                    borderRadius: '15px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    transform: `translateY(${spring({ frame: frame - (INTRO_DURATION + CHANNEL_OVERVIEW_DURATION + CONTENT_FOOTPRINT_DURATION + TRENDING_DURATION) - 20, fps: 30, from: 30, to: 0 })}px)`,
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
                  <div
                    style={{
                      fontSize: '1.8rem',
                      color: '#ffffff',
                      fontWeight: 'bold',
                      background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {channelInfo.yearsOnYoutube}
                  </div>
                </div>
              </div>
              <div
                style={{
                  fontSize: '1.8rem',
                  color: '#ffffff',
                  opacity: 0.9,
                  lineHeight: '1.6',
                  textAlign: 'left',
                  whiteSpace: 'pre-line',
                  background: 'rgba(0, 0, 0, 0.2)',
                  padding: '2rem',
                  borderRadius: '15px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transform: `translateY(${spring({ frame: frame - (INTRO_DURATION + CHANNEL_OVERVIEW_DURATION + CONTENT_FOOTPRINT_DURATION + TRENDING_DURATION) - 25, fps: 30, from: 50, to: 0 })}px)`,
                }}
              >
                {channelInfo.about}
              </div>
            </div>
          </div>
        </div>
      </Sequence>

      {/* Comments Section */}
      <Sequence from={INTRO_DURATION + CHANNEL_OVERVIEW_DURATION + CONTENT_FOOTPRINT_DURATION + TRENDING_DURATION + ABOUT_SECTION_DURATION} durationInFrames={COMMENTS_DURATION}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            opacity: spring({ frame: frame - (INTRO_DURATION + CHANNEL_OVERVIEW_DURATION + CONTENT_FOOTPRINT_DURATION + TRENDING_DURATION + ABOUT_SECTION_DURATION), fps: 30, from: 0, to: 1 }),
            width: '100%',
            maxWidth: '1200px',
            padding: '0 2rem',
          }}
        >
          <h2
            style={{
              fontSize: '4rem',
              color: '#ffffff',
              marginBottom: '3rem',
              textShadow: '0 0 20px rgba(255, 0, 0, 0.3)',
              background: 'linear-gradient(45deg, #FF0000, #FFD700)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Top Comments 💬
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '2rem',
              justifyContent: 'center',
            }}
          >
            {topVideo.commentDetails.slice(0, 6).map((comment, index) => {
              const delay = index * 10;
              const progress = spring({ frame: frame - (INTRO_DURATION + CHANNEL_OVERVIEW_DURATION + CONTENT_FOOTPRINT_DURATION + TRENDING_DURATION + ABOUT_SECTION_DURATION) - delay, fps: 30, from: 0, to: 1 });
              return (
                <div
                  key={index}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '2rem',
                    borderRadius: '20px',
                    backdropFilter: 'blur(10px)',
                    transform: `translateY(${interpolate(progress, [0, 1], [50, 0])}px)`,
                    opacity: progress,
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 0 20px rgba(255, 0, 0, 0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img
                      src={comment.authorImage}
                      alt={comment.author}
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                      }}
                    />
                    <div>
                      <div style={{ color: '#ffffff', fontSize: '1.2rem', fontWeight: 'bold' }}>{comment.author}</div>
                      <div style={{ color: '#ffffff', opacity: 0.7, fontSize: '0.9rem' }}>{comment.publishedAt}</div>
                    </div>
                  </div>
                  <div
                    style={{
                      color: '#ffffff',
                      fontSize: '1.1rem',
                      lineHeight: '1.5',
                      textAlign: 'left',
                      wordBreak: 'break-word',
                    }}
                    dangerouslySetInnerHTML={{ __html: comment.text }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </Sequence>

      {/* Subscribe Section */}
      <Sequence
        from={INTRO_DURATION + CHANNEL_OVERVIEW_DURATION + CONTENT_FOOTPRINT_DURATION + TRENDING_DURATION + ABOUT_SECTION_DURATION + COMMENTS_DURATION}
        durationInFrames={SUBSCRIBE_SECTION_DURATION}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            opacity: spring({
              frame: frame - (INTRO_DURATION + CHANNEL_OVERVIEW_DURATION + CONTENT_FOOTPRINT_DURATION + TRENDING_DURATION + ABOUT_SECTION_DURATION + COMMENTS_DURATION),
              fps: 30,
              from: 0,
              to: 1,
            }),
            width: '100%',
            maxWidth: '1200px',
            padding: '0 2rem',
          }}
        >
          <h2
            style={{
              fontSize: '4rem',
              color: '#ffffff',
              marginBottom: '3rem',
              textShadow: '0 0 20px rgba(255, 0, 0, 0.3)',
              background: 'linear-gradient(45deg, #FF0000, #FFD700)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              transform: `scale(${spring({
                frame: frame - (INTRO_DURATION + CHANNEL_OVERVIEW_DURATION + CONTENT_FOOTPRINT_DURATION + TRENDING_DURATION + ABOUT_SECTION_DURATION + COMMENTS_DURATION),
                fps: 30,
                from: 0.8,
                to: 1,
              })})`,
            }}
          >
            Subscribe Now
          </h2>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2rem',
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '2rem',
              borderRadius: '20px',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 0 30px rgba(255, 0, 0, 0.2)',
              transform: `translateY(${spring({
                frame: frame - (INTRO_DURATION + CHANNEL_OVERVIEW_DURATION + CONTENT_FOOTPRINT_DURATION + TRENDING_DURATION + ABOUT_SECTION_DURATION + COMMENTS_DURATION) - 10,
                fps: 30,
                from: 50,
                to: 0,
              })}px)`,
            }}
          >
            <img
              src={channelInfo.icon}
              alt={channelInfo.name}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 0 20px rgba(255, 0, 0, 0.3)',
              }}
            />
            <div
              style={{
                fontSize: '2.5rem',
                color: '#ffffff',
                fontWeight: 'bold',
                textShadow: '0 0 10px rgba(255, 0, 0, 0.3)',
              }}
            >
              {channelInfo.name}
            </div>
            <div
              style={{
                background: buttonBackground,
                color: '#ffffff',
                padding: '1rem 2rem',
                borderRadius: '10px',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: `0 0 20px ${buttonBackground}40`,
                transform: `scale(${spring({
                  frame: frame - (INTRO_DURATION + CHANNEL_OVERVIEW_DURATION + CONTENT_FOOTPRINT_DURATION + TRENDING_DURATION + ABOUT_SECTION_DURATION + COMMENTS_DURATION) - 15,
                  fps: 30,
                  from: 0.8,
                  to: 1,
                })})`,
              }}
            >
              Subscribe
            </div>
          </div>
        </div>
      </Sequence>

      {/* GitHub Star Section */}
      <Sequence
        from={INTRO_DURATION + CHANNEL_OVERVIEW_DURATION + CONTENT_FOOTPRINT_DURATION + TRENDING_DURATION + ABOUT_SECTION_DURATION + COMMENTS_DURATION + SUBSCRIBE_SECTION_DURATION}
        durationInFrames={GITHUB_STAR_DURATION}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            opacity: spring({
              frame: frame - (INTRO_DURATION + CHANNEL_OVERVIEW_DURATION + CONTENT_FOOTPRINT_DURATION + TRENDING_DURATION + ABOUT_SECTION_DURATION + COMMENTS_DURATION + SUBSCRIBE_SECTION_DURATION),
              fps: 30,
              from: 0,
              to: 1,
            }),
            width: '100%',
            maxWidth: '1200px',
            padding: '0 2rem',
            background: 'linear-gradient(135deg, #0d1117 0%, #161b22 100%)', // GitHub dark theme
            borderRadius: '20px',
            boxShadow: '0 0 30px rgba(0, 0, 0, 0.5)',
          }}
        >
          <h2
            style={{
              fontSize: '4rem',
              color: '#ffffff',
              marginBottom: '3rem',
              textShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
              background: 'linear-gradient(45deg, #58a6ff, #c3e6cb)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              transform: `scale(${spring({
                frame: frame - (INTRO_DURATION + CHANNEL_OVERVIEW_DURATION + CONTENT_FOOTPRINT_DURATION + TRENDING_DURATION + ABOUT_SECTION_DURATION + COMMENTS_DURATION + SUBSCRIBE_SECTION_DURATION),
                fps: 30,
                from: 0.8,
                to: 1,
              })})`,
            }}
          >
            Star Us on GitHub
          </h2>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2rem',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '2rem',
              borderRadius: '12px',
              border: '1px solid #30363d', // GitHub border color
              boxShadow: '0 0 20px rgba(88, 166, 255, 0.2)',
              transform: `translateY(${spring({
                frame: frame - (INTRO_DURATION + CHANNEL_OVERVIEW_DURATION + CONTENT_FOOTPRINT_DURATION + TRENDING_DURATION + ABOUT_SECTION_DURATION + COMMENTS_DURATION + SUBSCRIBE_SECTION_DURATION) - 10,
                fps: 30,
                from: 50,
                to: 0,
              })}px)`,
            }}
          >
            {/* GitHub Logo */}
            <img
              src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
              alt="GitHub Logo"
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                border: '2px solid #30363d',
                boxShadow: '0 0 15px rgba(88, 166, 255, 0.3)',
              }}
            />
            {/* Repository Info */}
            <div
              style={{
                fontSize: '2.5rem',
                color: '#ffffff',
                fontWeight: 'bold',
                textShadow: '0 0 10px rgba(88, 166, 255, 0.3)',
              }}
            >
              your-repo/YouTube-Unwrapped
            </div>
            {/* Star Button */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: '#21262d', // GitHub button background
                color: '#c9d1d9', // GitHub text color
                padding: '1rem 2rem',
                borderRadius: '6px',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                border: '1px solid #30363d',
                boxShadow: '0 0 15px rgba(88, 166, 255, 0.3)',
                transform: `scale(${starButtonScale})`,
                transition: 'background 0.3s ease',
              }}
            >
              <span style={{ marginRight: '0.5rem' }}>⭐</span> Star
            </div>
          </div>
          {/* Call to Action Text */}
          <p
            style={{
              fontSize: '1.8rem',
              color: '#c9d1d9',
              marginTop: '2rem',
              opacity: 0.8,
              transform: `translateY(${spring({
                frame: frame - (INTRO_DURATION + CHANNEL_OVERVIEW_DURATION + CONTENT_FOOTPRINT_DURATION + TRENDING_DURATION + ABOUT_SECTION_DURATION + COMMENTS_DURATION + SUBSCRIBE_SECTION_DURATION) - 15,
                fps: 30,
                from: 50,
                to: 0,
              })}px)`,
            }}
          >
            Support our project by giving us a star on GitHub!
          </p>
        </div>
      </Sequence>

      {/* Keyframe animations */}
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
          }
          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </AbsoluteFill>
  );
};

export default VideoComposition;