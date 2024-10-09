import Web3 from "web3";
import ABI from "./ABI.json";

const CONTRACT_ADDRESS = "0x1ad0192DbcA529D6550E384BBF58728D3dEEF553";
const OWNER_ADDRESS = "0xFe6C9f2C6C92835bCa8A3C2a295a731004DD299d";

export async function doLogin() {

    if(!window.ethereum) throw new Error("MetaMask não está instalada!");

    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.requestAccounts();
    if(!accounts || !accounts.length) throw new Error("MetaMask não foi autorizada");

    localStorage.setItem("wallet", accounts[0]);
    return accounts[0];
}

function getContract() {
    if(!window.ethereum) throw new Error("MetaMask não está instalada!");

    const from = localStorage.getItem("wallet");
    const web3 = new Web3(window.ethereum);

    return new web3.eth.Contract(ABI, CONTRACT_ADDRESS, { from });
}

export async function getDispute() {
    const contract = getContract();
    return contract.methods.dispute().call();

}

export async function placeBet(candidate, amountInEth) {
    const contract = getContract();
    return contract.methods.bet(candidate).send({
        value: Web3.utils.toWei(amountInEth, "ether")
    });

}

export async function claimPrize() {
    const contract = getContract();
    return contract.methods.claim().send()
}

export async function isOwner() {
    const wallet = localStorage.getItem("wallet");
    if (!wallet) return false;
    return wallet.toLowerCase() === OWNER_ADDRESS.toLowerCase();
}

export async function finishDispute(winner) {
    try {
        const contract = await getContract();
        return await contract.methods.finish(winner).send();
    } catch (err) {
        throw new Error("Erro ao finalizar a disputa: " + (err.message || err));
    }
}

export async function feeClaim() {
    try {
        const contract = await getContract();
        return await contract.methods.feeClaim().send();
    } catch (err) {
        throw new Error("Erro ao sacar as taxas: " + (err.message || err));
    }
}