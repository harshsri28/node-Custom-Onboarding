const destinationFolderPath = "/home/harshsri/Desktop/SIgnzy/outputFIle";
const path = require("path");
const axios = require("axios");
const fs = require("fs");
const { uploadToPersist } = require("./uploadToPersist");
const { classifyPage } = require("./classifyPage");
const { maskDocument } = require("./maskDocument");
const FormData = require("form-data");
const PDFDocument = require("pdfkit");
const { fromPath } = require("pdf2pic");
const { v4: uuidv4 } = require("uuid");

const downloadImages = async (imageUrls) => {
  const imageBuffers = await Promise.all(
    imageUrls.map(async (url) => {
      const response = await axios.get(url, { responseType: "arraybuffer" });
      return Buffer.from(response.data, "binary");
    })
  );
  return imageBuffers;
};

async function uploadToIWorks(persistUrl) {
  const fileName = path.basename(persistUrl);
  const savePath = path.join(destinationFolderPath, fileName);

  try {
    const response = await axios.get(persistUrl, {
      responseType: "arraybuffer",
    });
    fs.writeFileSync(savePath, response.data);
  } catch (error) {
    console.error("Error saving image:", error);
  }
}

const createPdf = async (imageBuffers, pdfPath) => {
  const pdfDoc = new PDFDocument();
  const stream = fs.createWriteStream(pdfPath);
  pdfDoc.pipe(stream);
  for (let i = 0; i < imageBuffers.length; i++) {
    pdfDoc.image(imageBuffers[i], 0, 0, {
      density: 100,
      width: 1000,
      height: 1000,
    });
    if (i != imageBuffers.length - 1) pdfDoc.addPage();
  }
  pdfDoc.end();
  return new Promise((resolve, reject) => {
    stream.on("finish", () => resolve());
    stream.on("error", (error) => reject(error));
  });
};

async function processPDF(docPath) {
  try {
    const options = {
      density: 100,
      format: "png",
    };
    const pages = await fromPath(docPath, options).bulk(-1, {
      responseType: "image",
      width: "original",
      height: "original",
    });
    console.log("pages", pages);
    const imageUrls = [];
    let isAadhar = false;
    for (let i = 0; i < pages.length; i++) {
      const pageToConvert = pages[i];
      try {
        const peristUrl = await uploadToPersist(pageToConvert.path);
        imageUrls[i] = peristUrl;
        fs.unlinkSync(pageToConvert.path);
        const classifyResult = await classifyPage(peristUrl);
        if (classifyResult === "aadhaar") {
          isAadhar = true;
          const maskedResult = await maskDocument(peristUrl);
          // need to look at status
          if (maskedResult.isMasked === "YES,Mask_U") {
            imageUrls[i] = maskedResult.maskedImages[0];
          }
        }
      } catch (error) {
        console.error(
          `Error calling the API for pageaadhar present on page and status 3 NO,Invalid ${
            i + 1
          }:`,
          error
        );
      }
    }
    if (!isAadhar) return "not Aadhaar";
    const imageBuffers = await downloadImages(imageUrls);
    let fileName = uuidv4() + ".pdf";
    await createPdf(imageBuffers, fileName);
    const maskedPDFUrl = await uploadToPersist(fileName);
    console.log("maskedPDFUrl", maskedPDFUrl);
    fs.unlinkSync(fileName);
    await uploadToIWorks(maskedPDFUrl);
  } catch (err) {
    console.log(err);
  }
}

async function processImage(docPath) {
  try {
    const peristUrl = await uploadToPersist(docPath);
    const classifyResult = await classifyPage(peristUrl);
    if (classifyResult != "aadhaar") {
      return "not Aadhaar";
    }
    const maskedResult = await maskDocument(peristUrl);
    const persistUrlMasked = maskedResult.maskedImages[0];
    await uploadToIWorks(persistUrlMasked);
  } catch (err) {
    console.log(err);
  }
}

async function processDocument(docPath, docType) {
  switch (docType) {
    case ".pdf":
      await processPDF(docPath);
      break;
    default:
      await processImage(docPath);
      break;
  }
}

module.exports = {
  processDocument,
};
