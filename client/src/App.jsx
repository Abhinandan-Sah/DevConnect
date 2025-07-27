import { useEffect } from "react"
import { useLocation, BrowserRouter, Route, Routes } from "react-router-dom"
import { Provider } from "react-redux"
import appStore from "./utils/appStore"
import Body from "./components/Body"
import Feed from "./components/Feed"
import Login from "./components/Login"
import Profile from "./components/Profile"
import Connections from "./components/Connections"
import Requests from "./components/Requests"
import Chat from "./components/Chat"

function GoogleAnalytics() {
  const location = useLocation()
  useEffect(() => {
    if (window.gtag) {
      window.gtag("config", "G-SVFF278VQ9", {
        page_path: location.pathname,
      })
    }
  }, [location])
  return null
}

function App() {
  return (
    <>
      <Provider store={appStore}>
        <BrowserRouter basename="/">
          <GoogleAnalytics />
          <Routes>
            <Route path="/" element={<Body />}>
              <Route path="/" element={<Feed />} />
              <Route path="/login" element={<Login />} />
              {/* <Route path='/feed' element={<Feed />} /> */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/connections" element={<Connections />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/chat/:targetUserId" element={<Chat />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  )
}

export default App