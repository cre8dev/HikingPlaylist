# Hiking Playlist Generator

### Concept
* Simply enter your hiking destination to find local hikes in the area with information about location, difficulty, rating, etc.
* The generate playlist button will create a playlist for the user based on the difficulty of the hike. 
* If the user enjoys the hike they chose, then they can hit a like button to let others know.

### Motivation
* Playing various types of music when hiking
* Not wasting time looking for songs
* Being able to have different types of genres based on the difficulty of the hike
* Every trail will play different playlist
* Never get bored on a trail
* Keeps you motivated through the hike

### Techonologies Used
* HTML, CSS
* Javascript, jQuery
* Materialize (NavBar, Buttons, Modal, and etc.)
* AJAX
* Google Geocoding API (City name or Zip code -> Latitude & Longitude)
* Hiking Project API  (Latitude & Longitude -> Trails information)
* iTunes player iFrame (Play pre-selected playlist depends on trail level)
* Firebase (Keep track of how many times “LIKE” button has been clicked for each trail)

### Design Process
* Sketched out our idea for the Project
* Started with Hiking Project API  
* Added Like button using  firebase
* Then we added the Geocoding API
* Added playlist generator using iframe.
* Designed with Css/ Materialize
* Sleek and minimalistic for a user friendly interface

### Directions for future development
* Work with different frameworks and languages
* Creating a better algorithm to generate playlists and including different genres
* Option to  sort trails by most liked or level of difficulty
* Account registration and login to view and track past hikes/review trails
* ~~Develop free form address input validation that works with city/zipcode search (Using streetlayer API)~~ (Completed)
* ~~Cleaning up mobile site with CSS~~ (Completed)