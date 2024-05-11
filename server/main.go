package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
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
	http.HandleFunc("/ws", wsHandler)

	fmt.Println("Server running on port 8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		fmt.Println("Error starting server:", err)
	}
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	// CheckOrigin is a function to verify the origin of the request.
	// You might want to adjust the logic depending on your requirements.
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all origins
	},
}

func wsHandler(w http.ResponseWriter, r *http.Request) {
	// Upgrade initial GET request to a websocket
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	defer ws.Close() // Close connection when function returns

	for {
		// Read message as JSON and map it to a Message object
		messageType, message, err := ws.ReadMessage()
		if err != nil {
			log.Println("read:", err)
			break
		}
		log.Printf("recv: %s", message)

		// Write message back to browser
		err = ws.WriteMessage(messageType, message)
		if err != nil {
			log.Println("write:", err)
			break
		}
	}
}
