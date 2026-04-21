import { createContext } from "react";
import { useState } from "react";

export const SongContext = createContext();

export const SongContextProvider = ({ children }) => {
  const [song, setSong] = useState({
    url: "https://ik.imagekit.io/luffycodr/modify/songs/The_Weeknd_-_Starboy_ft._Daft_Punk__Official_Video__ft._Daft_Punk_fdFcqTtzeI.mp3",
    posterUrl:
      "https://ik.imagekit.io/luffycodr/modify/posters/The_Weeknd_-_Starboy_ft._Daft_Punk__Official_Video__ft._Daft_Punk_4zTqs1zp3A.jpg",
    title: "The Weeknd - Starboy ft. Daft Punk (Official Video) ft. Daft Punk",
    mood: "happy",
  });
  const [loading, setLoading] = useState(false);

  return (
    <SongContext.Provider value={{ loading, setLoading, song, setSong }}>
      {children}
    </SongContext.Provider>
  );
};
