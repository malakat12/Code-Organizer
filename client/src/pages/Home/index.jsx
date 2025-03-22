import React, { useEffect, useState } from "react";
import { request } from "../../utils/remote/axios";
import { requestMethods } from "../../utils/enums/request.methods";

import "./style.css";

const Home = () => {

  const [snippets, setSnippets] = useState([]);

  useEffect(()=>{
    getSnippets();
  },[]);

  const getSnippets = async () =>{
    const token =localStorage.getItem('token');

    if (!token) {
      console.error("User ID not found. User might not be logged in.");
      return;
    }
      
    const response = await request({
      method: requestMethods.GET,
      route: "/snippets",
      headers: {
          Authorization: `Bearer ${token}`,
      },
    });
    setSnippets(response.error ? [] : response);
  }

  return (
    <div>
      <h1>Code Snippet</h1>
      <ul>
        {snippets.map((snippet) => (
          <li key={snippet.id}>
            <h2>{snippet.title}</h2>
            <pre>{snippet.code}</pre>
            <p>Language: {snippet.language}</p>
            <p>Tags: {snippet.tags.join(', ')}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
