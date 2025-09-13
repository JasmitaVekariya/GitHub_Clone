import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";

const styles = {
  container: {
    backgroundColor: "#0d1117",
    minHeight: "100vh",
    color: "#c9d1d9",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  },
  form: {
    background: "#161b22",
    border: "1px solid #30363d",
    borderRadius: "6px",
    padding: "20px",
    maxWidth: "500px",
    width: "100%",
  },
  input: {
    width: "100%",
    margin: "10px 0",
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #30363d",
    background: "#0d1117",
    color: "#c9d1d9",
  },
  button: {
    marginTop: "15px",
    padding: "8px 16px",
    borderRadius: "6px",
    border: "none",
    background: "#238636",
    color: "white",
    fontSize: "14px",
    cursor: "pointer",
  },
  preview: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "10px",
  },
};

const UpdateUserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = id || localStorage.getItem("userId");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    bio: "",
    profilePicture: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:3000/user/userProfile/${userId}`);
        if (!res.ok) throw new Error("Failed to load user");
        const data = await res.json();
        setFormData({
          email: data.email || "",
          password: "",
          bio: data.bio || "",
          profilePicture: data.profilePicture || "",
        });
      } catch (err) {
        console.error(err);
      }
    };
    if (userId) fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Convert uploaded image to base64 string for now
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, profilePicture: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3000/user/update/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to update user");
      navigate("/profile");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <form style={styles.form} onSubmit={handleSubmit}>
          <h2>Edit Profile</h2>

          {/* Profile Picture Preview */}
          {formData.profilePicture && (
            <img
              src={formData.profilePicture}
              alt="Profile Preview"
              style={styles.preview}
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={styles.input}
          />

          <input
            style={styles.input}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Update Email"
          />
          <input
            style={styles.input}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Update Password"
          />
          <textarea
            style={styles.input}
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Update Bio"
          />
          <button type="submit" style={styles.button}>
            Save Changes
          </button>
        </form>
      </div>
    </>
  );
};

export default UpdateUserProfile;

// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import Navbar from "../Navbar";

// const styles = {
//   container: {
//     backgroundColor: "#0d1117",
//     minHeight: "100vh",
//     color: "#c9d1d9",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     padding: "20px",
//     fontFamily:
//       '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
//   },
//   form: {
//     background: "#161b22",
//     border: "1px solid #30363d",
//     borderRadius: "6px",
//     padding: "20px",
//     maxWidth: "500px",
//     width: "100%",
//   },
//   input: {
//     width: "100%",
//     margin: "10px 0",
//     padding: "8px",
//     borderRadius: "6px",
//     border: "1px solid #30363d",
//     background: "#0d1117",
//     color: "#c9d1d9",
//   },
//   button: {
//     marginTop: "15px",
//     padding: "8px 16px",
//     borderRadius: "6px",
//     border: "none",
//     background: "#238636",
//     color: "white",
//     fontSize: "14px",
//     cursor: "pointer",
//   },
// };

// const UpdateUserProfile = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const userId = id || localStorage.getItem("userId");

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     bio: "",
//   });

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await fetch(`http://localhost:3000/user/userProfile/${userId}`);
//         if (!res.ok) throw new Error("Failed to load user");
//         const data = await res.json();
//         setFormData({
//           email: data.email || "",
//           password: "",
//           bio: data.bio || "",
//         });
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     if (userId) fetchUser();
//   }, [userId]);

//   const handleChange = (e) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await fetch(`http://localhost:3000/user/update/${userId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });
//       if (!res.ok) throw new Error("Failed to update user");
//       navigate("/profile");
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div style={styles.container}>
//         <form style={styles.form} onSubmit={handleSubmit}>
//           <h2>Edit Profile</h2>
//           <input
//             style={styles.input}
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             placeholder="Update Email"
//           />
//           <input
//             style={styles.input}
//             type="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             placeholder="Update Password"
//           />
//           <textarea
//             style={styles.input}
//             name="bio"
//             value={formData.bio}
//             onChange={handleChange}
//             placeholder="Update Bio"
//           />
//           <button type="submit" style={styles.button}>
//             Save Changes
//           </button>
//         </form>
//       </div>
//     </>
//   );
// };

// export default UpdateUserProfile;
