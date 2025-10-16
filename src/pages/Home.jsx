import React, { useState, useEffect } from "react";
import PlantCard from "../components/PlantCard";
import { fetchHerbs } from "../services/api";
// import { incrementVisitCount } from "../services/firebase";
import { FaSearch } from "react-icons/fa";

import { Link } from "react-router-dom";
import FirstPage from "../components/FirstPage";
import AyushCards from "../components/AyushCards";
import Footer from "../components/Footer";
import QuizPopup from "../components/QuizPopup";
// import {getVisitCount} from '../services/firebase';
import { jsPDF } from "jspdf";

const Home = () => {
  const [notes, setNotes] = useState(""); // State for notes
  const [searchTerm, setSearchTerm] = useState("");
  const [showFirstPage, setShowFirstPage] = useState(true);
  const [filterRegion, setFilterRegion] = useState("All Regions");
  const [filterType, setFilterType] = useState("All Types");
  const [plants, setPlants] = useState([]); // State to hold plant data
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [error, setError] = useState(null); // State to hold any errors
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Popup open state
  const [selectedPlant, setSelectedPlant] = useState(null); // Selected plant for popup
  const [isFilterOpen, setIsFilterOpen] = useState(false); // State for filter panel
  const [isQuizOpen, setIsQuizOpen] = useState(false); // State for quiz popup
  const [bookmarkedPlants, setBookmarkedPlants] = useState([]); // State to hold bookmarked plants
  const [isOpen, setIsOpen] = useState(false); // State to manage the hamburger menu
  const [searchByDisease, setSearchByDisease] = useState("")

  // Fetch plants data on component mount
  useEffect(() => {

  
    const getPlants = async () => {
      try {
        const response = await fetchHerbs(); // Fetch data from the API
        // console.log(response); // Log the response data to the console
        setPlants(response); // Correctly set plant data to state
      } catch (err) {
        console.error("Error fetching plants:", err); // Log the error for debugging
        setError("Failed to fetch plants"); // Set error if the fetch fails
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    // Function to download notes as a text file
    getPlants(); // Call the async function
  }, []);
  
  // Function to open popup
  const handleDownloadNotes = () => {
    const doc = new jsPDF();
    doc.text(notes, 10, 10);
    doc.save("notes.pdf");
  };
  const handleShare = () => {
    if (selectedPlant && selectedPlant.sketchfabModelUrl) {
      navigator.clipboard.writeText(selectedPlant.sketchfabModelUrl).then(() => {
        alert("Sketchfab model link copied to clipboard!");
  });
    }
  };

  const openPopup = (plant) => {
    // Extract multimedia fields and store them in an array
    const multimedia = [
      plant.multimedia1,
      plant.multimedia2,
      plant.multimedia3,
      plant.multimedia4,
    ].filter(Boolean); // Filter out any undefined or null values

    // Set the selected plant with multimedia array
    setSelectedPlant({ ...plant, multimedia });
    setIsPopupOpen(true);
  };

  // Function to close popup
  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedPlant(null);
  };

  // Render loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render error state
  if (error) {
    return <div>{error}</div>;
  }

  // Function to handle filter changes
  const handleRegionChange = (e) => setFilterRegion(e.target.value);
  const handleTypeChange = (e) => setFilterType(e.target.value);
  const handleSearchByDisease = (e) => {
    setSearchByDisease(e.target.value);
  };

  // Function to toggle filter panel
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // Function to toggle quiz popup
  const toggleQuiz = () => {
    setIsQuizOpen(!isQuizOpen);
  };


  // Function to handle search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  
    // Control visibility of FirstPage
    setShowFirstPage(value.trim() === "");
  };


  if(!plants || plants.length === 0) return <p>Loading plants...</p>;
  // Filtered plants based on selected filters and search term
  const filteredPlants = plants.filter(
    (plant) =>
      (filterRegion === "All Regions" || plant.region === filterRegion) &&
      (filterType === "All Types" || plant.type === filterType) &&
      plant.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (searchByDisease === "" ||
      (plant.medicinalUses &&
       plant.medicinalUses.toLowerCase().includes(searchByDisease.toLowerCase()))) // Search filter
  );

const handleBookmark = (plant) => {
  setBookmarkedPlants((prev) => {
    let updatedBookmarks;
    if (prev.some((p) => p.id === plant.id)) {
      updatedBookmarks = prev.filter((p) => p.id !== plant.id);
    } else {
      updatedBookmarks = [...prev, plant];
    }
    localStorage.setItem("bookmarkedPlants", JSON.stringify(updatedBookmarks));
    return updatedBookmarks;
  });
};
const handleRemoveBookmark = (id) => {
  setBookmarkedPlants((prev) => prev.filter((p) => p.id !== id));
};


  // Function to scroll to the PlantCards section
  const scrollToPlantCards = () => {
    if (plantCardsRef.current) {
      plantCardsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  // Navbar function to toggle hamburger menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const getSketchfabUID = (url) => {
    // Match the UID from Sketchfab URL
    const match = url.match(/(?:models\/|3d-models\/.*-)([a-zA-Z0-9]+)/);
    return match ? match[1] : "";
  };

  return (
    <div className="font-poppins scrollbar-thin">
      {/* Navbar */}
      <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-30">
        <div className="container mx-auto flex items-center justify-between py-4 px-5 sm:px-8">
          {/* Logo */}
          <div className="flex-shrink-0 text-black text-2xl font-semibold">
            <img src="/images/AYURB.png" alt="AYURB Logo" className="h-10" />
          </div>

          {/* Hamburger Icon */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="focus:outline-none">
              {isOpen ? (
                <span className="material-icons">close</span> // Close icon
              ) : (
                <span className="material-icons">menu</span> // Hamburger icon
              )}
            </button>
          </div>

          {/* Middle: Links */}
          <div
            className={`flex-grow flex-col md:flex md:flex-row md:justify-center md:space-x-8 md:items-center ${
              isOpen ? "flex" : "hidden"
            } md:flex md:space-x-8 transition-all duration-300 ease-in-out`}
          >
            {[
              { to: "/", label: "Home" },
              { to: "/login", label: "Login" },
              { to: "/health-wellness", label: "Health" },
              { to: "/community", label: "Community" },
              { to: "/dashboard", label: "Dashboard" },
            ].map((link, idx) => (
              <Link
                key={idx}
                to={link.to}
                className="pb-1 text-navbar-text border-b-2 border-transparent hover:border-sub-color hover:text-sub-color transition-colors duration-200"
                onClick={() => setIsOpen(false)} // Close the menu on link click
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side: Search Bar, Filter, Quiz, AR */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Box */}
            <div className="flex items-center w-80">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                className="flex-grow p-2 border rounded-xl border-main-color bg-sec-color placeholder:text-gray-400"
                placeholder="Search for plants..."
              />
              <span className="material-icons text-main-color ml-2 mr-3">
                <FaSearch />
              </span>
            </div>
            {/* Filter Button */}
            <button
              onClick={toggleFilter}
              className="flex items-center px-4 py-2 border border-main-color text-main-color rounded-xl bg-sec-color hover:bg-main-color hover:text-white transition-colors duration-200"
            >
              <i className="fa-solid fa-filter mr-2"></i>Filter
            </button>

            {/* Quiz Button */}
            <button
              onClick={toggleQuiz} // Toggle quiz popup on button click
              className="px-4 py-2 border border-main-color text-main-color rounded-xl bg-sec-color hover:bg-main-color hover:text-white transition-colors duration-200"
            >
              <i className="fa-solid fa-question-circle mr-2"></i>Quiz
            </button>
          </div>
        </div>
      </nav>

      {/* Render the Quiz Popup */}
      {isQuizOpen && <QuizPopup isOpen={isQuizOpen} onClose={toggleQuiz} />}

      {/* Render the Chatbot Button and Iframe */}
      {/* <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={toggleChatbot}
          className={`bg-main-color text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center ${
            showChatbot ? "hidden" : ""
          }`}
          style={{ width: "50px", height: "50px" }}
        >
          <span className="material-icons" style={{ fontSize: "28px" }}>
            chat
          </span>
        </button>

        {showChatbot && (
          <div className="relative">
            <iframe
              width="350"
              height="430"
              allow="microphone;"
              src="https://console.dialogflow.com/api-client/demo/embedded/501ea8ff-d991-47ee-90f1-faaa49b0963f"
              className="border border-gray-300 rounded-lg shadow-lg"
              style={{ zIndex: 9999 }}
            ></iframe>
            <button
              onClick={toggleChatbot}
              className="absolute top-2 right-2 bg-white text-black p-2 rounded-full shadow-lg hover:bg-gray-200 transition-colors duration-300"
              style={{ zIndex: 10000 }}
            >
              <span
                className="material-icons"
                style={{ width: "20px", height: "5px" }}
              >
                close
              </span>
            </button>
          </div>
        )}
      </div> */}

      {/* Filter Slider (Fixed with Transparency and Blur Effect) */}
      <div
        className={`fixed top-16 z-20 w-full bg-white bg-opacity-80 backdrop-blur-md shadow-lg transform transition-transform duration-300 ease-in-out ${
          isFilterOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex flex-wrap px-8 py-4">
          {/* Filter by Region */}
          <div className="flex-1 mb-2 mr-5 mt-3">
            <label className="block text-gray-700">Filter by Region:</label>
            <select
              value={filterRegion}
              onChange={handleRegionChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option>All Regions</option>
              <option>Tropical</option>
              <option>Sub tropical</option>
              <option>Arid</option>
              <option>Mediterranean</option>
              <option>Temperate</option>
              <option>Moist places and paddy fields</option>
              <option>North America</option>
              <option>South India</option>
              <option>Central Asia</option>
            </select>
          </div>

          {/* Filter by Type */}
          <div className="flex-1 mb-2 mr-5 mt-3">
            <label className="block text-gray-700">Filter by Type:</label>
            <select
              value={filterType}
              onChange={handleTypeChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option>All Types</option>
              <option>Herb</option>
              <option>Succulent</option>
              <option>Shrub</option>
              <option>Tree</option>
              <option>Flowering Plant</option>
            </select>
          </div>

          {/* Filter by Medicinal Uses */}
          <div className="flex-1 mb-2 mt-3">
            <label className="block text-gray-700">
              Filter by Medicinal Uses:
            </label>
            <input
              type="text"
              value={searchByDisease}
              onChange={handleSearchByDisease}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Search by Ayush, Naturopathy, etc."
            />
          </div>
        </div>
      </div>

      {showFirstPage && <FirstPage />}
      

      {/* Plant Cards */}
      <div className="min-h-screen px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-4 overflow-hidden text-ellipsis whitespace-nowrap">
          {filteredPlants.map((plant) => (
                  
            <PlantCard
              key={plant.id}
              imageSrc={plant.imageSrc || "default-image-url"}
              name={plant.name || "Unknown Plant"}
              type={plant.type || "Unknown Type"}
              onLearnMore={() => openPopup(plant)}
              onBookmark={() => handleBookmark(plant)} // Add onBookmark prop
              isBookmarked={bookmarkedPlants.some((p) => p.id === plant.id)} // Check if plant is bookmarked
            />
          ))}
        </div>

        {/* Popup for plant details */}
        {isPopupOpen && selectedPlant && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
            <div className="bg-white rounded-lg p-8 w-11/12 md:w-4/5 max-w-5xl overflow-y-auto relative shadow-lg transform transition-all duration-300">
              {/* Close Button */}
              <button
                onClick={closePopup}
                className="absolute top-4 right-4 text-2xl font-bold text-gray-700 hover:text-red-600 transition"
              >
                &times;
              </button>

              {/* Popup Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left side: 3D Model and Multimedia */}
                <div className="flex flex-col">
                  {/* 3D Model */}
                  {selectedPlant.sketchfabModelUrl && (
                    <iframe
                      title={selectedPlant.name}
                      src={`https://sketchfab.com/models/${getSketchfabUID(selectedPlant.sketchfabModelUrl)}/embed`}
                      frameBorder="0"
                      allow="autoplay; fullscreen; vr"
                      className="w-full h-72 rounded-lg mb-4 shadow-sm"
                    ></iframe>
                  )}

                  {/* Multimedia Carousel */}
                  <div className="overflow-x-auto whitespace-nowrap">
                    {selectedPlant.multimedia.length > 0 ? (
                      selectedPlant.multimedia.map((media, index) => {
                        // Function to get the embeddable YouTube URL
                        const getYouTubeEmbedURL = (url) => {
                          // For https://www.youtube.com/watch?v=ID
                          const watchMatch = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/);
                          // For https://youtu.be/ID
                          const shortMatch = url.match(/(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?&]+)/);
                          if (watchMatch && watchMatch[1]) {
                            return `https://www.youtube.com/embed/${watchMatch[1]}`;
                          } else if (shortMatch && shortMatch[1]) {
                            return `https://www.youtube.com/embed/${shortMatch[1]}`;
                          }
                          return null;
                        };

                        const isYouTube = media.includes("youtube.com") || media.includes("youtu.be");
                        const embedURL = isYouTube ? getYouTubeEmbedURL(media) : null;

                        return (
                          <div key={index} className="inline-block mr-4">
                            {isYouTube && embedURL ? (
                              <iframe
                                className="h-64 w-64 rounded-lg shadow-md"
                                src={embedURL}
                                frameBorder="0"
                                allowFullScreen
                                title={`Video ${index + 1}`}
                              ></iframe>
                            ) : media.endsWith(".mp4") ? (
                              <video
                                controls
                                className="h-64 w-64 rounded-lg shadow-md"
                                src={media}
                              >
                                Your browser does not support the video tag.
                              </video>
                            ) : (
                              <img
                                src={media}
                                alt={`Multimedia ${index + 1}`}
                                className="h-64 w-64 object-cover rounded-lg shadow-md"
                              />
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p>No multimedia content available</p>
                    )}
                  </div>

                </div>
                {/* Right side: Plant Info and Details */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    {selectedPlant.name}
                  </h2>

                  {/* Scrollable Text Information Section */}
                  <div className="overflow-y-auto max-h-52 mb-4 pr-4">
                    <p className="text-lg leading-6 text-gray-600 mb-4">
                      {selectedPlant.description}
                    </p>
                    <div className="mb-4 text-gray-700">
                      <p>
                        <strong>Region:</strong> {selectedPlant.region}
                      </p>
                      <p>
                        <strong>Common Names:</strong>{" "}
                        {selectedPlant.commonNames}
                      </p>
                      <p>
                        <strong>Type:</strong> {selectedPlant.type}
                      </p>
                      <p>
                        <strong>Habitat:</strong> {selectedPlant.habitat}
                      </p>
                      <p>
                        <strong>Botanical Name:</strong>{" "}
                        {selectedPlant.botanicalName}
                      </p>
                      <p>
                        <strong>Medicinal Uses:</strong>{" "}
                        {selectedPlant.medicinalUses}
                      </p>
                      <p>
                        <strong>Methods of Cultivation:</strong>{" "}
                        {selectedPlant.methodsOfCultivation}
                      </p>
                    </div>
                  </div>

                  {/* Audio Player */}
                  <audio
                    src={selectedPlant.audioSrc}
                    controls
                    className="w-full mt-2 bg-gray-100 rounded-full"
                  >
                    Your browser does not support the audio element.
                  </audio>

                  {/* Notes Section */}
                  <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-3">Notes:</h3>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      id="notes-textarea"
                      className="w-full p-4 border border-gray-300 rounded-md"
                      placeholder="Write your notes here..."
                      rows={6}
                    ></textarea>
                  </div>

                  {/* Buttons for actions */}
                  <div className="flex items-center mt-4">
                    <button onClick={handleDownloadNotes} className="text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors duration-200 mr-2">
                      <i className="fa-solid fa-download mr-2"></i>
                      Download
                    </button>
                    <button onClick={handleShare} className="text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors duration-200 mr-2">
                      <i className="fa-solid fa-share mr-2"></i>
                      Share
                    </button>
                    <Link to="/community" className="pb-1">
                      <button className="text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors duration-200">
                        <i className="fa-regular fa-comment mr-2"></i>
                        Comment
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <AyushCards searchTerm={searchTerm}/>

      <Footer />
    </div>
  );
};

export default Home;