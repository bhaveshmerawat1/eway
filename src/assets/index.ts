import ink from './ink.png';
import img1 from "./banner/img1.webp";
import img2 from "./banner/img2.png";
import img3 from "./banner/img3.png";
import img4 from "./banner/img4.png";
import img5 from "./banner/img5.png";
import cleaning from "./products/cleaningImg.jpg";
import furniture from "./products/furnitureImg.jpg";
import inkToner from "./products/ink-tonerImg.jpg";
import packShip from "./products/pack-shipImg.jpg";
import paper from "./products/paperImg.jpg";
import technology from "./products/technologyImg.jpg";
import adsImg1 from "../assets/ads1.png";
import adsImg2 from "../assets/ads2.png";

const images = {
  ink,
  img1,
  img2,
  img3,
  img4,
  img5,
  cleaning,
  packShip,
  technology,
  furniture,
  paper,
  inkToner,
adsImg1,
adsImg2
};

const productImages = {
  cleaning,
  packShip,
  technology,
  furniture,
  paper,
  inkToner
}

export default images;
export type ImageKey = keyof typeof productImages;