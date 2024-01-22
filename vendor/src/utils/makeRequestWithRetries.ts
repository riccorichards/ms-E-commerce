import axios, { Method, isAxiosError } from "axios";

export async function makeRequestWithRetries(
  url: string,
  method: Method = "GET",
  data?: any
) {
  const MAX_RETRIES = 5;
  let tries = 0;

  while (tries < MAX_RETRIES) {
    try {
      const result = await simpleAxiosRequest(url, method, data);
      return result;
    } catch (error) {
      if (!isAxiosError(error)) {
        throw error;
      }
      if (error.response?.status === 503) {
        tries++;
        if (tries >= MAX_RETRIES) {
          throw new Error("Max retries reached");
        }
        await wait(exponentialBackoff(tries));
      } else {
        throw error;
      }
    }
  }
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function exponentialBackoff(tries: number) {
  const jitter = Math.random() * 100;
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

export async function getCustomerInfo(customerId: string) {
  const url = `http://localhost:8001/order-customer-info/${customerId}`;
  const customer = await makeRequestWithRetries(url, "GET");
  if (!customer) throw new Error("Customer was not found");
  return customer;
}
