import React, { useState, useEffect } from 'react';
import "./styles.scss";

import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { setHasLoggedOut, metaMaskLogin, metaMaskLogout } from "../../store/metaMaskSlice";

import Web3 from "web3";


import {
    getGasPrice,
} from '../../api';


const Mint = (props) => {
    const [state, setState] = useState({
        isEthereumConnected: false,
        isEthereumChecked: false,
        hasLoggedOut: '',

        gasPrice: '',
        isGasPriceLoaded: false,

        numberOfTokens: 1,
    });

    const dispatch = useDispatch();
    const {isEthereumConnected, isEthereumChecked, hasLoggedOut} = useSelector((state) => state.metaMask);

    var web3 = new Web3(Web3.givenProvider);

    console.log('web3 ');
    console.log(web3);

    useEffect(() => {
        const resp = getGasPrice();

        //if (resp.ok) {
            setState((prev) => ({
                ...prev,
                gasPrice: resp.gasPrice,
                isGasPriceLoaded: true,
            }));

            console.log('gas price1: ');
            console.log(resp.gasPrice);

        //}


        setState((prev) => ({
            ...prev,
            isEthereumConnected: isEthereumConnected,
            isEthereumChecked: isEthereumChecked,
            hasLoggedOut: hasLoggedOut,
        }));
    }, [isEthereumConnected, hasLoggedOut, isEthereumChecked]);

    function onLogin() {
        return () => {
            if(window.ethereum) {

                window.ethereum
                    .request({
                        method: "wallet_requestPermissions",
                        params: [{
                                eth_accounts: {}
                        }]
                    })
                    .then((relult) => {
                        //if(!!relult[0].id) {
                            setTimeout(function(){
                                dispatch(metaMaskLogin());
                            }, 2000)
                        //}
                    })
                    .catch((error) => {
                        console.log(error)
                        if(window.ethereum) {
                            if(state.isEthereumConnected && state.hasLoggedOut === 0) {
                                setTimeout(function(){
                                    dispatch(metaMaskLogin());
                                }, 2000)
                            }
                        }
                    });

            } else {
                window.alert("Non-Ethereum browser detected. You should consider trying MetaMask!");
                console.log("Non-Ethereum browser detected. You should consider trying MetaMask!");
            }

        }
    }

    function decimalToHex(number) {
        return '0x' + Math.abs(number).toString(16);
    }

    const onNumberOfTokens = e => {
        setState((prev) => ({
            ...prev,
            numberOfTokens: e.target.value,
        }));
    }

    function onMint() {
        return () => {
            if(window.ethereum && window.ethereum.selectedAddress !== null) {

                window.ethereum.request({ method: 'eth_chainId' })
                  .then((chain) => {
                    setState((prev) => ({
                        ...prev,
                        selectedNetwork: chain,
                    }));
                });
                //handleChainChanged(chainId);

                if(state.selectedNetwork === "0x4") {

                    const hasLoggedOut = Number(localStorage.getItem('hasLoggedOut'));
                    const myAbi = web3.eth.abi.encodeFunctionCall({
                        name: 'mintNFT',
                        type: 'function',
                        inputs: [{
                            type: 'uint256',
                            name: 'numberOfTokens',
                        }]
                    }, [state.numberOfTokens]);

                    console.log(myAbi);

                    const gasDecimal = 500000;
                    const gasPriceDecimal = 1000000000 * 43;
                    const priceDecimal = 0.042 * 1000000000000000000;

                    const gasHex = decimalToHex(gasDecimal);
                    const gasPriceHex = decimalToHex(gasPriceDecimal);
                    const priceHex = decimalToHex(priceDecimal);

                    // 0x6a62784200000000000000000000000035a7f36f4ff44aa1411ded49d6657c8e9c5e7e91

                    const transactionParameters = {
                        nonce: '0x00',
                        gasPrice: gasPriceHex,
                        gas: gasHex,
                        to: '0xC2e9cED192d551EB65629A48E023c230d84A3E5d',
                        from: window.ethereum.selectedAddress,
                        value: priceHex,
                        data: myAbi,
                        chainId: '0x32',
                    };

                    const txHash = ethereum.request({
                        method: 'eth_sendTransaction',
                        params: [transactionParameters],
                    });

                } else {
                    window.alert("Plase change MetaMask network to Rinkeby");
                }
            }
        }
    }

    let contentMint = '';

    if(state.isEthereumConnected && hasLoggedOut === 0) {

            contentMint = (
                         <button className=""
                            onClick={onMint()}
                            onKeyPress={onMint()}>
                            Mint
                        </button>
                    );
    } else {
        contentMint = (
            <button className="btnMint"
                onClick={onLogin()}
                onKeyPress={onLogin()}>
                Connect wallet
            </button>
        );
    }


    return (
        <div className="page page-text about">
            <div className="page-title">
                <div className="page-title__wrap">
                    <h1 color="white" className="htitle">Mint</h1>
                </div>
                <br /><br />
                { /*
                <div className="page-title__shadow">
                    <span color="white" className="hshadow">Mint</span>
                </div>
                */ }
                <label>Number of tokens: </label>
                <input type="text" value={state.numberOfTokens} onChange={onNumberOfTokens} />
                { /* <div color="white" className="hr-title"></div> */ }
            </div>
            <div className="page-content">
                {contentMint}
            </div>
        </div>
    )

}

export default Mint;