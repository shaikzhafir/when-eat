package cache

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"time"

	log "when-eat/logging"
)

type PrayerData struct {
	Year string          `json:"year"`
	Data []PrayerTimings `json:"data"`
}

type PrayerTimings struct {
	Date    string `json:"Date"`
	Day     string `json:"Day"`
	Maghrib string `json:"Maghrib"`
	Subuh   string `json:"Subuh"`
}

// cache should be doing 2 things:
// 1. UpdateTimings: fetch the prayer timings from the dataset API and store it as a json file
// 2. Set: once a day, read from the json file and set the prayer timings for that day inmemory
// 3. Get: read from the in-memory cache and return the prayer timings for that day
type Cache interface {
	UpdateTimings() error
	Set(ctx context.Context) error
	Get(ctx context.Context, date string) (PrayerTimings, error)
}

type cache struct {
	dailyTimings PrayerTimings
	prayerData   *PrayerData
}

func NewCache() Cache {
	c := &cache{prayerData: &PrayerData{}}
	// call UpdateTimings to ensure the prayer_timings.json is created/updated
	err := c.UpdateTimings()
	if err != nil {
		log.Fatal("error creating prayer_timings.json: %v", err)
	}
	return c
}

// UpdateTimings will first check two things before it updates the timings:
// 1. if the prayer_timings.json doesnt exist, it will create it. else go to next check
// 2. if todays year is same as the year in the prayer_timings.json, then skip updating
func (c *cache) UpdateTimings() error {
	// if the prayerData is empty, then fetch the prayer timings from the dataset API
	if len(c.prayerData.Data) == 0 {
		log.Info("prayer_timings.json does not exist, creating it")
		data, err := fetchYearlyPrayerTimings()
		if err != nil {
			return err
		}
		c.prayerData = data
		// set the cache
		err = c.Set(context.Background())
		if err != nil {
			return err
		}
		return nil
	}
	// check if the prayer timings were last updated today
	today := c.prayerData.Data[0].Date
	if today == time.Now().Format("2006-01-02") {
		log.Info("prayer_timings.json was last updated today, skipping update")
		return nil
	}
	return nil
}

func (c *cache) Get(ctx context.Context, date string) (PrayerTimings, error) {
	if c.dailyTimings.Date != date {
		// set the cache again
		log.Info("Cache miss for date %s, updating cache", date)
		err := c.Set(ctx)
		if err != nil {
			log.Error("error ")
		}
	}
	return c.dailyTimings, nil
}

func (c *cache) Set(ctx context.Context) error {
	// find the date that matches todays date
	loc, _ := time.LoadLocation("Asia/Singapore")
	currentTime := time.Now().In(loc)
	currentDate := currentTime.Format("2006-01-02")
	var updated bool
	for _, prayer := range c.prayerData.Data {
		if prayer.Date == currentDate {
			// found the timing for today
			log.Info("Setting prayer timings for %s: Maghrib=%s, Subuh=%s",
				prayer.Date, prayer.Maghrib, prayer.Subuh)
			c.dailyTimings = prayer
			updated = true
			break
		}
	}
	if !updated {
		log.Error("No prayer timings found for today: %s", currentDate)
	}
	return nil
}

func fetchYearlyPrayerTimings() (*PrayerData, error) {
	// This function can be implemented to fetch yearly prayer timings from an external source
	// and store them in a local JSON file for later use.
	baseURL := "https://data.gov.sg/api/action/datastore_search"

	// get current year
	currentYear := time.Now().Year()
	fmt.Println("Current Year:", currentYear)

	// Build URL with query parameters
	params := url.Values{}
	params.Add("resource_id", "d_a6a206cba471fe04b62dd886ef5eaf22")
	params.Add("limit", "366")
	params.Add("fields", "Date,Day,Subuh,Maghrib")
	params.Add("filters", "")
	params.Add("q", fmt.Sprintf(`{"Date":"%d"}`, currentYear))

	// Construct full URL
	fullURL := baseURL + "?" + params.Encode()

	// Make GET request
	resp, err := http.Get(fullURL)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	// Read response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		panic(err)
	}

	fmt.Println("Status:", resp.Status)
	fmt.Println("Response:", string(body))
	// convert response to struct
	var result struct {
		Result struct {
			Records []PrayerTimings `json:"records"`
		} `json:"result"`
	}

	err = json.Unmarshal(body, &result)
	if err != nil {
		return nil, err
	}

	return &PrayerData{
		Year: fmt.Sprintf("%d", currentYear),
		Data: result.Result.Records,
	}, nil
}
