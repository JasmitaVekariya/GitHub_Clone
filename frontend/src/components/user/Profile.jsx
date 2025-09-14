// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import Navbar from "../Navbar";
// import HeatMapProfile from "./HeatMap";
// import "./Profile.css";
// import { useAuth } from "../../authContext";
// import { UnderlineNav } from "@primer/react";
// import { BookIcon, RepoIcon } from "@primer/octicons-react";

// const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

// const Profile = () => {
//   const navigate = useNavigate();
//   const [userDetails, setUserDetails] = useState({ username: "Username" });
//   const [repositories, setRepositories] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [togglingIds, setTogglingIds] = useState([]); // repo ids currently toggling
//   const [followersCount, setFollowersCount] = useState(0);
//   const [isFollowing, setIsFollowing] = useState(false);

//   const { setCurrentUser } = useAuth();

//   const userId = localStorage.getItem("userId"); // profile being viewed (in this case, logged-in user)
//   const token = localStorage.getItem("token");
//   const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

//   // Axios instance
//   const api = axios.create({
//     baseURL: API_BASE,
//     headers: {
//       "Content-Type": "application/json",
//       ...authHeader,
//     },
//   });

//   useEffect(() => {
//     const fetchUserDetails = async () => {
//       if (!userId) return;
//       try {
//         const res = await api.get(`/userProfile/${userId}`);
//         const user = res.data?.user ?? res.data ?? {};
//         setUserDetails(user);
//         setFollowersCount(user.followers?.length || 0);

//         // Check if logged-in user is following this profile
//         const loggedInUserId = localStorage.getItem("userId");
//         if (user.followers?.includes(loggedInUserId)) {
//           setIsFollowing(true);
//         }
//       } catch (err) {
//         console.error("Cannot fetch user details:", err);
//         setError("Unable to load user details");
//       }
//     };

//     const fetchRepositories = async () => {
//       if (!userId) return;
//       try {
//         setLoading(true);
//         const res = await api.get(`/repo/user/${userId}`);
//         console.log("repos response:", res.status, res.data);

//         let raw = res.data?.repositories ?? res.data?.repos ?? res.data ?? [];
//         if (!Array.isArray(raw)) {
//           raw = Object.values(raw);
//         }

//         const normalized = raw.map((r) => ({
//           ...r,
//           _id: r._id || r.id,
//           isStarred: r.isStarred ?? r.starred ?? false,
//         }));

//         setRepositories(normalized);
//       } catch (err) {
//         console.error("Error while fetching repositories:", err);
//         setError("Failed to load repositories");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserDetails();
//     fetchRepositories();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [userId]);

//   // Toggle star (optimistic UI update + revert on failure)
//   const toggleStar = async (repoId, currentIsStarred) => {
//     try {
//       setTogglingIds((prev) => [...prev, repoId]);

//       const res = await api.post("/star", { userId, repoId });
//       console.log("Star response:", res.data);

//       const finalIsStarred = res.data.isStarred;

//       setRepositories((prev) =>
//         prev.map((repo) =>
//           repo._id === repoId ? { ...repo, isStarred: finalIsStarred } : repo
//         )
//       );
//     } catch (err) {
//       console.error("Error toggling star:", err);
//       setError("Failed to toggle star");
//     } finally {
//       setTogglingIds((prev) => prev.filter((id) => id !== repoId));
//     }
//   };

//   // Follow/unfollow toggle
//   const handleFollowToggle = async () => {
//     try {
//       const loggedInUserId = localStorage.getItem("userId");
//       const res = await api.post("/follow", {
//         currentUserId: loggedInUserId,
//         targetUserId: userId,
//       });
//       setFollowersCount(res.data.followersCount);
//       setIsFollowing(res.data.isFollowing);
//     } catch (err) {
//       console.error("Follow error:", err);
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="underline-nav">
//         <UnderlineNav aria-label="Repository">
//           <UnderlineNav.Item
//             aria-current="page"
//             icon={BookIcon}
//             sx={{
//               backgroundColor: "transparent",
//               color: "white",
//               "&:hover": { textDecoration: "underline", color: "white" },
//             }}
//           >
//             Overview
//           </UnderlineNav.Item>
//           <UnderlineNav.Item
//             onClick={() => navigate("/profile/starred")}
//             icon={RepoIcon}
//             sx={{
//               backgroundColor: "transparent",
//               color: "whitesmoke",
//               "&:hover": { textDecoration: "underline", color: "white" },
//             }}
//           >
//             Starred Repositories
//           </UnderlineNav.Item>
//         </UnderlineNav>
//       </div>

