import axios from "axios";
import * as geolib from "geolib";
import { GeolibInputCoordinates } from "geolib/es/types";
import log from "../utils/logger";

const API_KEY = process.env["GOOGLE_CLOUD_MAPS_API_KEY"];

if (!API_KEY) throw new Error("Error with API KEY");

//convert single address into lat & lng
export async function convertAddressToCoords(address: string) {
  try {
    const { data } = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          address: address,
          key: API_KEY,
        },
      }
    );

    if (data.status === "OK") {
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

//get valid deliverymen's addresses and convert they into lat & lng
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

export async function defineBestDeliveryman(
  vendorAddresses: GeolibInputCoordinates[]
) {
  const centralPlace = geolib.getCenter(
    vendorAddresses
  ) as GeolibInputCoordinates;

  try {
    const avaliableDeliverymen = (await getValidDeliverymen()) as [];
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
