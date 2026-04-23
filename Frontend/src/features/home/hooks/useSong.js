import { getSong } from "../sevices/song.api.js";
import { useContext } from "react";
import { SongContext } from "../song.context";

export const useSong = () => {
  const context = useContext(SongContext);

  const { loading, setLoading, song, setSong } = context;

  async function handleGetSong({ mood }) {
    setLoading(true);
    const data = await getSong({ mood });
    console.log(data);
    console.log(data.songs[0]);
    setSong(data.songs);
    setLoading(false);
  }

  return { loading, song, handleGetSong };
};
