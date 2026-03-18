import http from './http'

//get daily quote
export function fetchDailyQuote() {
  return http.get('/dashboard/get_daily_quote')
}

// get random quote
export function fetchRandomQuote() {
  return http.get('/dashboard/get_random_quote')
}