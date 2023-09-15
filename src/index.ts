interface Window {
    ethereum: any;
}

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        console.log("Metamask is available");
        window.ethereum.request({ method: "eth_requestAccounts" });
        document.getElementById("connectButton")!.innerHTML = "Connected!";
    } else {
        document.getElementById("connectButton")!.innerHTML =
            "No Wallet Detected";
    }
}
