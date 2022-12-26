import axios from 'axios';

export async function GET(baseUrl: string, path: string) {
  const { data, status } = await axios.get(baseUrl + path, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (status <= 205) {
    return data;
  } else {
    console.error('Can not fetch data');
  }
}
