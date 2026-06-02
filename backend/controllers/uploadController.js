import { RestoreStatus$ } from "@aws-sdk/client-s3";
import { getSignedUrlFromS3 } from "../services/uploadService.js";

const getSingedUrlFile = async(req, res) => {
  try{
    const url = await getSignedUrlFromS3(req.params.key);
    res.json({url});
  }catch(error){
    res.status(500).json({error: error.message});
  }
}

export{ getSingedUrlFile};