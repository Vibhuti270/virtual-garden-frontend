import React from "react";
import PropTypes from "prop-types";
import { FaBookmark, FaCheck, FaShareAlt } from "react-icons/fa";

const PlantCard = ({
  imageSrc,
  name,
  type,
  onLearnMore = () => {},
  onBookmark = () => {},
  isBookmarked = false,
}) => {
  // Share functionality
  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: `Learn about ${name}`,
        text: `Check out this plant: ${name}!`,
        url: window.location.href,
      })
      .then(() => console.log("Shared successfully"))
      .catch((error) => console.error("Error sharing", error));
    } else {
      // Fallback for browsers that do not support navigator.share
      alert("Sharing is not supported in your browser.");
    }
  };

  return (
    <div
      className="relative bg-sec-color shadow-lg rounded-lg overflow-hidden border border-gray-200 cursor-pointer pb-1 transition transform hover:scale-105 duration-500 ease-in-out w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto"
      onClick={onLearnMore}
    >
      <img
        src={imageSrc || "placeholder-image-url.jpg"}
        alt={name || "Plant"}
        className="w-full h-60 sm:h-72 md:h-80 object-cover p-3 rounded-2xl"
      />

      <div className="p-4 pt-1 bg-sec-color text-center">
        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 text-left">
          {name}
        </h3>
        <p className="text-xs text-gray-500 text-left">{type}</p>
      </div>

      {/* Bookmark and Share Buttons */}
      <div className="absolute bottom-2 right-2 flex space-x-2 sm:space-x-4 text-xl">
        <button
          aria-label={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
          className={`p-1.5 mb-2 hover:bg-gray-100 rounded-md transition-colors duration-200 ${
            isBookmarked ? "text-yellow-500" : "text-gray-600 hover:text-yellow-500"
          } hover:scale-110`}
          onClick={(e) => {
            e.stopPropagation();
            onBookmark();
          }}
        >
          {isBookmarked ? <FaCheck /> : <FaBookmark />}
        </button>

        <button
          aria-label="Share"
          className="mb-2 text-gray-600 hover:text-green-500 p-1.5 hover:bg-gray-100 rounded-md transition-colors duration-200 hover:scale-110"
          onClick={handleShare}
        >
          <FaShareAlt />
        </button>
      </div>
    </div>
  );
};

PlantCard.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onLearnMore: PropTypes.func.isRequired,
  onBookmark: PropTypes.func.isRequired,
  isBookmarked: PropTypes.bool.isRequired,
};

export default PlantCard;
