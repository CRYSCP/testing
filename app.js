// Import required libraries
const express = require('express');
const Web3 = require('web3');

// Initialize Web3
const web3 = new Web3(new Web3.providers.HttpProvider('https://arb1.arbitrum.io/rpc'));

// Contract Address and ABI
const contractAddress = '0x31c91d8fb96bff40955dd2dbc909b36e8b104dde';
const abi = [
  {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "name": "",
        "type": "uint8"
      }
    ],
    "payable": false,
    "type": "function"
  }
];

// Initialize Contract
const contract = new web3.eth.Contract(abi, contractAddress);

// Create API endpoint
const app = express();
const port = 3000;

app.get('/api/v1/totalsupply', async (req, res) => {
  try {
    const totalSupply = await contract.methods.totalSupply().call();
    const decimals = await contract.methods.decimals().call();

    // Convert to BigNumber and apply decimals
    const divisor = Math.pow(10, decimals);
    const correctTotalSupply = totalSupply / divisor;

    // Send response
    res.status(200).send(correctTotalSupply.toString());
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
