/* pages/creator-dashboard.js */
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"

import {
  nftmarketaddress, nftaddress
} from '../config'

import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'

export default function CreatorDashboard() {
  const [nfts, setNfts] = useState([])
  const [sold, setSold] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const data = await marketContract.fetchItemsCreated()
    
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        sold: i.sold,
        image: meta.data.image,
      }
      return item
    }))
    console.log(items);
    /* create a filtered array of items that have been sold */
    const soldItems = items.filter(i => i.sold)
    setSold(soldItems)
    setNfts(items)
    setLoadingState('loaded') 
  }
  console.log(nfts);
  if (loadingState === 'loaded' && !nfts.length) return (
    <section className="author-area">
      <div className="container">
        <div className="row">
          <h1 className="py-10 px-20 text-3xl">No assets created</h1>
        </div>
      </div>
    </section>)
  return (
    <section className="author-area">
      <div className="container">
        <div>
          <div className="row">
              <div className="col-12">
                  {/* Intro */}
                  <div className="intro d-flex justify-content-between align-items-end m-0">
                      <div className="intro-content">
                          <span>Creator Dashboard</span>
                          {/* <h3 className="mt-3 mb-0">Creator Dashboard</h3> */}
                      </div>
                  </div>
              </div>
          </div>
          <div className="row items">
              {
                nfts.map((nft, i) => {
                  return (<div key={i} className="col-12 col-sm-6 col-lg-3 item">
                      <div className="card">
                          <div className="image-over">
                              <a href="#">
                                  <img className="card-img-top" src={nft.image} alt="" />
                              </a>
                          </div>
                          {/* Card Caption */}
                          <div className="card-caption col-12 p-0">
                              {/* Card Body */}
                              <div className="card-body">
                                  <a href="#">
                                      <h5 className="mb-0">{nft.title}</h5>
                                  </a>
                                  <div className="seller d-flex align-items-center my-3">
                                      <span>Description</span>
                                      <a href="#">
                                          <h6 className="ml-2 mb-0">{nft.description}</h6>
                                      </a>
                                  </div>
                                  <div className="card-bottom d-flex justify-content-between">
                                      <span>Price {nft.price} ETH</span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>)
                })
              }
          </div>
        </div>
        
        <div className="mt-5">
        {
          Boolean(sold.length) && (
            <div>
              <div className="row">
                  <div className="col-12">
                      {/* Intro */}
                      <div className="intro d-flex justify-content-between align-items-end m-0">
                          <div className="intro-content">
                              <span>Items sold</span>
                              {/* <h3 className="mt-3 mb-0">Items sold</h3> */}
                          </div>
                      </div>
                  </div>
              </div>
              <div className="row items">
                  {
                    sold.map((nft, i) => {
                      return (<div key={i} className="col-12 col-sm-6 col-lg-3 item">
                          <div className="card">
                              <div className="image-over">
                                  <a href="#">
                                      <img className="card-img-top" src={nft.image} alt="" />
                                  </a>
                              </div>
                              {/* Card Caption */}
                              <div className="card-caption col-12 p-0">
                                  {/* Card Body */}
                                  <div className="card-body">
                                      <a href="#">
                                          <h5 className="mb-0">{nft.title}</h5>
                                      </a>
                                      <div className="seller d-flex align-items-center my-3">
                                          <span>Description</span>
                                          <a href="#">
                                              <h6 className="ml-2 mb-0">{nft.description}</h6>
                                          </a>
                                      </div>
                                      <div className="card-bottom d-flex justify-content-between">
                                          <span>Price {nft.price} ETH</span>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>)
                    })
                  }
              </div>
            </div>
          )
        }
        </div>
      </div>
    </section>

    // <div>
    //   <div className="p-4">
    //     <h2 className="text-2xl py-2">Items Created</h2>
    //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
    //       {
    //         nfts.map((nft, i) => (
    //           <div key={i} className="border shadow rounded-xl overflow-hidden">
    //             <img src={nft.image} className="rounded" />
    //             <div className="p-4 bg-black">
    //               <p className="text-2xl font-bold text-white">Price - {nft.price} Eth</p>
    //             </div>
    //           </div>
    //         ))
    //       }
    //     </div>
    //   </div>
    //     <div className="px-4">
    //     {
    //       Boolean(sold.length) && (
    //         <div>
    //           <h2 className="text-2xl py-2">Items sold</h2>
    //           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
    //             {
    //               sold.map((nft, i) => (
    //                 <div key={i} className="border shadow rounded-xl overflow-hidden">
    //                   <img src={nft.image} className="rounded" />
    //                   <div className="p-4 bg-black">
    //                     <p className="text-2xl font-bold text-white">Price - {nft.price} Eth</p>
    //                   </div>
    //                 </div>
    //               ))
    //             }
    //           </div>
    //         </div>
    //       )
    //     }
    //     </div>
    // </div>
  )
}
