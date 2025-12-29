package handlers

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"text/template"
	"time"

	log "when-eat/logging"
	cache "when-eat/services"
)

func NewScrapeHandler(cache cache.Cache) *ScrapeHandler {
	return &ScrapeHandler{
		cache: cache,
	}
}

type ScrapeHandler struct {
	cache cache.Cache
}

type PageInfo struct {
	MaghribTime, SubuhTime, Message, ImagePath string
	CanEat                                     bool
}

// renderErrorPage renders the error template to the response writer
func renderErrorPage(w http.ResponseWriter, err error) {
	w.WriteHeader(http.StatusInternalServerError)
	errorTmpl, parseErr := template.ParseFiles("templates/error.html")
	if parseErr != nil {
		log.Error("error parsing error template: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
	if execErr := errorTmpl.Execute(w, nil); execErr != nil {
		log.Error("error executing error template: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
}

// this just reads the prayer timings from cache and parses for the current date
func (sh *ScrapeHandler) GetPrayerTimings() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// since we are using linode hosted on sg server, we dont need to worry about timezone differences
		prayerTimings, err := sh.cache.Get(r.Context(), time.Now().Format("2006-01-02"))
		if err != nil {
			log.Error("error fetching prayer timings: %v", err)
			renderErrorPage(w, err)
			return
		}

		// Fallback check: if prayer timings are empty, show error
		if prayerTimings.Maghrib == "" || prayerTimings.Subuh == "" {
			log.Error("prayer timings are empty for date: %s", time.Now().Format("2006-01-02"))
			renderErrorPage(w, fmt.Errorf("prayer timings are empty for date: %s", time.Now().Format("2006-01-02")))
			return
		}

		canEat := canIEat(prayerTimings.Maghrib, prayerTimings.Subuh)
		tmpl, err := template.ParseFiles("templates/can-or-cannot.html")
		if err != nil {
			log.Error("error parsing template: %v", err)
			renderErrorPage(w, err)
			return
		}
		pageInfo := PageInfo{
			MaghribTime: prayerTimings.Maghrib,
			SubuhTime:   prayerTimings.Subuh,
		}
		if canEat {
			pageInfo.Message = "You can eat now!"
			pageInfo.ImagePath = "static/can-eat.gif"
			pageInfo.CanEat = true
			tmpl.Execute(w, pageInfo)
		} else {
			pageInfo.Message = "You cannot eat now!"
			pageInfo.ImagePath = "static/cannot-eat.gif"
			pageInfo.CanEat = false
			tmpl.Execute(w, pageInfo)
		}
	}
}

// this will be called to update the prayer timings from local JSON file
func (sh *ScrapeHandler) UpdatePrayerTimings() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := sh.cache.Set(r.Context())
		if err != nil {
			log.Error("error updating prayer timings: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Error updating prayer timings"))
			return
		}
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Prayer timings updated successfully"))
	}
}

func canIEat(maghribTime string, subuhTime string) bool {
	if maghribTime == "" || subuhTime == "" {
		return false
	}
	// Load the Singapore timezone
	loc, _ := time.LoadLocation("Asia/Singapore")
	// get hours and minutes to make it easy to get the parsed time later
	subuhHours, subuhMinutes := getHoursAndMinutes(subuhTime, false)
	magrhibHours, maghribMinutes := getHoursAndMinutes(maghribTime, true)

	// Get the current date
	currentTime := time.Now().In(loc)
	year, month, day := currentTime.Date()

	// Set the parsed time to the current date and year
	parsedSubuh := time.Date(year, month, day, subuhHours, subuhMinutes, 0, 0, loc)
	parsedMaghrib := time.Date(year, month, day, magrhibHours, maghribMinutes, 0, 0, loc)

	// Check if the current time is after the maghrib time
	if currentTime.After(parsedMaghrib) || currentTime.Before(parsedSubuh) {
		return true
	}
	return false
}

func getHoursAndMinutes(timeStr string, needAdd12 bool) (int, int) {
	timeParts := strings.Split(timeStr, ":")
	hourStr := timeParts[0]
	hour, _ := strconv.Atoi(hourStr)
	if needAdd12 {
		hour += 12
	}
	minuteStr := timeParts[1]
	minute, _ := strconv.Atoi(minuteStr)
	return hour, minute
}
