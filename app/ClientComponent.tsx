"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Link from "next/link";

interface Character {
  id: number;
  name: string;
  image: string;
}

interface PageInfo {
  next?: string;
  prev?: string;
}

interface ClientComponentProps {
  initialData: {
    info: PageInfo;
    results: Character[];
  };
}

const defaultEndpoint = "https://rickandmortyapi.com/api/character";

export default function ClientComponent({ initialData }: ClientComponentProps) {
  const { info, results: defaultResults = [] } = initialData;
  const [results, updateResults] = useState<Character[]>(defaultResults);
  const [page, updatePage] = useState<PageInfo & { current: string }>({
    ...info,
    current: info.next ?? defaultEndpoint,
  });

  const { current } = page;

  useEffect(() => {
    if (current === defaultEndpoint) return;

    async function request() {
      const res = await fetch(current);
      const nextData: { info: PageInfo; results: Character[] } = await res.json();

      updatePage((prev) => ({
        ...prev,
        current,
        ...nextData.info,
      }));

      if (!nextData.info?.prev) {
        updateResults(nextData.results);
        return;
      }

      updateResults((prev) => [...prev, ...nextData.results]);
    }

    request();
  }, [current]);

  function handleLoadMore() {
    updatePage((prev) => ({
      ...prev,
      current: page?.next ?? defaultEndpoint,
    }));
  }

  function handleOnSubmitSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { currentTarget } = e;
    const formData = new FormData(currentTarget);
    const query = formData.get("query")?.toString() || "";

    if (!query || /[^a-zA-Z0-9 ]/.test(query)) {
      alert("Please enter a valid search query.");
      return;
    }

    const endpoint = `https://rickandmortyapi.com/api/character/?name=${query}`;

    updatePage({
      ...page,
      current: endpoint,
    });
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Rick and Morty</h1>

      <div className={styles.description}>
        <p>Персонажі Ріка і Морті</p>
      </div>

      <form className={styles.search} onSubmit={handleOnSubmitSearch}>
        <input name="query" type="search" />
        <button type="submit">Search</button>
      </form>

      <ul className={styles.grid}>
        {results.map(({ id, name, image }: Character) => (
          <li key={id} className={styles.card}>
            <Link href={`/character/${id}`}>
              <img src={image} alt={`${name} image`} />
              <h2>{name}</h2>
            </Link>
          </li>
        ))}
      </ul>

      <p>
        <button onClick={handleLoadMore}>Load More</button>
      </p>
    </main>
  );
}
