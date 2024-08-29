import { use } from 'react';
import Link from 'next/link';
import styles from '../../page.module.css';

const defaultEndpoint = "https://rickandmortyapi.com/api/character";

interface CharacterProps {
  params: {
    id: string;
  };
}

async function fetchCharacterData(id: string) {
  const res = await fetch(`${defaultEndpoint}/${id}`, { next: { revalidate: 10 } });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

export default function Character({ params }: CharacterProps) {
  const { id } = params;
  const data = use(fetchCharacterData(id));

  if (!data) {
    return <div>Loading...</div>;
  }

  const { name, image, gender, location, origin, species, status } = data;

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>{name}</h1>

      <div className={styles.profile}>
        <div className={styles.profile_image}>
          <img src={image} alt={name} />
        </div>
        <div className={styles.profile_details}>
          <h2>Character Details</h2>
          <ul>
            <li><strong>Name:</strong> {name}</li>
            <li><strong>Status:</strong> {status}</li>
            <li><strong>Gender:</strong> {gender}</li>
            <li><strong>Species:</strong> {species}</li>
            <li><strong>Location:</strong> {location?.name || 'Unknown'}</li>
            <li><strong>Originally From:</strong> {origin?.name || 'Unknown'}</li>
          </ul>
        </div>
      </div>

      <p className={styles.back}>
        <Link href='/'>
          <button>Back to All Characters</button>
        </Link>
      </p>
    </main>
  );
}
