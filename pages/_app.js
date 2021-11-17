/* pages/_app.js */
import '../styles/globals.css'
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
// import { useEthers, useEtherBalance } from "@usedapp/core";
// import WalletConnectProvider from '@walletconnect/web3-provider'

function MyApp({ Component, pageProps }) {
  // const {activateBrowserWallet, account } = useEthers();
  // const etherBalance = useEtherBalance(account);
  // const [address, setMinting] = useState(false);
  const [address, setConnection] = useState(null);
  
  async function showMetamask() {
    
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)    
    const signer = provider.getSigner()
    const address = await signer.getAddress();
    setConnection(address);
    
  }
  return (
    <div className="main">
      <header id="header">
            {/* Navbar */}
            <nav data-aos="zoom-out" data-aos-delay={800} className="navbar navbar-expand">
                <div className="container header">
                    {/* Navbar Brand*/}
                    <a className="navbar-brand" href="/">
                        <img className="navbar-brand-sticky" src="img/logo.png" alt="sticky brand-logo" />
                    </a>
                    <div className="ml-auto" />
                    {/* Navbar */}
                    <ul className="navbar-nav items mx-auto">
                        <li className="nav-item">
                            <a className="nav-link" href="/">Home</a>
                        </li>
                        <li className="nav-item">
                            <a href="/create-item" className="nav-link">Create</a>
                        </li>
                        <li className="nav-item">
                            <a href="/creator-dashboard" className="nav-link">Creator Dashboard</a>
                        </li>
                        <li className="nav-item">
                            <a href="/my-assets" className="nav-link">My Digital Assets</a>
                        </li>
                    </ul>
                    {/* Navbar Icons */}
                    <ul className="navbar-nav icons">
                        <li className="nav-item">
                            <a href="#" className="nav-link" data-toggle="modal" data-target="#search">
                                <i className="fas fa-search" />
                            </a>
                        </li>
                    </ul>
                    {/* Navbar Toggler */}
                    <ul className="navbar-nav toggle">
                        <li className="nav-item">
                            <a href="#" className="nav-link" data-toggle="modal" data-target="#menu">
                                <i className="fas fa-bars toggle-icon m-0" />
                            </a>
                        </li>
                    </ul>
                    {/* Navbar Action Button */}
                    <ul className="navbar-nav action">
                        <li className="nav-item ml-3">
                          {
                            !address && (
                              <a href="#" className="btn ml-lg-auto btn-bordered-white" onClick={showMetamask}><i className="icon-wallet mr-md-2" />Wallet Connect</a>
                            )
                          }

                          {
                            address && (
                              <span href="#" className="btn ml-lg-auto btn-bordered-white">{address}</span>
                            )
                          }
                              
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
      <Component {...pageProps} />

      <div id="menu" className="modal fade p-0">
        <div className="modal-dialog dialog-animated">
            <div className="modal-content h-100">
                <div className="modal-header" data-dismiss="modal">
                    Menu <i className="far fa-times-circle icon-close" />
                </div>
                <div className="menu modal-body">
                    <div className="row w-100">
                        <div className="items p-0 col-12 text-center" />
                    </div>
                </div>
            </div>
        </div>
        </div>
      {/* <nav className="border-b p-6">
        <p className="text-4xl font-bold">Metaverse Marketplace</p>
        <div className="flex mt-4">
          <Link href="/">
            <a className="mr-4 text-pink-500">
              Home
            </a>
          </Link>
          <Link href="/create-item">
            <a className="mr-6 text-pink-500">
              Sell Digital Asset
            </a>
          </Link>
          <Link href="/my-assets">
            <a className="mr-6 text-pink-500">
              My Digital Assets
            </a>
          </Link>
          <Link href="/creator-dashboard">
            <a className="mr-6 text-pink-500">
              Creator Dashboard
            </a>
          </Link>
          <Link href="/components/Create/Create">
            <a className="mr-6 text-pink-500">
              Create
            </a>
          </Link>
        </div>
      </nav> */}
      
      
    </div>
  )
}

export default MyApp
