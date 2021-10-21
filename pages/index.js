/* pages/index.js */
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"


import {
  nftaddress, nftmarketaddress, mytokenaddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'
import MyToken from '../artifacts/contracts/MyToken.sol/MyToken.json'

export default function Home() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    const provider = new ethers.providers.JsonRpcProvider()
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider)
    const data = await marketContract.fetchMarketItems()

    /*
    *  map over items returned from smart contract and format 
    *  them as well as fetch their token metadata
    */
   console.log(data);
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }
      return item
    }))
    setNfts(items)
    console.log(nfts);
    setLoadingState('loaded') 
  }
  async function buyNft(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')   
    const transaction = await contract.createMarketSale(nftaddress, nft.tokenId, {
      value: price
    })
    

    // const price = ethers.utils.parseUnits(nft.price, 18)

    // var decimalPlaces = 18;
    // var price = ethers.utils.parseUnits(nft.price, decimalPlaces);

    // const myToken = new ethers.Contract(mytokenaddress, MyToken.abi, signer);
    // await myToken.approve(nftmarketaddress, price);

    // console.log(11111);

  
    // const transaction = await contract.createMarketSale(nftaddress, mytokenaddress, nft.tokenId, price)
    // console.log(93939)

    await transaction.wait()
    loadNFTs()
  }

  // async function buyItem(nft) {
  //   /* needs the user to sign the transaction, so will use Web3Provider and sign it */
  //   const web3Modal = new Web3Modal()
  //   const connection = await web3Modal.connect()
  //   const provider = new ethers.providers.Web3Provider(connection)
  //   const signer = provider.getSigner()
  //   const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    
  
  //   const myToken = new ethers.Contract(mytokenaddress, MyToken.abi, signer)
  //   // console.log(nft.price)
  //   var decimalPlaces = 18;
  //   var amount = ethers.utils.parseUnits(nft.price, decimalPlaces);

    

  //   myToken.transfer(nft.seller, amount);
  //   contract.sellItem(nft.seller);
  //   // contract.sellItem(nft.seller);
    

  //   // const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')    
  //   // await _token.transfer(nft.seller, eval(nft.price));
  //   // const sell = await contract.sellItem(nft.tokenId)
  //   // const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
  //   // const sell = await contract.sellItem(MyToken.tokenId)
  //   // await sell.wait()
  //   // loadNFTs()
  // }


  if (loadingState === 'loaded' && !nfts.length) return (
    <section className="author-area">
      <div className="container">
        <div className="row">
          <h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>
        </div>
      </div>
    </section>
  )

  return (

    <section className="author-area">
      <div className="container">
          <div className="row">
              <div className="col-12">
                  {/* Intro */}
                  <div className="intro d-flex justify-content-between align-items-end m-0">
                      <div className="intro-content">
                          <span>Home</span>
                          {/* <h3 className="mt-3 mb-0">Home</h3> */}
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
                                  <a className="btn btn-bordered-white btn-smaller mt-3" href="#" onClick={() => buyNft(nft)}><i className="icon-handbag mr-2" />Buy</a>
                              </div>
                          </div>
                      </div>
                  </div>)
                })
              }
          </div>
      </div>
    </section>

    // <div className="flex justify-center">
    //   <div className="px-4" style={{ maxWidth: '1600px' }}>
    //     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
    //       {
    //         nfts.map((nft, i) => (
    //           <div key={i} className="border shadow rounded-xl overflow-hidden">
    //             <img src={nft.image} />
    //             <div className="p-4">
    //               <p style={{ height: '64px' }} className="text-2xl font-semibold">{nft.name}</p>
    //               <div style={{ height: '70px', overflow: 'hidden' }}>
    //                 <p className="text-gray-400">{nft.description}</p>
    //               </div>
    //             </div>
    //             <div className="p-4 bg-black">
    //               <p className="text-2xl mb-4 font-bold text-white">{nft.price} MYT</p>
    //               {/* <button className="w-full bg-pink-500 text-white font-bold py-2 px-12 rounded" onClick={() => buyItem(nft)}>Buy</button> */}
    //               <button className="w-full bg-pink-500 text-white font-bold py-2 px-12 rounded" onClick={() => buyNft(nft)}>Buy</button>
    //             </div>
    //           </div>
    //         ))
    //       }
    //     </div>
    //   </div>
      
    // </div>

    
  )
}
