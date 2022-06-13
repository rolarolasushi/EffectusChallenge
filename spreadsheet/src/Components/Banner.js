import React from "react";
import "../Utils/style.css"
import logo from "../Utils/images/effectus.png"
const Banner = (props) => {
    return (

        <div className="head-image" >
            <img src={logo} className="bannerImg" alt="bannerImg"></img>
            <div class='bannerContText'>
                <h1 className="bannerTitle">Effectus Challenge</h1>
                <h2 className="bannerSubTitle"> Custom Spreadsheet</h2>
            </div>
        </div>
    );
};

export default Banner;