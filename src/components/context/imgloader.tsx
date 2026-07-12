import { useEffect, useState } from "react";

export const useImagePreloader = (imageUrls: string[]) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const promises = imageUrls.map(
      (url) =>
        new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.src = url;
          img.onload = () => resolve();
          img.onerror = () => reject();
        })
    );

    Promise.all(promises)
      .then(() => setLoaded(true))
      .catch(() => setLoaded(true));
  }, [imageUrls]);

  return loaded;
};