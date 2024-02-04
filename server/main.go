package main

import (
	"fmt"
	"net/http"

	"github.com/kkevinchou/stashviewer/api"
)

func main() {
	startAPI()
}

func startAPI() {
	http.HandleFunc("/search", api.Handler)

	fmt.Println("Server running on port 8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		fmt.Println("Error starting server:", err)
	}
}
