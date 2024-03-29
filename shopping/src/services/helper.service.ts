import { makeRequestWithRetries } from "../utils/makeRequestWithRetries";

// the function takes array of addresses and send it to the cloud manager server, where addresses converted into coords
export async function sendAddressesToCloudManager(vendorAddresses: string[]) {
  try {
    const url = "http://localhost:8007/top-nearest-persons";
    const result = await makeRequestWithRetries(url, "POST", vendorAddresses);

    if (!result) throw new Error("Error while define top three persons");
    return result;
  } catch (error) {
    throw error;
  }
}

// the function take params which is number or string based on request environment
export async function GetDeliverymanById(params: string | number) {
  try {
    const url_name = `http://localhost:8005/deliveryman/${params}`;
    const url_id = `http://localhost:8005/deliveryman-for-order/${params}`;
    const url = typeof params === "number" ? url_id : url_name;
    const result = await makeRequestWithRetries(url, "GET");
    if (!result) throw new Error("Error while fetching delivery person");
    return result;
  } catch (error) {
    throw error;
  }
}

//returns vendor information to add it in the order
export async function getvendorById(id: string) {
  try {
    const url = `http://localhost:8004/vendor/${id}`;
    const result = await makeRequestWithRetries(url, "GET");
    if (!result) throw new Error("Error while fetching vendor");
    return result;
  } catch (error) {
    throw error;
  }
}
