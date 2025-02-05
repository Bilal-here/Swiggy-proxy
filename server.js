const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

const swiggyHeaders = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Referer': 'https://www.swiggy.com/',
  'Origin': 'https://www.swiggy.com'
};

//Error handler function 
function handleApiError(error, res) {
  console.error('Error fetching data:', error.message);
  if (error.response) {
    console.error('Error response status:', error.response.status);
    console.error('Error response headers:', error.response.headers);
    console.error('Error response data:', error.response.data);
    if (error.response.headers['content-type'] && error.response.headers['content-type'].includes('text/html')) {
      res.status(error.response.status).send(error.response.data);
    } else {
      res.status(error.response.status).json({ error: error.response.data });
    }
  } else if (error.request) {
    console.error('Error request data:', error.request);
    res.status(500).json({ error: 'No response received from server' });
  } else {
    console.error('Error message:', error.message);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}

// Endpoint for Food API
app.get('/api/food', async (req, res) => {
  try {
    const response = await axios.get('https://www.swiggy.com/dapi/restaurants/list/v5', {
      params: {
        lat: '17.47832353074318',
        lng: '78.37417326449751',
        'is-seo-homepage-enabled': 'true',
        page_type: 'DESKTOP_WEB_LISTING',
      },
      headers: swiggyHeaders
    });
    res.json(response.data);
  } catch (error) {
    handleApiError(error, res);
  }
});

// Endpoint for Delivery API
app.get('/api/delivery', async (req, res) => {
  const { lat, lng } = req.query;
  try {
    const response = await axios.get('https://www.swiggy.com/dapi/restaurants/list/v5', {
      params: {
        lat: lat || '17.4400802',
        lng: lng || '78.3489168',
        'is-seo-homepage-enabled': 'true',
        page_type: 'DESKTOP_WEB_LISTING',
      },
      headers: swiggyHeaders
    });
    res.json(response.data);
  } catch (error) {
    handleApiError(error, res);
  }
});

// Endpoint for Restaurant Menu API
app.get('/api/menu', async (req, res) => {
  const { lat, lng, id } = req.query;
  try {
    const response = await axios.get('https://www.swiggy.com/dapi/menu/pl', {
      params: {
        'page-type': 'REGULAR_MENU',
        'complete-menu': 'true',
        lat: lat || '17.4400802',
        lng: lng || '78.3489168',
        restaurantId: id,
        'catalog_qa': 'undefined',
        'submitAction': 'ENTER',
      },
      headers: swiggyHeaders
    });
    res.json(response.data);
  } catch (error) {
    handleApiError(error, res);
  }
});

// Endpoint for Popular Restaurants API
app.get('/api/popular', async (req, res) => {
  try {
    const response = await axios.get('https://www.swiggy.com/dapi/restaurants/list/v5', {
      params: {
        lat: '17.47832353074318',
        lng: '78.37417326449751',
        'is-seo-homepage-enabled': 'true',
        page_type: 'DESKTOP_WEB_LISTING',
      },
      headers: swiggyHeaders
    });
    res.json(response.data);
  } catch (error) {
    handleApiError(error, res);
  }
});

// Endpoint for Searching Location for Restaurants
app.get('/api/location', async (req, res) => {
  const { input } = req.query;
  try {
    const response = await axios.get('https://www.swiggy.com/dapi/misc/place-autocomplete', {
      params: { input, types: '' },
      headers: swiggyHeaders
    });
    res.json(response.data);
  } catch (error) {
    handleApiError(error, res);
  }
});

// Endpoint for Food Search
app.get('/api/food-search', async (req, res) => {
  const { input } = req.query;
  try {
    const response = await axios.get('https://www.swiggy.com/dapi/restaurants/search/v3', {
      params: {
        lat: '17.4400802',
        lng: '78.3489168',
        str: input,
        trackingId: 'undefined',
        submitAction: 'ENTER',
        queryUniqueId: 'ca695039-e861-0903-c8bf-c205a4cdd78d',
      },
      headers: swiggyHeaders
    });
    res.json(response.data);
  } catch (error) {
    handleApiError(error, res);
  }
});

// Endpoint for Restaurant Search
app.get('/api/restaurant-search', async (req, res) => {
  const { input } = req.query;
  try {
    const response = await axios.get('https://www.swiggy.com/dapi/restaurants/search/v3', {
      params: {
        lat: '17.4400802',
        lng: '78.3489168',
        str: input,
        trackingId: 'undefined',
        submitAction: 'SUGGESTION',
        queryUniqueId: '181a64ea-9b53-f5c2-fb99-84a451867b15',
      },
      headers: swiggyHeaders
    });
    res.json(response.data);
  } catch (error) {
    handleApiError(error, res);
  }
});




//api with search locations for restaurants near the location search
app.get('/api/address-recommend', async (req, res) => {
  const { place_id } = req.query;
  try {
    const response = await axios.get(`https://www.swiggy.com/dapi/misc/address-recommend`, {
      params: {
        place_id
      },
      headers: swiggyHeaders
    });
    res.json(response.data);
  } catch (error) {
    handleApiError(error, res);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
