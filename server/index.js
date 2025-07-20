const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Sample population density data for US states (in a real app, this would come from a database or external API)
const populationData = {
  "01": { name: "Alabama", population: 5024279, area: 52420.07, density: 95.8 },
  "02": { name: "Alaska", population: 733391, area: 665384.04, density: 1.1 },
  "04": { name: "Arizona", population: 7151502, area: 113990.30, density: 62.7 },
  "05": { name: "Arkansas", population: 3011524, area: 53178.55, density: 56.7 },
  "06": { name: "California", population: 39538223, area: 163694.74, density: 241.7 },
  "08": { name: "Colorado", population: 5773714, area: 104093.67, density: 55.5 },
  "09": { name: "Connecticut", population: 3605944, area: 5543.41, density: 650.3 },
  "10": { name: "Delaware", population: 989948, area: 2488.72, density: 397.8 },
  "11": { name: "District of Columbia", population: 689545, area: 68.34, density: 10089.2 },
  "12": { name: "Florida", population: 21538187, area: 65757.70, density: 327.5 },
  "13": { name: "Georgia", population: 10711908, area: 59425.15, density: 180.2 },
  "15": { name: "Hawaii", population: 1455271, area: 10931.72, density: 133.1 },
  "16": { name: "Idaho", population: 1839106, area: 83568.95, density: 22.0 },
  "17": { name: "Illinois", population: 12812508, area: 57913.55, density: 221.2 },
  "18": { name: "Indiana", population: 6785528, area: 36419.55, density: 186.3 },
  "19": { name: "Iowa", population: 3190369, area: 56272.81, density: 56.7 },
  "20": { name: "Kansas", population: 2937880, area: 82278.36, density: 35.7 },
  "21": { name: "Kentucky", population: 4505836, area: 40407.80, density: 111.5 },
  "22": { name: "Louisiana", population: 4657757, area: 52378.13, density: 88.9 },
  "23": { name: "Maine", population: 1362359, area: 35379.74, density: 38.5 },
  "24": { name: "Maryland", population: 6177224, area: 12405.93, density: 498.0 },
  "25": { name: "Massachusetts", population: 7029917, area: 10554.39, density: 665.9 },
  "26": { name: "Michigan", population: 10077331, area: 96713.51, density: 104.2 },
  "27": { name: "Minnesota", population: 5706494, area: 86935.83, density: 65.6 },
  "28": { name: "Mississippi", population: 2961279, area: 48431.78, density: 61.1 },
  "29": { name: "Missouri", population: 6154913, area: 69706.99, density: 88.3 },
  "30": { name: "Montana", population: 1084225, area: 147039.71, density: 7.4 },
  "31": { name: "Nebraska", population: 1961504, area: 77347.81, density: 25.4 },
  "32": { name: "Nevada", population: 3104614, area: 110571.82, density: 28.1 },
  "33": { name: "New Hampshire", population: 1371246, area: 9349.16, density: 146.7 },
  "34": { name: "New Jersey", population: 9288994, area: 8722.58, density: 1064.7 },
  "35": { name: "New Mexico", population: 2117522, area: 121590.30, density: 17.4 },
  "36": { name: "New York", population: 20201249, area: 54554.98, density: 370.2 },
  "37": { name: "North Carolina", population: 10439388, area: 53819.16, density: 193.9 },
  "38": { name: "North Dakota", population: 779094, area: 70698.32, density: 11.0 },
  "39": { name: "Ohio", population: 11799448, area: 44825.58, density: 263.3 },
  "40": { name: "Oklahoma", population: 3959353, area: 69898.87, density: 56.6 },
  "41": { name: "Oregon", population: 4237256, area: 98378.54, density: 43.1 },
  "42": { name: "Pennsylvania", population: 13002700, area: 46054.35, density: 282.3 },
  "44": { name: "Rhode Island", population: 1097379, area: 1544.89, density: 710.3 },
  "45": { name: "South Carolina", population: 5118425, area: 32020.49, density: 159.8 },
  "46": { name: "South Dakota", population: 886667, area: 77115.68, density: 11.5 },
  "47": { name: "Tennessee", population: 6910840, area: 42144.25, density: 164.0 },
  "48": { name: "Texas", population: 29145505, area: 268596.46, density: 108.5 },
  "49": { name: "Utah", population: 3271616, area: 84896.88, density: 38.6 },
  "50": { name: "Vermont", population: 643077, area: 9616.36, density: 66.9 },
  "51": { name: "Virginia", population: 8631393, area: 42774.93, density: 201.8 },
  "53": { name: "Washington", population: 7705281, area: 71297.95, density: 108.1 },
  "54": { name: "West Virginia", population: 1793716, area: 24230.04, density: 74.0 },
  "55": { name: "Wisconsin", population: 5893718, area: 65496.38, density: 90.0 },
  "56": { name: "Wyoming", population: 576851, area: 97813.01, density: 5.9 }
};

// API Routes
app.get('/api/population-data', (req, res) => {
  res.json(populationData);
});

app.get('/api/population-data/:stateId', (req, res) => {
  const stateId = req.params.stateId;
  const data = populationData[stateId];
  
  if (data) {
    res.json(data);
  } else {
    res.status(404).json({ error: 'State not found' });
  }
});

// Serve static files from the React build
app.use(express.static(path.join(__dirname, '../client/build')));

// Catch all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 