import axios, { Method, isAxiosError } from "axios";


// because of there is a risky of load latency of networks, we are implemented the retries function. thie function makes request several time if the first request it received an error
export async function makeRequestWithRetries(
  url: string, 
  method: Method = "GET",
  data?: any
) {
  //maximum amount of retries
  const MAX_RETRIES = 5;
  //initial tries
  let tries = 0;

  //we are checking if tries is less then the maximum amount of request 
  while (tries < MAX_RETRIES) {
    try {
      //we are make the request 
      const result = await simpleAxiosRequest(url, method, data);
      return result;
    } catch (error) {
      if (!isAxiosError(error)) {
        throw error;
      }
      //so if the response's status is equal 503 that means the server is load and need some times for rest. 
      if (error.response?.status === 503) {
        //increment the tries value
        tries++;
        //and if tires value is great than maxumim re-tries then we need to throw new error
        if (tries >= MAX_RETRIES) {
          throw new Error("Max retries reached");
        }

        //if not, we need to use exponentialBackoff function to split the requests into smaller parts
        await wait(exponentialBackoff(tries));
      } else {
        throw error;
      }
    }
  }
}

//handling setTimeout processing
function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// the idea is of exponentialBackoff function to make handling process more easier for loaded server.
function exponentialBackoff(tries: number) {
  //jitter is equal random number form 0 to 99, which is the spread
  const jitter = Math.random() * 100;
// then we need to multiply already made tries itselt and then add spread to separate requests 
  return Math.pow(2, tries) + jitter;
}

async function simpleAxiosRequest(
  url: string,
  method: Method = "GET",
  data?: any
) {
  try {
    const res = await axios({ url, method, data });
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.message);
    }
    throw error;
  }
}
