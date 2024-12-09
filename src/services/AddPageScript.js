import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//console.log("Directory name here => ", __dirname);

const pageDir = resolve(__dirname, "../app")
console.log("Page directory => ", pageDir);

const templateDir = resolve(__dirname, "../app/templates")
console.log("Template directory => ", templateDir);


// Function to create the folder
const createFolder = (folderName) => {
    if (!folderName) {
        console.log("Please provide the folder name");
        return false;
    }

    const folderPath = join(pageDir, folderName);
    console.log("Folder path =>", folderPath);

    if(fs.existsSync(folderPath)) {
        console.log(`Folder already exists: ${folderPath}`);
        return false;
    }

    try {
        fs.mkdirSync(folderPath, { recursive: true }); // Added `recursive: true` in case parent directories don't exist
        console.log(`Folder created: ${folderPath}`);
        return true;
    } catch (error) {
        console.error(`Error creating folder: ${error.message}`);
        return false;
    }
};

const copyFromTemplate = (sourceDirname, destinationDirname) => { //recursive function, to copy nested dirs as well.
    try {
        const sourcePath = join(templateDir, sourceDirname);
        const destinationPath = join(pageDir, destinationDirname);

        if(!fs.existsSync(sourcePath)){
            console.log(`Source path does not exist: ${sourcePath}`);
            return false;
        }

        if(!fs.existsSync(destinationPath)){
            fs.mkdirSync(destinationPath, { recursive: true });
        }

        const items = fs.readdirSync(sourcePath, { withFileTypes: true });

        items.forEach(item => {
            const sourceFilePath = join(sourcePath, item.name);
            const destinationFilePath = join(destinationPath, item.name);

            if(item.isDirectory()){
                copyFromTemplate(join(sourceDirname, item.name), join(destinationDirname, item.name));   
            }else{
                fs.copyFileSync(sourceFilePath, destinationFilePath);
                console.log(`File copied: ${sourceFilePath} => ${destinationFilePath}`);
            }
        });

        return true;
    } catch (error) {

        console.error(`Error copying files: ${error.message}`);
        return false;
    }
}

const createVarData = (folderName, data) => {
    if (!folderName) {
        console.log("Please provide the folder name");
        return false;
    }

    const varData = JSON.stringify(data);
    const varDataPath = join(pageDir, folderName, "var-data.json");

    fs.writeFile(varDataPath, varData, (err) => {
        if(err) {
            console.error(`Error writing var data: ${err.message}`);
            return false;
        }
        console.log(`Var data written: ${varDataPath}`);
    });
    return true;
}

const addPageScript = (folderName, data) => {
    if (!folderName || !data) {
        console.log("Please provide the folder name and data!");
        return false;
    }

    // console.log("Folder name => ", folderName);
    // console.log("Data => ", data);


    const isFolderCreated = createFolder(folderName);
    const isTemplateCopied = copyFromTemplate("template1", folderName);
    const isVarDataCreated = createVarData(folderName, {
        "var1": data.var1,
        "var2": data.var2,
    });

    return isFolderCreated && isTemplateCopied && isVarDataCreated;
};

export default addPageScript;