import React from "react";
import renderHTML from 'react-render-html';
import {Link} from "react-router-dom";

import {
    getNft,
} from '../../api';

import {
    OnboardingButton,
} from '../../components/MetaMask';

import "./styles.scss"


class SingleNft extends React.Component {


    constructor(props) {
        super(props)

        this.state = {
            nft: [],
            editionsCount: [],

            isNftLoaded: false,
        };
    }


    componentWillMount () {
        const hasLoggedOut = Number(localStorage.getItem('hasLoggedOut'));

        let wallet = '';

        if(window.ethereum) {
            if(window.ethereum.isConnected() && window.ethereum.selectedAddress !== null && hasLoggedOut === 0) {
                wallet = window.ethereum.selectedAddress;
            }
        }

        const data = {
            slug: this.getNftSlug(),
            wallet: wallet,
        }

        return getNft(data).then(resp => {
            if (resp.ok) {
                this.setState({
                  nft: resp.nft,
                  editions: resp.editions,
                  editionsCount: resp.editions_count,

                  isNftLoaded: true,
                });
            }
        });
    }


    getNftSlug() {
        const { nftslug } = this.props.match.params;

        if (nftslug) {
            return nftslug;
        }

        return '';
    }


    renderEditions() {
        const nft = this.state.nft
        const status = {
            0 : "available",
            1 : "pending",
            2 : "sold",
        }

        const yourItem = {
            0: "",
            1: "your item",
        }

        console.log(this.state.editions);

        return (
          <section className="list-of-editions">
              {this.state.editions.map(item => (
                  <>
                    <div className="nft-mini">
                        <div className="nft-mini__wrap">
                            <Link to={`/${nft.slug}/${item.ID}`}>
                                <div className="nft-mini__wrap__wrap">
                                    <div className="nft-mini__wrap__wrap__wrap">
                                        <div className="thumbnail">
                                            <div className="thumbnail__wrap">
                                                <div className="thumbnail__wrap__wrap">
                                                    <div className="thumbnail__wrap__wrap__wrap">
                                                        <img src={nft.media.thumbnail} alt={nft.title} className={ "thumbnail-img " + status[item.orderStatus]} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                            <div className="nft-mini__title">
                                <Link to={`/${nft.slug}/${item.ID}`}>
                                    <div className="nft-mini__title__wrap">
                                        <h4 className="htitle">#{item.ID} {nft.title}</h4>
                                        <div className="price">Ξ{item.price}ETH</div>
                                        <span className={'nft-mini__status ' +  status[item.orderStatus] } >
                                            { status[item.orderStatus] }
                                        </span>
                                    </div>
                                </Link>
                                <div className="your-item">
                                    { yourItem[item.yourItem] }
                                </div>
                            </div>
                        </div>
                    </div>
                  </>
              ))}
          </section>
        )
    }


    render() {
        const {nft, isNftLoaded, editionsCount} = this.state;
        const myEditionsCount = parseInt(editionsCount, 10);

        let contentMedia = '';
        let contentNft = '';

        if (isNftLoaded) {
            if (myEditionsCount === 0) {
                contentNft = (
                    <div className='etitons-empty'>
                        Editions of nft not found
                    </div>
                )
            } else {
                contentNft = (
                    <div className="nft-single">
                        <div className="nft-single__wrap">
                            <div className="nft-single__picture">
                                <figure class="article-featured__image">
                                    <img class="img-thumbnail" src={nft.media.preview} />
                                </figure>
                            </div>
                            <div className="nft-single__data">
                                <h1 className="title">{nft.title}</h1>
                                <div className="product-details__editions">
                                    Edition of <span>{editionsCount}</span>
                                </div>
                                <ul className="product-details__info">
                                    { /* for type editions disabled <li><span className="price">Ξ{nft.price}ETH</span></li> */ }
                                    <li>Ticker: <span>{nft.ticker}</span></li>
                                </ul>
                                <div className="product-details__description">
                                    {renderHTML(nft.description)}
                                </div>
                            </div>
                        </div>
                        <div className="nft-single__editions">
                            {this.renderEditions()}
                        </div>
                    </div>
                );
            }
        }

        return (
            <div className="container single-product-page">
                {contentNft}
            </div>
        )
    }
}


export default SingleNft;
