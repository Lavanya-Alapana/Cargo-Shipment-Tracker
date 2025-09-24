const axios=require('axios')

const handler=async(req, res)=> {
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({ error: "Address is required" });
  }

  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search`,
      {
        params: {
          q: address,
          format: "json",
          limit: 1,
        },
        headers: {
          "User-Agent": "ShipmentTracker/1.0" // Nominatim requires a User-Agent
        },
      }
    );

    if (response.data.length === 0) {
      return res.status(404).json({ error: "No results found" });
    }

    const { lat, lon } = response.data[0];
    res.status(200).json({ lat, lon });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Geocoding failed" });
  }
}


module.exports={handler}