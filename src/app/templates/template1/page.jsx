"use client";

import React from 'react';
import './hello.css';
import vars from "./var-data.json";

const Hello = () => {
    return (
        <div className="hello-container">
            <h1 className="hello-title">{var1}</h1>
            <p className="hello-description">{var2}</p>
        </div>
    );
};

export default Hello;