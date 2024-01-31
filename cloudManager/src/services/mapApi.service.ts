import axios from "axios";
import * as geolib from "geolib";
import { GeolibInputCoordinates } from "geolib/es/types";
import log from "../utils/logger";

const API_KEY = process.env["GOOGLE_CLOUD_MAPS_API_KEY"];

if (!API_KEY) throw new Error("Error with API KEY");

//convert single address into lat & lng. the fucntion used google service to handle the convertion proceess of address into coords
export async function convertAddressToCoords(address: string) {
  try {
    const { data } = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json", //here is used url where we need to define the address as a params and credential's key for converting
      {
        params: {
          address: address,
          key: API_KEY,
        },
      }
    );

    if (data.status === "OK") {
      //if status is ok, we need to take first item from results from responsed data
      const { lat, lng } = data.results[0].geometry.location;
      return { latitude: lat, longitude: lng };
    } else {
      throw new Error(`Geocoding error: ${data.status}`);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.message);
    }
    throw new Error(`Unknown Error + ${error}`);
  }
}

//this function handle the same as "convertAddressToCoords" but in this case if addresses are more then 1.
export async function convertAddressesToCoords(addresses: string[]) {
  try {
    let convertedAddresses = [];
    for (const address of addresses) {
      const converted = await convertAddressToCoords(address);
      if (!converted) {
        throw new Error("Error while converting address into coords");
      }
      convertedAddresses.push(converted);
    }
    return convertedAddresses;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.message);
    }
    throw new Error(`Unknown Error + ${error}`);
  }
}

//the function receives all valid delivery persons and converting their addresess into coords
export async function getValidDeliverymen() {
  try {
    const { data } = await axios.get("http://localhost:8005/valid-deliveryman");
    const result: {
      address: string;
      personId: number;
    }[] = data.map((person: { address: string; personId: number }) =>
      convertAddressToCoords(person.address).then((coords) => ({
        ...coords,
        personId: person.personId,
      }))
    );
    return Promise.all(result);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      log.error(error.message);
      throw new Error(error.message);
    }
    throw new Error("Unknown Error" + error);
  }
}

//the functon return sorted array of best choices of delivery persons based of their current location
export async function defineBestDeliveryman(
  vendorAddresses: GeolibInputCoordinates[]
) {
  // because of the order perheps has vendors more then 1 we need to define the central place between vendors to make more easier to select the deliveryman.
  const centralPlace = geolib.getCenter(
    vendorAddresses
  ) as GeolibInputCoordinates;

  try {
    //received all valid persons
    const avaliableDeliverymen = (await getValidDeliverymen()) as [];
    //sorted received array based on persons current locations
    const bestDeliverymenChoices = avaliableDeliverymen.sort((a, b) => {
      const distanceToA = geolib.getDistance(centralPlace, a);
      const distanceToB = geolib.getDistance(centralPlace, b);
      return distanceToA - distanceToB;
    });

    return bestDeliverymenChoices;
  } catch (error) {
    throw new Error("Unknown Error" + error);
  }
}
