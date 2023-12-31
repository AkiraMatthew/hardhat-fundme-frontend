import { ethers } from "../ethers-5.6.esm.min.js";
import { abi, contractAddress } from "../constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const balanceButton = document.getElementById("balanceButton");
const withdrawButton = document.getElementById("withdrawButton");
connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;

console.log(ethers);

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        window.ethereum.request({ method: "eth_requestAccounts" });
        connectButton.innerHTML = "Connected!";
    } else {
        connectButton.innerHTML = "No Wallet Detected";
    }
}

// get balance
async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(contractAddress);
        console.log(ethers.utils.formatEther(balance));
    }
}

// fund function
async function fund() {
    const ethAmount = document.getElementById("ethAmount").value; // buggy, needs a minimum value of 25eth
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
            const txResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            });
            // listen for the tx to be mined
            // listen for this tx to be finished
            await listenForTxMine(txResponse, provider);
            // listen for an event
            console.log("Done!");
        } catch (error) {
            console.log(error);
        }
    }
}

function listenForTxMine(txResponse, provider) {
    console.log(`Mining ${txResponse.hash}...`);
    // create a listener to the blockchain
    return new Promise((resolve, reject) => {
        provider.once(txResponse.hash, (txReceipt) => {
            console.log(
                `Completed with ${txReceipt.confirmations} confirmations`
            );
            resolve();
        });
    });
}

// withdraw
async function withdraw() {
    if (typeof window.ethereum !== "undefined") {
        console.log("Withdrawing...");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer); // ?
        try {
            const txResponse = await contract.withdraw();
            await listenForTxMine(txResponse, provider);
        } catch (error) {
            console.log(error);
        }
    }
}
