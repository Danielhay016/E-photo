const express = require('express');
const router = express.Router();
const C_location = require('../controllers/location');
const storeLocations = require('../data/location'); 
const adminAuthMiddleware = require('../middleware/adminAuth'); 

// getall
router.get("/api/store-location", (req, res) => {
  C_location.getAll()
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error('Error fetching store location data:', error);
      res.status(500).json({ error: 'Failed to fetch store locations' });
    });
});

// only admin - update
router.put("/api/store-location/:locationId", adminAuthMiddleware, async (req, res) => {
  const locationId = req.params.locationId;
  const updatedLocationData = req.body;
  try {
      const updatedLocation = await C_location.updateLocation(locationId, updatedLocationData);
      res.json({ message: 'Location updated successfully', location: updatedLocation });
  } catch (error) {
      console.error('Error updating location:', error);
      res.status(500).json({ error: 'Failed to update location' });
  }
});
// only admin - delete
router.delete("/api/store-location/:locationId", adminAuthMiddleware, async (req, res) => {
  const locationId = req.params.locationId;
  try {
    const deletedLocation = await C_location.deleteLocation(locationId);
    if (deletedLocation) {
      res.json({ success: true, message: 'Location deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Location not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting location' });
  }
});

// only admin - create
router.post('/api/add-location', adminAuthMiddleware, async (req, res) => {
    const { name, lat, lng } = req.body;
    try {
      const newLocation = await C_location.addLocation(name, lat, lng);
      res.json({ message: 'Location added successfully', location: newLocation });
    } catch (error) {
      console.error('Error adding location:', error);
      res.status(500).json({ error: 'Failed to add location' });
    }
  });


// Load and add locations from data when starting the server
router.post('/api/add-data-locations', async (req, res) => {
    try {
      const result = await C_location.addLocationsFromData(storeLocations);
      res.json(result);
    } catch (error) {
      console.error('Error adding store locations from data:', error);
      res.status(500).json({ error: 'Failed to add store locations from data' });
    }
  });

// Get details for a single location by ID
router.get("/api/store-location/:locationId", (req, res) => {
  const locationId = req.params.locationId;
  
  C_location.getLocationById(locationId)
    .then((location) => {
      if (!location) {
        return res.status(404).json({ error: 'Location not found' });
      }
      res.json(location);
    })
    .catch((error) => {
      console.error('Error fetching location details:', error);
      res.status(500).json({ error: 'Failed to fetch location details' });
    });
}); 

  
module.exports = router;