import Env from "../configs/config";

const NodeGeocoder = require('node-geocoder');

const options = {
  provider: Env.GEOCODER_PROVIDER,
  apiKey: Env.GEOCODER_API_KEY,
  httpAdapter: 'https',
  formatter: null
};

const geocoder = NodeGeocoder(options);

export default geocoder;
