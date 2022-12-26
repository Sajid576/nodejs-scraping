# Node.js Scraping

## Project Installation

- Run `yarn` to install required packages.

- Run `yarn dev` to run the scrapping program.

## Project Structure

- `models` folder contains the db model file for storing truck details.

- `services` contains the `base-services` file that contains the core scrapping methods.

- `db-services` contains the core database interaction methods. Here, `Items` list is used as the database.

# Retry Strategies For Scraping

- We can crawl from multiple IP addresses and avoid IP bans and rate limits by using ProxyMesh's anonymous IP changer
  proxy that rotates IP addresses by hiding our IP address.

- If we get `503` response status code while trying to access a certain site, it's possible that the target server is dropping connection because of heavy load, poor network performance between target and proxy server or some kind of IP
  blocking.In these situations, sending requests from other proxy server or delying the our crawler can be a good option to avoid these situations.

- If we target a busy server, then we have to avoid small interval of retries. Best practice is to increase the delay between retries. For example- Make first request, get 500 error response code, wait for 1 second, then retry request again, receive 500 error response code, wait 2 seconds, then retry request again and finally receive 200 success code.
  We can perform this job using `cron job` or `BullMQ` like npm package for job queue in nodejs or celery package of python.
