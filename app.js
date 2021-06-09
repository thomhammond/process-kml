import fs from "fs";
import path from "path";
import xmlReader from "read-xml";
import convert from "xml-js";

const __dirname = path.resolve();

const FILE = path.join(__dirname, './dogparks.kml'); 

let dogparks = [];

xmlReader.readXML(fs.readFileSync(FILE), function(err, data) {
    if (err) {
        console.error(err);
    }

    const xml = data.content;
    const result = JSON.parse(convert.xml2json(xml, {compact: true, spaces: 4}));

    let placemarks = result.kml.Document.Folder.Placemark;

    for (let placemark in placemarks) {
        let name = placemarks[placemark].name._text ? placemarks[placemark].name._text : placemarks[placemark].name._cdata;
        let coordinates = placemarks[placemark].Point.coordinates._text.trim().split(",");
        let longitude = parseFloat(coordinates[0]);
        let latitude = parseFloat(coordinates[1]);
        let description = placemarks[placemark].description ? placemarks[placemark].description._text : "";

        let dogpark ={
            name: name,
            description: description,
            longitude: longitude,
            latitude: latitude,
        }
        dogparks.push(dogpark) 
    }
});

const dogparksContent = JSON.stringify(dogparks);
fs.writeFileSync("dogparkSeeds.js", "module.exports = " + dogparksContent)
