import { ethers } from "../ethers-5.6.esm.min.js";
import { abi, contractAddress } from "../constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
connectButton.onclick = connect;
fundButton.onclick = fund;

console.log(ethers);

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        window.ethereum.request({ method: "eth_requestAccounts" });
        connectButton.innerHTML = "Connected!";
    } else {
        connectButton.innerHTML = "No Wallet Detected";
    }
}
// fund function
async function fund() {
    const ethAmount = "35.65";
    console.log(`Funding with ${ethAmount}...`);
    if (typeof window.ethereum !== "undefined") {
        // The following is what we need to send a trx through a
        // website
        // provider / blockchain connection
        // signer / wallet / someone with gas
        // contract that we are interacting with
        //  ^ ABI & address
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer); // ?
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            });
        } catch (error) {
            console.log(error);
        }
    }
}
// withdraw
