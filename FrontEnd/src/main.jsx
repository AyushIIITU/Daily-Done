import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./Components/Home/Home.jsx";
import Diary from "./Components/Diary/Diary.jsx";
import LoginIn from "./Components/Auth/LogIn.jsx";
import SignUp from "./Components/Auth/SignUp.jsx";
import Profile from "./Components/Profile/Profile.jsx";
import YoutubePlaylist from "./Components/MultiMediaPlaylist/YoutubePlaylist.jsx";
import Group from "./Components/Group/Group.jsx";
import TestTimer from "./Components/Group/TestTimer.jsx";
import CreateGroup from "./Components/Group/CreateGroup.jsx";
import GroupContainer from "./Components/Group/GroupContainer.jsx";
// import Profile from "./Components/Profile/Profile.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "diary",
        element: <Diary />,
      },
      {
        path:"profile",
        element:<Profile/>
      },
      {
        path:"group/timer",
        element:<Group/>
      }
      ,
      {
        path:"group",
        element:<TestTimer/>
      },{
        path:"cg",
        element:<CreateGroup/>
      },
      {
        path:"gg",
        element:<GroupContainer/>
      },
      {
        path:"yt",
        element:<YoutubePlaylist/>
      }
    ],
  },
  {
    path:"login",
    element:<LoginIn/>
  },
  {
    path: "/signup",
    element: <SignUp />,
  }
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <ThemeProvider/> */}
    <RouterProvider router={router} />
    <Toaster position="top-center" reverseOrder={false} />
  </React.StrictMode>
);