//       <div className="profile-container">
//         {/* LEFT SIDEBAR */}
//         <div className="profile-sidebar">
//           <div className="profile-image">
//             <img
//               src={userDetails.profilePicture || "https://avatars.githubusercontent.com/u/583231?v=4"}
//               alt="Profile"
//             />
//           </div>
//           <h2 className="username">{userDetails.username}</h2>
//           <p className="user-email">{userDetails.email}</p>
//           <p className="user-bio">{userDetails.bio}</p>

//           {/* Follow/Unfollow button */}
//           <button className="follow-btn" onClick={handleFollowToggle}>
//             {isFollowing ? "Unfollow" : "Follow"}
//           </button>
//           <p className="followers-count">{followersCount} Followers</p>

//           <button
//             className="edit-profile-btn"
//             onClick={() => navigate(`/user/update/${userId}`)}
//           >
//             Edit Profile
//           </button>
//         </div>

//         {/* RIGHT SECTION */}
//         <div className="profile-main">
//           <div className="popular-repos">
//             <h3>User Repositories</h3>
//             {loading && <p>Loading repositories...</p>}
//             {error && <p className="error-message">{error}</p>}
//             <div className="repos-grid">
//               {repositories.length > 0 ? (
//                 repositories.map((repo) => (
//                   <div
//                     className="repo-card"
//                     key={repo._id}
//                     onClick={() => navigate(`/repository/${repo._id}`)}
//                   >
//                     <h4 className="repo-title">{repo.name}</h4>
//                     <p className="repo-description">
//                       {repo.description || "No description provided"}
//                     </p>
//                     <span className="repo-language">
//                       {repo.language || "Unknown"}
//                     </span>
//                   </div>
//                 ))
//               ) : (
//                 !loading && <p>No repositories found.</p>
//               )}
//             </div>
//           </div>

//           {/* HEATMAP */}
//           <div className="heatmap-wrapper">
//             <h3>Contribution activity</h3>
//             <HeatMapProfile />
//           </div>
//         </div>

//         {/* LOGOUT BUTTON */}
//         <button
//           onClick={() => {
//             localStorage.removeItem("token");
//             localStorage.removeItem("userId");
//             setCurrentUser(null);
//             window.location.href = "/auth";
//           }}
//           className="logout-btn"
//         >
//           Logout
//         </button>
//       </div>
//     </>
//   );
// };

// export default Profile;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";
import HeatMapProfile from "./HeatMap";
import "./Profile.css";
import { useAuth } from "../../authContext";
import { UnderlineNav } from "@primer/react";
import { BookIcon, RepoIcon } from "@primer/octicons-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";


