import React,{useState,useEffect} from 'react'
import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";

import Navbar from "../components/Navbar"
import client from "../components/Sanityclient"

export default function Home() {

  const [walletAddress,setWalletAddress] = useState('')
  const [hrWallet,setHrWallet] = useState('')
  const [sendAddress,setSendAddress] = useState('')
  const [amount, setAmount] = useState(0)
  const [flowRate, setFlowRate] = useState(0)


  const getAddressData = () => {
    const query = `*[_type=='employee' && position=='HR']{walletAddress}`

    client.fetch(query).then((address) => {
      setHrWallet(address[0].walletAddress)
      console.log(hrWallet)
    })
    console.log(walletAddress)
    
  }
  async function createNewFlow(walletAddress, amount) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
  
    const signer = provider.getSigner();
  
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    const sf = await Framework.create({
      chainId: Number(chainId),
      provider: provider
    });
  
    const USDCxContract = await sf.loadSuperToken("fUSDCx");
    const USDCx = USDCxContract.address;
    
    //console.log(amount)
    await calculateFlowRate(amount)
    console.log(flowRate)
    console.log(sendAddress)
  
    try {
      const createFlowOperation = sf.cfaV1.createFlow({
        receiver: sendAddress,
        flowRate: flowRate,
        superToken: USDCx
        // userData?: string
      });
  
      console.log("Creating your stream...");
  
      const result = await createFlowOperation.exec(signer);
      //console.log(result);
  
      console.log(
        `Congrats - you've just created a money stream!
      View Your Stream At: https://app.superfluid.finance/dashboard/${sendAddress}
      Network: Polygon Mumbai
      Super Token:USDCx
      Receiver: ${sendAddress},
      FlowRate: ${flowRate}
      `
      );
    } catch (error) {
      console.log(
        "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
      );
      console.error(error);
    }
  }

  function calculateFlowRate(amountInEther) {
    if (
      typeof Number(amountInEther) !== "number" ||
      isNaN(Number(amountInEther)) === true
    ) {
      console.log(typeof Number(amountInEther));
      console.log(amountInEther)
      alert("You can only calculate a flowRate based on a number");
      return;
    } else if (typeof Number(amountInEther) === "number") {
      const monthlyAmount = ethers.utils.parseEther(amountInEther.toString());
      const calculatedFlowRate = Math.floor(monthlyAmount / 3600 / 24 / 30);
      console.log(calculateFlowRate)
      setFlowRate(calculatedFlowRate);
    }
  }

  const dataSubmit = () => {
    const query = `*[_type=='employee' && walletAddress==$address]{name,walletAddress,salary}`
    const params = {address:sendAddress}
    client.fetch(query,params).then((item) => {
      console.log(item)
      if (item.length==0 || amount!=item[0].salary) {
        document.getElementById('checkAddress').innerHTML = 'Details Inserted are Incorrect'
      } else {
        createNewFlow(walletAddress,amount)
        document.getElementById('checkAddress').innerHTML = `Salary Given to: ${item[0].name}`
      }
    })
    
  }

  useEffect(() => {
    getAddressData()
  },[hrWallet])

  return (
  <div>
    <Navbar address={walletAddress} setWalletAddress={setWalletAddress}/>
    
    {hrWallet.toLowerCase() == walletAddress.toLowerCase() ? 
    (<div className="container mt-5 pt-5 text-center">
      <input className="form-control mb-3" type="text" placeholder="Enter Employee Address..." onChange={(e) => {setSendAddress(e.target.value)}}/>
      <input className="form-control mb-5" type="text" placeholder="Amount" onChange={(e) => {setAmount(e.target.value)}}/>
      <span id='checkAddress'></span>
      <div className="d-grid gap-2">
        <button type="button" className="btn btn-outline-success mt-3" onClick={dataSubmit}>Send Amount</button>
      </div>
    </div>) : (<h1>Unauthorised Access</h1>)}
  </div>
  )
}

