export function ButtonHandler() {
    // const body = {"query":{"status":{"option":"online"},"stats":[{"type":"and","filters":[],"disabled":false}],"filters":{"trade_filters":{"filters":{"account":{"input":"tag_griffin"}},"disabled":false}}},"sort":{"price":"asc"}}
    const response = fetch('http://localhost:8080/search',{
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        // body: JSON.stringify(body)
    });
    response.then((response) => console.log(response));
}
