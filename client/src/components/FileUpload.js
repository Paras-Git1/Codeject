import { useState } from "react";
import axios from "axios";
import "./FileUpload.css"

const FileUpload = ({contract, account, provider}) => {
    const [file,setFile]=useState(null);
    const [fileName, setFileName] = useState("No image selected");

    //handle submit function starts


    const handleSubmit=async(e)=>{
        e.preventDefault();
        if (file){
            try {
                const formData = new FormData();
                formData.append("file", file);
                
                const resFile = await axios({
                    method: "post",
                    url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                    data: formData,
                    headers: {
                      pinata_api_key: `a0a06508d941e3ef55b0`,
                      pinata_secret_api_key: `61c5212158e8ea84514a993aa2d1058c2c0c60758c3fde8d09b3d194522e871e`,
                      "Content-Type": "multipart/form-data",
                    },
                });
                const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
                //const signer = contract.connect(provider.getSigner());
                contract.add(account,ImgHash);
                alert("Sucessfully Uploaded");
                setFileName("No image selected");
                setFile(null);
                } catch (e) {
                alert("unable to upload image to Pinata");
            }
        }
    };
     //Handle submit function ends

    // File read via Name 
    const retrieveFile=(e)=>{
        const data = e.target.files[0]; //array of files object
        console.log(data)
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(data);
        reader.onloadend = () => {
            setFile(e.target.files[0]);
        e.preventDefault();
        };
        setFileName(e.target.files[0].name);
        e.preventDefault();
    };

    //File name read ends



    return <div className="top">
    <form className="form" onSubmit={handleSubmit}>
      <label htmlFor="file-upload" className="choose">
        Choose Image
      </label>
      <input
        disabled={!account}
        type="file"
        id="file-upload"
        name="data"
        onChange={retrieveFile}
      />
      <span className="textArea">Image:{fileName}</span>
      <button type="submit" className="upload" disabled={!file}>Upload Image</button>
    </form>
  </div>
};
export default FileUpload;