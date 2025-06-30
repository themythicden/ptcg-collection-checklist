import { useEffect, useState } from 'react';

const API_KEY = 'b2c1c990-395b-4ff2-a6d3-c5c458aa6e31';

export default function useSetLogos() {
  const [logos, setLogos] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogos() {
      try {
        const res = await fetch('https://api.pokemontcg.io/v2/sets', {
          headers: {
            'X-Api-Key': API_KEY
          }
        });
        const json = await res.json();
        const mapped = {};
        json.data.forEach(set => {
          if (set.id && set.images?.logo) {
            mapped[set.id] = set.images.logo;
          }
        });
        setLogos(mapped);
      } catch (err) {
        console.error('Failed to fetch set logos:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchLogos();
  }, []);

  return { logos, loading };
}