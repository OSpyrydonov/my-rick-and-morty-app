import ClientComponent from './ClientComponent';

const defaultEndpoint = "https://rickandmortyapi.com/api/character";

async function fetchData() {
  const res = await fetch(defaultEndpoint);
  if (!res.ok) {
    throw new Error("Не вдалося отримати дані");
  }
  return res.json();
}

export default async function DataFetcher() {
  const data = await fetchData();
  
  return (
    <ClientComponent initialData={data} />
  );
}
