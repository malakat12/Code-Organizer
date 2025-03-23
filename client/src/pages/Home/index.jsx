import React, { useEffect, useState } from "react";
import { request } from "../../utils/remote/axios";
import { requestMethods } from "../../utils/enums/request.methods";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import "./style.css";

const Home = () => {
  const navigate = useNavigate();

  const [snippets, setSnippets] = useState([]);
  const [newSnippet, setNewSnippet] = useState({ title: "", language: "", code: "", tags: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(()=>{
    getSnippets();
  },[]);

  const getSnippets = async () =>{
    const token =localStorage.getItem('token');
    if (!token) {
      console.error("User ID not found. User might not be logged in.");
      return;
    }
    try {
    const response = await request({
      method: requestMethods.GET,
      route: "/snippets",
      token,
    });
    console.log("API Response:", response);
    if (response.success && Array.isArray(response.snippets)) {
      setSnippets(response.snippets);
    } else {
      setSnippets([]); 
    }  } catch (error) {
      console.error("Failed to fetch snippets:", error);
    }
  }

  const handleAddSnippet = async () => {
    const token =localStorage.getItem('token');
    if (!token) {
      console.error("User ID not found. User might not be logged in.");
      return;
    }
    try {
      const payload = {
        title: newSnippet.title,
        language: newSnippet.language,
        code: newSnippet.code,
        tags: newSnippet.tags
        ? newSnippet.tags.split(",").map(tag => tag.trim()) // Convert string to array
        : [],
      };
      console.log("Payload:", JSON.stringify(payload, null, 2));
      const response = await request({
        method: requestMethods.POST,
        route: "/snippets",
        token,
        body: payload,
      });
      console.log("API Response:", response);
      if (response.status === "success" && response.data?.snippet) {
        setSnippets((prev) => [...prev, response.data.snippet]);
        console.log("Snippet added successfully:", response.data.snippet);

      } else {
        console.error("Unexpected response structure:", response);
      } 
      setNewSnippet({ title: "", language: "", code: "", tags: "" }); 
      setShowUploadModal(false);
    } catch (error) {
      console.error("Failed to add snippet:", error);
    }
  };

  const handleSearch = async () => {
    const token =localStorage.getItem('token');
    if (!token) {
      console.error("User not authenticated");
      return;
    }
    try {
      const response = await request({
        method: requestMethods.GET,
        route: "/snippets/search",
        token,
        params: { q: searchQuery },
      });
      if(!response){
        console.log(response);
        navigate("/");
      }
      setSnippets(response.snippets || []); 
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const deleteSnippet = async (id) => {
    const token =localStorage.getItem('token');
    if (!token) {
      console.error("User not authenticated");
      return;
    }
    const response = await request({
      method: requestMethods.DELETE,
      route: `/snippets/${id}`,
      token,
    });
    console.log("Deleted snippet:", response);
    setSnippets((prevSnippets) => prevSnippets.filter((snippet) => snippet.id !== id));  
  };

  const toggleFavorite = async (id) => {
    const token =localStorage.getItem('token');
    if (!token) {
      console.error("User not authenticated");
      return;
    }
    const response = await request({
      method: requestMethods.POST,
      route: `/snippets/favorite/${id}`,
      token
    });
  };


  return (
    <div>
      <h1>Code Snippet</h1>
      <button
      onClick={() =>{
        setShowUploadModal(true);
        setNewSnippet({ title: "", language: "", code: "", tags: ""  });
      } } 
      >Add New Snippet</button>
      <br></br>
      <input
        type="text"
        placeholder="Search snippets..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={handleSearch}>
        Search
      </button>
      <ul>
        {snippets
  ?.filter(snippet => snippet && snippet.title) // Ensure valid objects
  .map((snippet) =>(
          <li key={snippet.id}>
            <h2>{snippet.title}</h2>
            <code>
              {snippet.code}
            </code><br></br>
            {snippet.tags.map(tag => (
              <span key={tag.id}>{tag.name}  </span>
            ))}<br></br>
            <button onClick={() => toggleFavorite(snippet.id)}>
              {snippet.is_favorite ? "★ " : "☆ "}
            </button>
            <button onClick={() => deleteSnippet(snippet.id)}>Delete</button>
          </li>
        ))}
      </ul>
      {showUploadModal && (
      <div>
        <input
          type="text"
          placeholder="Title"
          value={newSnippet.title}
          onChange={(e) => setNewSnippet({ ...newSnippet, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Language"
          value={newSnippet.language}
          onChange={(e) => setNewSnippet({ ...newSnippet, language: e.target.value })}
        />
        <textarea
          placeholder="Code..."
          value={newSnippet.code}
          onChange={(e) => setNewSnippet({ ...newSnippet, code: e.target.value })}
        />
        <input
          type="text"
          placeholder="Tags (comma-separated)"
          value={newSnippet.tags}
          onChange={(e) => setNewSnippet({ ...newSnippet, tags: e.target.value })}
        />
        <button onClick={handleAddSnippet} >
          Add Snippet
        </button>    
        <button
        onClick={() => {
          setShowUploadModal(false);
          setNewSnippet({ title: "", language: "", code: "", tags: "" });
        }}
        className="close-button"
        >
        Cancel
      </button>
      </div>)}
    </div>
  );
};

export default Home;
