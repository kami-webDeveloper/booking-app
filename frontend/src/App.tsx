import { Navigate, Route, Routes } from "react-router";
import Layout from "./layouts/Layout";
import Register from "./pages/Register";
import { AppContextProvider } from "./context/AppContext";
import Signin from "./pages/Signin";
import PublicOnlyRoute from "./components/PublicOnlyRoute";
import AddHotel from "./pages/AddHotel";
import ProtectedRoute from "./components/ProtectedRoute";
import MyHotels from "./pages/MyHotels";
import EditHotel from "./pages/EditHotel";
import { SearchContextProvider } from "./context/SearchContext";
import Search from "./pages/Search";
import HotelDetail from "./components/HotelDetail";
import Booking from "./pages/Booking";

const App = () => {
  return (
    <AppContextProvider>
      <SearchContextProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<p>Home Page</p>} />
            <Route
              path="/register"
              element={
                <PublicOnlyRoute>
                  <Register />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/sign-in"
              element={
                <PublicOnlyRoute>
                  <Signin />
                </PublicOnlyRoute>
              }
            />
            <Route path="/search" element={<Search />} />
            <Route path="/detail/:id" element={<HotelDetail />} />
            <Route
              path="/hotel/:id/booking"
              element={
                <ProtectedRoute>
                  <Booking />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-hotel"
              element={
                <ProtectedRoute>
                  <AddHotel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-hotels"
              element={
                <ProtectedRoute>
                  <MyHotels />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-hotels/edit/:id"
              element={
                <ProtectedRoute>
                  <EditHotel />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </SearchContextProvider>
    </AppContextProvider>
  );
};

export default App;
