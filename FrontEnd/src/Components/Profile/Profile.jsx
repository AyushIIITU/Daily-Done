import { useEffect, useState } from "react";
import GitHubHeatmap from "./GitHubHeatMap";
import { useParams } from "react-router-dom";
import EditableProfile from "./EditableProfile";
import axios from "axios";
import { API } from "../../Utils/API";
import ViewProfile from "./ViewProfile";

const user = JSON.parse(localStorage.getItem("user"));

function Profile() {
  const { profileName } = useParams();
  const [editable, setEditable] = useState(false);
  const [userData, setUserData] = useState({
    name: "UserNotFound",
    skills: [],
    avatar: "/notFound.svg",
  });

  useEffect(() => {
    const isEditable = user?.name === profileName;
    setEditable(isEditable);

    const fetchProfileDetails = async () => {
      try {
        const response = await axios.get(`${API}/api/user/profile/${profileName}`);
        setUserData(prevState => ({
          ...prevState,
          ...response.data,
          id: isEditable ? user?.id : response.data.id
        }));
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchProfileDetails();
  }, [profileName]);

  return editable ? (
    <EditableProfile userData={userData} />
  ) : (
    <ViewProfile userData={userData} />
  );
}

export default Profile;
