package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"time"
)

type Response struct {
	Message string
}

func Handler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "OPTIONS" {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "*")
		return
	}

	// query := r.URL.Query()["account"]
	// if len(query) <= 0 {
	// 	w.WriteHeader(http.StatusInternalServerError)
	// 	w.Write([]byte("missing account query parameter"))
	// 	return
	// }

	// account := query[0]

	// sr, err := search(account)
	// if err != nil {
	// 	w.WriteHeader(http.StatusInternalServerError)
	// 	w.Write([]byte(fmt.Sprintf("failed to fetch search results %s", err.Error())))
	// 	return
	// }

	// srr, err := getItems(sr)
	// if err != nil {
	// 	w.WriteHeader(http.StatusInternalServerError)
	// 	w.Write([]byte(fmt.Sprintf("failed to fetch items %s", err.Error())))
	// 	return
	// }

	// // cache real data
	// bytes, err := json.Marshal(*srr)
	// if err != nil {
	// 	panic(err)
	// }

	// err = os.WriteFile(fmt.Sprintf("./sample/%s-%d.json", account, time.Now().Unix()), bytes, 0644)
	// if err != nil {
	// 	panic(err)
	// }

	// DEBUGGING

	srr := &SearchResultResponse{}

	f, err := os.Open("./sample/kkevinchou-1707189260.json")
	if err != nil {
		panic(err)
	}
	defer f.Close()

	bytes, err := io.ReadAll(f)
	if err != nil {
		panic(err)
	}

	err = json.Unmarshal(bytes, srr)
	if err != nil {
		panic(err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "*")
	json.NewEncoder(w).Encode(srr)
}

func search(account string) (*SearchResponse, error) {
	url := "https://www.pathofexile.com/api/trade/search/Affliction"

	body := []byte(
		fmt.Sprintf(`{"query":{"status":{"option":"any"},"stats":[{"type":"and","filters":[],"disabled":false}],"filters":{"trade_filters":{"filters":{"account":{"input":"%s"}}},"type_filters":{"filters":{"rarity":{"option":"rare"}}}}},"sort":{"price":"asc"}}`, account),
	)

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(body))
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
		fmt.Println("Error response:", err)
		return nil, err
	}

	var sr SearchResponse
	json.Unmarshal(bytes, &sr)

	return &sr, nil
}

func getItems(sr *SearchResponse) (*SearchResultResponse, error) {
	var getItemsResult SearchResultResponse

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

		var srr SearchResultResponse
		json.Unmarshal(bytes, &srr)

		getItemsResult.Result = append(getItemsResult.Result, srr.Result...)
		time.Sleep(1 * time.Second)
	}

	return &getItemsResult, nil
}
