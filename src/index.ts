const ethSigUtil = require("eth-sig-util");
import WalletLink from "walletlink";
import Web3 from "web3";

const ETH_JSONRPC_URL = "";
const CHAIN_ID = 1;

if (ETH_JSONRPC_URL.length === 0) {
  appendResult("No JSON RPC URL provided");
}

const walletlink = new WalletLink({
  appName: "Test Sign Typed Data",
  darkMode: true,
});

const ethereum = walletlink.makeWeb3Provider(ETH_JSONRPC_URL, CHAIN_ID);
const web3 = new Web3(ethereum as any);

const typedData = {
  types: {
    EIP712Domain: [
      {
        name: "name",
        type: "string",
      },
      {
        name: "version",
        type: "string",
      },
      {
        name: "chainId",
        type: "uint256",
      },
    ],
    dYdX: [
      {
        type: "string",
        name: "action",
      },
    ],
  },
  domain: {
    name: "dYdX",
    version: "1.0",
    chainId: 3,
  },
  primaryType: "dYdX",
  message: {
    action: "dYdX STARK Key",
  },
};

async function eth_sign_typed_data() {
  const accounts = await ethereum.send("eth_requestAccounts");
  ethereum.sendAsync(
    {
      jsonrpc: "2.0",
      id: 1,
      method: "eth_signTypedData",
      params: [accounts[0], typedData],
    },
    (error: any, result: any) => {
      if (error) {
        console.error(error);
        appendResult(`Error: ${error.message}`);
        return;
      }

      appendResult(`Signed Result: ${result.result}`);

      // Verify signer
      const recovered = ethSigUtil.recoverTypedSignature({
        data: typedData,
        sig: result.result,
      });

      if (
        web3.utils.toChecksumAddress(recovered) ===
        web3.utils.toChecksumAddress(accounts[0])
      ) {
        appendResult(`Verfied signer as ${accounts[0]}`);
      } else {
        appendResult(`Could not verify signer: ${recovered}`);
      }
    }
  );
}

function appendResult(message: string) {
  document.getElementById("results")!.innerHTML += `<br>${message}`;
}

document
  .getElementById("sign_typed_data")!
  .addEventListener("click", eth_sign_typed_data);

export {};
