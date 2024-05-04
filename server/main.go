package main

import (
	"fmt"
	"net/http"

	"github.com/kkevinchou/stashviewer/api"
	"github.com/kkevinchou/stashviewer/settings"
)

func main() {
	startAPI()
}

func startAPI() {
	if settings.DEBUG {
		http.HandleFunc("/search", api.DebugHandler)
	} else {
		http.HandleFunc("/search", api.Handler)
	}

	fmt.Println("Server running on port 8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		fmt.Println("Error starting server:", err)
	}
}
