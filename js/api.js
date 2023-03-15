const api = axios.create({
    baseURL: 'https://tmdb-proxy.cubos-academy.workers.dev/3',
    timeout: 10000,
    headers: { 'Content-Type': 'Application/json' }
});

const apiKey = 'primary_release_date.gte=2014-09-15&primary_release_date.lte=2014-10-22'

const baseURL = 'https://tmdb-proxy.cubos-academy.workers.dev/3'