const Profile = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({ username: "Username" });
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [togglingIds, setTogglingIds] = useState([]); // repo ids currently toggling
  const { setCurrentUser } = useAuth();

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  // Axios instance
  const api = axios.create({
    baseURL: API_BASE,
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
    },
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId) return;
      try {
        const res = await api.get(`/userProfile/${userId}`);
        // server may return user object directly or a wrapper:
        setUserDetails(res.data?.user ?? res.data ?? {});
      } catch (err) {
        console.error("Cannot fetch user details:", err);
        setError("Unable to load user details");
      }
    };

    const fetchRepositories = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        const res = await api.get(`/repo/user/${userId}`);
        console.log("repos response:", res.status, res.data);

        // Accept different shapes: { repositories: [...] } or [...] or { repos: [...] }
        let raw = res.data?.repositories ?? res.data?.repos ?? res.data ?? [];
        if (!Array.isArray(raw)) {
          // sometimes backend returns object keyed by id; convert to array
          raw = Object.values(raw);
        }

        // Normalize each repo: ensure _id and isStarred exist
        const normalized = raw.map((r) => ({
          ...r,
          _id: r._id || r.id,
          isStarred: r.isStarred ?? r.starred ?? false,
        }));

        setRepositories(normalized);
      } catch (err) {
        console.error("Error while fetching repositories:", err);
        setError("Failed to load repositories");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
    fetchRepositories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]); // api/authHeader not included to avoid re-running; base assumptions: token stored beforehand

  // Toggle star (optimistic UI update + revert on failure)
  const toggleStar = async (repoId, currentIsStarred) => {
  try {
    setTogglingIds((prev) => [...prev, repoId]);

    const res = await api.post("/star", { userId, repoId });
    console.log("Star response:", res.data);

    const finalIsStarred = res.data.isStarred;

    setRepositories((prev) =>
      prev.map((repo) =>
        repo._id === repoId ? { ...repo, isStarred: finalIsStarred } : repo
      )
    );
  } catch (err) {
    console.error("Error toggling star:", err);
    setError("Failed to toggle star");
  } finally {
    setTogglingIds((prev) => prev.filter((id) => id !== repoId));
  }
};

  return (
    <>
      <Navbar />
      <div className="underline-nav">
        <UnderlineNav aria-label="Repository">
          <UnderlineNav.Item
            aria-current="page"
            icon={BookIcon}
            sx={{
              backgroundColor: "transparent",
              color: "white",
              "&:hover": { textDecoration: "underline", color: "white" },
            }}
          >
            Overview
          </UnderlineNav.Item>
          <UnderlineNav.Item
            onClick={() => navigate("/profile/starred")}
            icon={RepoIcon}
            sx={{
              backgroundColor: "transparent",
              color: "whitesmoke",
              "&:hover": { textDecoration: "underline", color: "white" },
            }}
          >
            Starred Repositories
          </UnderlineNav.Item>
        </UnderlineNav>
      </div>

      <div className="profile-container">
        {/* LEFT SIDEBAR */}
        <div className="profile-sidebar">
          <div className="profile-image">
            <img
              src="https://avatars.githubusercontent.com/u/583231?v=4"
              alt="Profile"
            />
          </div>
          <h2 className="username">{userDetails.username}</h2>
          <p className="user-email">{userDetails.email}</p>
          <p className="user-bio">{userDetails.bio}</p>
          <button
            className="edit-profile-btn"
            onClick={() => navigate(`/user/update/${userId}`)}
          >
            Edit Profile
          </button>
        </div>

        {/* RIGHT SECTION */}
        <div className="profile-main">
          <div className="popular-repos">
            <h3>User Repositories</h3>
            {loading && <p>Loading repositories...</p>}
            {error && <p className="error-message">{error}</p>}
            <div className="repos-grid">
              {repositories.length > 0 ? (
                repositories.map((repo) => (
                  <div
                    className="repo-card"
                    key={repo._id}
                    onClick={() => navigate(`/repository/${repo._id}`)}
                  >
                    <h4 className="repo-title">{repo.name}</h4>
                    <p className="repo-description">
                      {repo.description || "No description provided"}
                    </p>
                    <span className="repo-language">{repo.language || "Unknown"}</span>

                    
                  </div>
                ))
              ) : (
                !loading && <p>No repositories found.</p>
              )}
            </div>
          </div>

          {/* HEATMAP */}
          <div className="heatmap-wrapper">
            <h3>Contribution activity</h3>
            <HeatMapProfile />
          </div>
        </div>

        {/* LOGOUT BUTTON */}
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            setCurrentUser(null);
            window.location.href = "/auth";
          }}
          className="logout-btn"
        >
          Logout
        </button>
      </div>
    </>
  );
};

export default Profile; 