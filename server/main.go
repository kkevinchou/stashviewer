package main

import (
	"fmt"
	"net/http"
)

func main() {
	startAPI()
}

func startAPI() {
	http.HandleFunc("/search", handler)

	fmt.Println("Server running on port 8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		fmt.Println("Error starting server:", err)
	}
}
