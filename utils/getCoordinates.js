module.exports.getCoord=async(location, country)=>{
    const query = `${location}, ${country}`;

    const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
    );

    const geoData = await geoRes.json();

    if (!geoData.length) {
        return res.status(400).send("Invalid location");
    }

    const lat = geoData[0].lat;
    const lng = geoData[0].lon;

    return {
        lng,
        lat,
    }
}