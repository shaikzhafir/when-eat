# When-Eat

A web service that helps you determine **when you can eat** (for fasting Muslims) based on Singapore prayer timings. The application fetches daily prayer times—including Maghrib and Subuh—from data.gov.sg and tells you whether it's currently permissible to eat.

## Features

- **Realtime or cached prayer timing retrieval** from data.gov.sg using an in-memory cache.
- **Simple web interface** shows result: "You can eat now!" or "You cannot eat now!" with a fun GIF.
- **Automatic handling of timezone** (Singapore/Asia).
- **Manual cache refresh** endpoint for updating timings if needed.
- **Error page** for API or data retrieval issues.

## How it Works

1. On the backend, a cache service fetches today's prayer times (`Maghrib` and `Subuh`) and stores them in-memory.
2. HTTP handlers show a web page depending on whether you can eat, based on the current time compared with the fetched Maghrib/Subuh times.
3. Uses [data.gov.sg](https://data.gov.sg) for authoritative, up-to-date prayer timings.

## Key Endpoints

- `/`  
  Shows web page: "Can I eat now?" with today's Maghrib and Subuh times.
- `/scrape`  
  GET endpoint to manually refresh the prayer timings cache.

## Development

### Main Components

- **handlers/scrapeHandler.go**  
  Contains HTTP handlers and logic to decide "can I eat now" based on current time and cached timings.
- **services/cache.go**  
  Implements `Cache` interface using in-memory storage and fetches data from the public API.
- **templates/**  
  Contains HTML templates for main and error pages.
- **static/**  
  Contains GIFs/images for visual feedback.

### Data Source

- **API**: [data.gov.sg action/datastore_search](https://data.gov.sg/api/action/datastore_search)
- Fields used: `Date`, `Day`, `Maghrib`, `Subuh`

## Setup

1. **Clone the Repository**

   ```sh
   git clone https://github.com/yourusername/when-eat.git
   cd when-eat
   ```

2. **Run the Service**

   Ensure you have Go installed (1.18+):

   ```sh
   go run main.go
   ```

3. **Open in browser**  
   Visit `http://localhost:8080` (or your configured port).

## Customization

- Update the API endpoint/resource in `services/cache.go` if the data.gov.sg resource changes.
- Change the images / messages in the `templates/` directory as desired.

