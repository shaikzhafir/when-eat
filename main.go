package main

import (
	"net/http"
	"os"
	"when-eat/handlers"
	log "when-eat/logging"
	c "when-eat/services"
)

func main() {
	mux := http.NewServeMux()
	staticFs := http.FileServer(http.Dir("./static"))
	indexFs := http.FileServer(http.Dir("./"))
	var cache c.Cache
	cache = c.NewCache()
	scrapeHandler := handlers.NewScrapeHandler(cache)
	mux.Handle("/static/", http.StripPrefix("/static/", staticFs))
	mux.HandleFunc("/scrape", scrapeHandler.UpdatePrayerTimings())
	mux.HandleFunc("/prayer-timings", scrapeHandler.GetPrayerTimings())
	mux.Handle("/", indexFs)
	log.Info("server started")
	// if prod, use env to get the ip and port
	if os.Getenv("ENV") == "prod" {
		prodUrl := os.Getenv("PROD_URL")
		log.Info("starting server on %s", prodUrl)
		err := http.ListenAndServe(prodUrl, mux)
		if err != nil {
			log.Error("error starting server: %v", err)
		}
	} else {
		err := http.ListenAndServe(":8080", mux)
		if err != nil {
			log.Error("error starting server: %v", err)
		}
	}
}
