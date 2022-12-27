import axios from 'axios';

// const proxy_list = [
//   {
//     protocol: 'http',
//     host: '149.129.239.170',
//     port: 8080,
//   },

//   {
//     protocol: 'http',
//     host: '132.129.121.148',
//     port: 8080,
//   },
//   {
//     protocol: 'http',
//     host: '154.129.98.156',
//     port: 8080,
//   },
//   {
//     protocol: 'http',
//     host: '211.129.132.150',
//     port: 8080,
//   },
//   {
//     protocol: 'http',
//     host: '164.129.114.111',
//     port: 8080,
//   },
// ];
// let random_index = Math.floor(Math.random() * proxy_list.length);

export async function GET(baseUrl: string, path: string) {
  const { data, status } = await axios.get(baseUrl + path, {
    // proxy: proxy_list[random_index],

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
