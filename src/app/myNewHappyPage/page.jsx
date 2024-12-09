"use client";

import React from 'react';
import './hello.css';
import pageData from "./var-data.json";

const Hello = () => {
    const { vars } = pageData;
    return (
        <div className="hello-container">
            <h1 className="hello-title">{vars.var1}</h1>
            <p className="hello-description">{vars.var2}</p>
        </div>
    );
};

export default Hello;