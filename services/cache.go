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
// 1. Set: call the dataset API to get the prayer timings for that day and set the in-memory cache
// 2. Get: read from the in-memory cache and return the prayer timings for that day
type Cache interface {
	Set(ctx context.Context) error
	Get(ctx context.Context, date string) (PrayerTimings, error)
}

type cache struct {
	dailyTimings PrayerTimings
	prayerData   *PrayerData
}

func NewCache() Cache {
	c := &cache{prayerData: &PrayerData{}}
	// call Set to ensure the in-memory cache is set
	log.Info("Initializing in-memory cache for prayer timings")
	err := c.Set(context.Background())
	if err != nil {
		log.Fatal("error setting in-memory cache: %v", err)
	}
	return c
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
	currentTime := getCurrentLocalizedTime()
	currentDate := currentTime.Format("2006-01-02")
	prayerData, err := fetchPrayerTimings(currentDate)
	if err != nil {
		return fmt.Errorf("error fetching prayer timings for date %s: %w", currentDate, err)
	}
	if len(prayerData.Data) == 0 {
		return fmt.Errorf("no prayer timings found for date %s", currentDate)
	}
	c.dailyTimings = prayerData.Data[0]
	return nil
}

// fetchPrayerTimings fetches either the full year's timings or a single day's timing based on whether date is empty.
// It delegates actual API fetching to fetchPrayerTimingsFromAPI.
func fetchPrayerTimings(date string) (*PrayerData, error) {
	if date != "" {
		return fetchPrayerTimingsForDate(date)
	}
	return fetchPrayerTimingsForYear(time.Now().Year())
}

// fetchPrayerTimingsForDate fetches prayer timings for a specific date
func fetchPrayerTimingsForDate(date string) (*PrayerData, error) {
	t, err := time.Parse("2006-01-02", date)
	if err != nil {
		return nil, fmt.Errorf("invalid date format, must be YYYY-MM-DD: %w", err)
	}
	return fetchPrayerTimingsFromAPI(date, 1, t.Year())
}

// fetchPrayerTimingsForYear fetches all timings for the given year
func fetchPrayerTimingsForYear(year int) (*PrayerData, error) {
	return fetchPrayerTimingsFromAPI("", 366, year)
}

// fetchPrayerTimingsFromAPI does the actual HTTP call
func fetchPrayerTimingsFromAPI(date string, limit int, year int) (*PrayerData, error) {
	baseURL := "https://data.gov.sg/api/action/datastore_search"
	params := url.Values{}
	params.Add("resource_id", "d_a6a206cba471fe04b62dd886ef5eaf22") // this is hardcoded i think so just gonna dump here
	params.Add("fields", "Date,Day,Subuh,Maghrib")
	params.Add("limit", fmt.Sprintf("%d", limit))

	// Use q param to filter by date or year
	if date != "" {
		params.Add("q", fmt.Sprintf(`{"Date":"%s"}`, date))
	} else {
		params.Add("q", fmt.Sprintf(`{"Date":"%d"}`, year))
	}

	fullURL := baseURL + "?" + params.Encode()
	resp, err := http.Get(fullURL)
	if err != nil {
		return nil, fmt.Errorf("http get error: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("read body error: %w", err)
	}

	var result struct {
		Result struct {
			Records []PrayerTimings `json:"records"`
		} `json:"result"`
	}

	if err := json.Unmarshal(body, &result); err != nil {
		return nil, fmt.Errorf("json unmarshal error: %w", err)
	}

	return &PrayerData{
		Year: fmt.Sprintf("%d", year),
		Data: result.Result.Records,
	}, nil
}

func getCurrentLocalizedTime() time.Time {
	loc, _ := time.LoadLocation("Asia/Singapore")
	return time.Now().In(loc)
}
