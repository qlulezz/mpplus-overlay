import styles from "./Avatar.module.css";

interface AvatarProps {
  id: string;
}

const SS_CDN = "https://cdn.scoresaber.com/avatars";

export default function Avatar({ id }: AvatarProps) {
  // Multiplayer+ stores Oculus and Steam IDs similar to ScoreSaber
  // Use Oculus icon by default, switch to Steam avatar if detected
  const isSteamId = id.startsWith("76561") && id.length === 17;
  const url = `${SS_CDN}/${id}.jpg`;

  // Replace the image url with default Steam '?' avatar if something breaks
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = isSteamId
      ? `${SS_CDN}/steam.png`
      : `${SS_CDN}/oculus.png`;
  };

  return (
    <img src={url} alt="" className={styles.avatar} onError={handleError} />
  );
}
