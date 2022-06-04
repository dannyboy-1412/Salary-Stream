import React,{useEffect} from 'react';

const Navbar = (props) => {

    const connectWallet = async () => {
        if (window.ethereum) {
          try {
            const addressArray = await window.ethereum.request({
              method: "eth_requestAccounts",
            });
            props.setWalletAddress(addressArray[0]);
          } catch (err) {
            console.log(err);
          }
        } else {
          alert("Please Install Metamask");
        }
      };
    
      const getCurrentWalletConnected = async () => {
        if (window.ethereum) {
          try {
            const addressArray = await window.ethereum.request({
              method: "eth_accounts",
            });
            if(addressArray.length>0){
              props.setWalletAddress(addressArray[0]); 
            } else {
              props.setWalletAddress("");
            }
          } catch (err) {
            console.log(err);
          }
        } else {
          alert("Please Install Metamask");
        }
      };

      useEffect(() => {
        getCurrentWalletConnected()
      },[props.address])

    return (
    <nav className="navbar bg-light">
        <div className="container-fluid">
            <span className="navbar-brand mb-0 h1">MONEY FLOW</span>
            <div className="nav justify-content-end">
                <button type="button" className="btn btn-outline-secondary" onClick={connectWallet}>
                {props.address.length > 0 ? (
                    "Connected: " +
                    props.address.substring(0, 6) +
                    "..." + props.address.substring(38)
                    ) : (<span>Connect Wallet</span>)}
                </button>
            </div>
        </div>
        
    </nav>
    )
}

export default Navbar;