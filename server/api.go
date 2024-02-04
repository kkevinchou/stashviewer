package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

type Response struct {
	Message string
}

func handler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "OPTIONS" {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "*")
		return
	}

	query := r.URL.Query()["account"]
	if len(query) <= 0 {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("missing account query parameter"))
		return
	}

	account := query[0]

	sr, err := search(account)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(fmt.Sprintf("failed to fetch search results %s", err.Error())))
		return
	}

	srr, err := getItems(sr)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(fmt.Sprintf("failed to fetch items %s", err.Error())))
		return
	}

	// response := Response{Message: string(bytes)}
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "*")
	json.NewEncoder(w).Encode(srr)
}

func search(account string) (*SearchResponse, error) {
	url := "https://www.pathofexile.com/api/trade/search/Affliction"

	body := []byte(
		fmt.Sprintf(`{"query":{"status":{"option":"any"},"stats":[{"type":"and","filters":[],"disabled":false}],"filters":{"trade_filters":{"filters":{"account":{"input":"%s"}}},"type_filters":{"filters":{"category":{"option":"weapon"},"rarity":{"option":"rare"}}}}},"sort":{"price":"asc"}}`, account),
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
		return nil, err
		fmt.Println(err)
	}

	var sr SearchResponse
	json.Unmarshal(bytes, &sr)

	return &sr, nil
}

func getItems(sr *SearchResponse) (*SearchResultResponse, error) {
	url := "https://www.pathofexile.com/api/trade/fetch/"
	for _, result := range sr.Result {
		url += result + ","
	}
	url = url[:len(url)-1]

	url += "?query=" + sr.ID
	// body := []byte(fmt.Sprintf(`{"query": %s }`, sr.ID))

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

	return &srr, nil
}
