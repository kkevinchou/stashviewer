export function ButtonHandler() {
    const response = fetch("http://localhost:8080/search&account=kkevinchou", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    });
    response.then((response) => console.log(response));
}
