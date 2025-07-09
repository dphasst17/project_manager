import { BrowserRouter as Router, Routes, Route } from "react-router";
import { privateRoutes, publicRoutes } from "@/routes/route";
import Layout from "@/layouts/index";
import PrivateRoute from "@/private";
import "@/App.css"
import { useEffect } from "react";
import { analytics } from "@/libs/firebase";
function App() {
  useEffect(() => {
    if (analytics) {
      console.log("Firebase Analytics ready");
    }
  }, [analytics]);
  return<Router>
  <Routes>
    {publicRoutes.map((route: any) => {
      const Pages = route.component;
      return (
        <Route
          key={route.path}
          path={route.path}
          element={
            <Layout>
              <Pages />
            </Layout>
          }
        />
      );
    })}
    {privateRoutes.map((route: any) => {
      const Pages = route.component;
      return (
        <Route
          key={route.path}
          path={route.path}
          element={
            <PrivateRoute>
              <Layout>
                <Pages />
              </Layout>
            </PrivateRoute>
          }
        />
      );
    })}
  </Routes>
</Router>}

export default App
