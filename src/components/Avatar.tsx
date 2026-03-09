import styles from "./Avatar.module.css";

interface AvatarProps {
  id: string;
}

const SS_CDN = "https://cdn.scoresaber.com/avatars";

export default function Avatar({ id }: AvatarProps) {
  // Multiplayer+ stores Oculus and Steam IDs similar to ScoreSaber
  // Use Oculus icon by default, switch to Steam avatar if detected
  const isSteamId = id.startsWith("76561") && id.length === 17;
  const url = isSteamId ? `${SS_CDN}/${id}.jpg` : `${SS_CDN}/oculus.png`;

  // Replace the image url with default Steam '?' avatar if something breaks
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = `${SS_CDN}/steam.png`;
  };

  return (
    <img src={url} alt="" className={styles.avatar} onError={handleError} />
  );
}
