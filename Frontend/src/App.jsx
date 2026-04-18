import { AuthProvider } from "./features/auth/auth.context.jsx";
import { RouterProvider } from "react-router";
import { router } from "./app.routes";
import "./features/shared/style/global.scss";

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
