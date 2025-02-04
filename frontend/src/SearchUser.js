import React, { useState } from "react";
import axios from "axios";
import SearchedProfile from "./SearchedProfile";

const SearchUser = () => {
  const [mobile, setMobile] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.get(`http://localhost:8000/users/search/${mobile}`);
      setUser(response.data);
    } catch (err) {
      setUser(null);
      setError("User not found or an error occurred.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Search User by Mobile Number</h2>
      <form onSubmit={handleSearch} className="d-flex justify-content-center">
        <input
          type="text"
          placeholder="Enter Mobile Number"
          className="form-control w-50"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
        <button type="submit" className="btn btn-primary ms-2">
          Search
        </button>
      </form>

      {error && <p className="text-danger mt-3 text-center">{error}</p>}

      {user && <SearchedProfile user={user} />}
    </div>
  );
};

export default SearchUser;