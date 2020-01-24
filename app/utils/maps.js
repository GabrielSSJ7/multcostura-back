import axios from "axios";

export function getLatAndLonByAddress(address, cb) {
  const url = `http://www.mapquestapi.com/geocoding/v1/address?key=${
    process.env.MAPS_API_KEY
  }&location=${replaceSpecialChars(address)}`;
  axios
    .get(url)
    .then(res => {
      cb(null, res.data);
    })
    .catch(err => {
      cb(err);
    });
}

const replaceSpecialChars = str => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/ /g, "+"); // Substitui espaço e outros caracteres por hífen
  //.replace(/\-\-+/g, '+')	// Substitui multiplos hífens por um único hífen
  //.replace(/(^-+|-+$)/, ''); // Remove hífens extras do final ou do inicio da string
};
