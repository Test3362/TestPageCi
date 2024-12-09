import { NextRequest, NextResponse } from "next/server";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import addPageScript from "../../../services/AddPageScript.js";

export const POST = async (req : NextRequest) => {
    const data = await req.json();
    //console.log("data at next api => ", data);

    const folderName = data.folderName;
    const pageData = data.pageData;

    console.log("folderName => ", folderName);  
    console.log("pageData => ", pageData);

    const res = addPageScript(folderName, pageData);
    if(!res) {
        return NextResponse.json({ status: 400, message: "Error creating folder" });
    }

    return NextResponse.json({ status: 200, message: "Folder created successfully" });
}