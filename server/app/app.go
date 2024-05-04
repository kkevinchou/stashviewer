package app

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/kkevinchou/stashviewer/response"
	"github.com/kkevinchou/stashviewer/settings"
)

type App struct {
}

func getItems(sr *response.SearchResponse) (*response.SearchResultResponse, error) {
	var getItemsResult response.SearchResultResponse

	batchSize := 5

	for i := 0; i < len(sr.Result); i += batchSize {
		end := i + batchSize
		if end > len(sr.Result) {
			end = len(sr.Result)
		}
		urls := sr.Result[i:end]

		fmt.Println("processing", len(urls), urls)

		url := "https://www.pathofexile.com/api/trade/fetch/"
		url += strings.Join(urls, ",")
		url += "?query=" + sr.ID

		req, err := http.NewRequest("GET", url, nil)
		if err != nil {
			fmt.Println("Error creating request:", err)
			return nil, err
		}

		req.Header.Set("Accept", "*/*")
		req.Header.Set("Accept-Language", "en-US,en;q=0.9")
		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36")

		client := &http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			fmt.Println("Error making request:", err)
			return nil, err
		}
		defer resp.Body.Close()

		fmt.Println("Response Status:", resp.Status)
		bytes, err := io.ReadAll(resp.Body)
		if err != nil {
			fmt.Println(err)
		}

		var srr response.SearchResultResponse
		json.Unmarshal(bytes, &srr)

		getItemsResult.Result = append(getItemsResult.Result, srr.Result...)
		time.Sleep(settings.Sleep * time.Second)
	}

	return &getItemsResult, nil
}
