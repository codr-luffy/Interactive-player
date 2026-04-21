import { AuthProvider } from "./features/auth/auth.context.jsx";
import { RouterProvider } from "react-router";
import { router } from "./app.routes";
import "./features/shared/style/global.scss";
import { SongContextProvider } from "./features/home/song.context.jsx";

function App() {
  return (
    <AuthProvider>
      <SongContextProvider>
        <RouterProvider router={router} />
      </SongContextProvider>
    </AuthProvider>
  );
}

export default App;
