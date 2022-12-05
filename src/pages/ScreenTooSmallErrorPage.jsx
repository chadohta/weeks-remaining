import React from "react";

const errorContentStyle = {
    width: "50%",
    margin: "50px auto",
    textAlign: "center",
};

const ScreenTooSmallErrorPage = () => {
    return (
        <p style={errorContentStyle}>
            Thanks for checking out my web app! Unfortunately it is not optimized for
            mobile so please view it on desktop when you get the chance 😄
        </p>
    );
};

export default ScreenTooSmallErrorPage;
