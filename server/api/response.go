package api

type SearchResponse struct {
	ID     string `json:"id"`
	Result []string
}

type SearchResultResponse struct {
	Result []Result
}

type Result struct {
	ID      string `json:"id"`
	Listing Listing
	Item    Item
}

type Item struct {
	ID           string `json:"id"`
	W            int
	H            int
	Icon         string
	Influences   map[string]bool
	Name         string
	BaseType     string
	Ilvl         int
	Identified   bool
	ImplicitMods []string
	ExplicitMods []string
	CraftedMods  []string
}

type Listing struct {
	Stash   Stash
	Account Account
	Price   Price
}

type Stash struct {
	Name string
	X    int
	Y    int
}

type Account struct {
	Name              string
	LastCharacterName string
}

type Price struct {
	Type     string
	Amount   float64
	Currency string
}
