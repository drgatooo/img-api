// @ts-nocheck
import { createCanvas, loadImage } from "canvas";
import {
  crop1x1,
  getImageBuffer,
  loadImageFromBuffer,
} from "../util/imageBuffer";

interface SongData {
  name: string;
  artist: string;
  cover: string;
  text?: "canción" | "playlist";
  listenOn?: string;
}

let rgb2hex = (c) =>
  "#" + c.match(/\d+/g).map((x) => (+x).toString(16).padStart(2, 0)).join``;

async function getAverageColor(img) {
  return new Promise((resolve) => {
    const tempCanvas = createCanvas(1080, 1080);
    const tempCtx = tempCanvas.getContext("2d");
    tempCtx.imageSmoothingEnabled = true;
    tempCtx.drawImage(img, 0, 0, 1, 1);
    const rgb = tempCtx.getImageData(0, 0, 1, 1).data.slice(0, 3).join(", ");
    const hex = rgb2hex(rgb);
    resolve(hex);
  });
}

export async function SpotifyCard(
  data: SongData,
  color,
  orientation: "portrait" | "square" | "landscape",
  colorGiven
) {
  let totalArtist;
  let artistList = [];
  let artistString = "";
  let songName;
  let imageURL: string;
  let width,
    height,
    imageX,
    imageY,
    imageWidth,
    imageHeight,
    songX,
    songY,
    songFont,
    songNameX,
    songNameY,
    songArtistX,
    songArtistY,
    songArtistFont,
    bottomTextX,
    bottomTextY,
    bottomTextFont,
    dmX,
    dmY,
    dmW,
    dmH,
    songFontMax,
    songFontMin,
    songArtistFontMax,
    songArtistFontMin;
  const text = (data.text || "canción").toUpperCase();
  const bottomText = `ESCUCHAR EN`;

  if (orientation === "landscape") {
    width = 1200;
    height = 630;
    imageX = 105;
    imageY = 115;
    imageWidth = 400;
    imageHeight = 400;
    songX = 560;
    songY = 250;
    songNameX = 560;
    songNameY = 290;
    songFont = "bold 100px";
    songFontMax = "100";
    songFontMin = "55";
    songArtistX = 560;
    songArtistY = 380;
    songArtistFont = "bold 40px";
    songArtistFontMax = "40";
    songArtistFontMin = "25";
    bottomTextX = 805;
    bottomTextY = 542;
    bottomTextFont = "20px";
    dmX = 975;
    dmY = 540;
    dmW = 199.64;
    dmH = 60;
  } else if (orientation === "square") {
    width = 1080;
    height = 1080;
    imageX = 0;
    imageY = 330;
    imageWidth = 750;
    imageHeight = 750;
    songNameX = 70;
    songNameY = 50;
    songFont = "50px";
    songArtistX = 70;
    songArtistY = 160;
    songArtistFont = "68px";
    bottomTextX = 795;
    bottomTextY = 870;
    bottomTextFont = "30px";
    dmX = 795;
    dmY = 920;
    dmW = 250;
    dmH = 75;
  } else if (orientation === "portrait") {
    width = 1080;
    height = 1920;
    imageX = 146;
    imageY = 240;
    imageWidth = 788;
    imageHeight = 788;
    songX = 115;
    songY = 1127;
    songNameX = 115;
    songNameY = 1215;
    songFont = "bold 150px";
    songFontMax = "150";
    songFontMin = "65";
    songArtistX = 115;
    songArtistY = 1390;
    songArtistFont = "bold 60px";
    songArtistFontMax = "60";
    songArtistFontMin = "40";
    bottomTextX = 425;
    bottomTextY = 1780;
    bottomTextFont = "40px";
    dmX = 770;
    dmY = 1780;
    dmW = 266.19;
    dmH = 80;
  }

  // Track Name
  songName = data.name;

  // Image URL 640x640
  imageURL = data.cover;

  // Artist List
  artistList.push(data.artist);

  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  const imgBuffer = await getImageBuffer(imageURL, "./assets/fallback.png");

  const cropped = await crop1x1(imgBuffer);
  const image = await loadImage(cropped);

  const avcolor = await getAverageColor(image);
  if (!colorGiven) {
    color = avcolor;
  }
  context.fillStyle = color;
  context.fillRect(0, 0, width, height);

  // Image
  context.drawImage(image, imageX, imageY, imageWidth, imageHeight);

  context.textBaseline = "top";

  const fontColor = getFontColor(color, avcolor);
  context.fillStyle = fontColor;
  if (orientation === "landscape") {
    context.font = 'bold 22px GothamBlack, "Arial Unicode MS", segoe-ui-emoji';
    var ctext = text.split("").join(String.fromCharCode(8202));
    context.fillText(ctext, songX, songY);
  } else if (orientation == "portrait") {
    context.font = 'bold 40px GothamBlack, "Arial Unicode MS", segoe-ui-emoji';
    var ctext = text.split("").join(String.fromCharCode(8202));
    context.fillText(ctext, songX, songY);
  }
  if (orientation === "landscape") {
    // textWrap returns the downward shift that next element has to undergo
    songArtistY += textWrap(
      songName,
      songFontMax,
      songFontMin,
      580,
      context,
      songNameX,
      songNameY,
      "bold ",
      'px GothamBold, "Arial Unicode MS", segoe-ui-emoji'
    );
  } else if (orientation === "portrait") {
    songArtistY += textWrap(
      songName,
      songFontMax,
      songFontMin,
      850,
      context,
      songNameX,
      songNameY,
      "bold ",
      'px GothamBold, "Arial Unicode MS", segoe-ui-emoji'
    );
  }

  artistString = artistList.join(", ");
  if (orientation === "landscape") {
    let downShift = textWrap(
      artistString,
      songArtistFontMax,
      songArtistFontMin,
      500,
      context,
      songArtistX,
      songArtistY,
      "bold ",
      "px GothamBook, segoe-ui-emoji"
    );
    bottomTextY += downShift;
    dmY += downShift;
  } else if (orientation === "portrait") {
    textWrap(
      artistString,
      songArtistFontMax,
      songArtistFontMin,
      500,
      context,
      songArtistX,
      songArtistY,
      "bold ",
      "px GothamBook, segoe-ui-emoji"
    );
  } else {
    context.font = `${songArtistFont} GothamBook, "Arial Unicode MS", segoe-ui-emoji`;
    // context.fillText(artistString, songArtistX, songArtistY);
  }

  context.font = `${bottomTextFont} GothamBold, "Arial Unicode MS", segoe-ui-emoji`;
  var cbottomText = bottomText.split("").join(String.fromCharCode(8202));
  context.fillText(cbottomText, bottomTextX, bottomTextY);
  context.fillText((data.listenOn || "meong bot").toUpperCase(), dmX, dmY);

  return canvas.toBuffer();
}

function textWrap(text, max, min, maxWidth, ctx, x, y, fontPre, fontPost) {
  let words = text.split("");
  let line = "";
  let downShift = 0;
  let font = max;
  ctx.font = `${fontPre}${font}${fontPost}`;

  console.log(text.length);

  for (let n = 0; n < words.length; n++) {
    let testLine = line + words[n] + "";
    let metrics = ctx.measureText(testLine);
    let testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.font = `${fontPre}${font}${fontPost}`;
      line = line.substring(0, line.length - 1) + "…";
      ctx.fillText(line, x, y);
      break;
    } else {
      line = testLine;
    }

    if (font > min) {
      font -= 1;
      ctx.font = `${fontPre}${font}${fontPost}`;
    }

    if (font < min) {
      font = min;
    } else {
      font -= 1;
    }

    ctx.font = `${fontPre}${font}${fontPost}`;

    if (n === words.length - 1) {
      ctx.fillText(line, x, y);
    }
  }

  return downShift;
}

const isHexCode = function (hex) {
  const allowedChars = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
  ];
  if (hex.length != 3 && hex.length != 6) {
    return false;
  }
  for (let i = 0; i < hex.length; i++) {
    if (!allowedChars.includes(hex[i])) {
      return false;
    }
  }
  return true;
};

function getFontColor(bgcolor, averagecolor) {
  // checking if white works
  let e = deltaE(hexToRgb(bgcolor), hexToRgb("FFFFFF"));
  if (e < 25) {
    // checking if average color works
    e = deltaE(hexToRgb(bgcolor), hexToRgb(averagecolor));
    if (e < 25) {
      return "#000000";
    } else {
      return averagecolor;
    }
  } else {
    return "#FFFFFF";
  }
}

function deltaE(rgbA, rgbB) {
  let labA = rgb2lab(rgbA);
  let labB = rgb2lab(rgbB);
  let deltaL = labA[0] - labB[0];
  let deltaA = labA[1] - labB[1];
  let deltaB = labA[2] - labB[2];
  let c1 = Math.sqrt(labA[1] * labA[1] + labA[2] * labA[2]);
  let c2 = Math.sqrt(labB[1] * labB[1] + labB[2] * labB[2]);
  let deltaC = c1 - c2;
  let deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
  deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);
  let sc = 1.0 + 0.045 * c1;
  let sh = 1.0 + 0.015 * c1;
  let deltaLKlsl = deltaL / 1.0;
  let deltaCkcsc = deltaC / sc;
  let deltaHkhsh = deltaH / sh;
  let i =
    deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh;
  return i < 0 ? 0 : Math.sqrt(i);
}

function rgb2lab(rgb) {
  let r = rgb[0] / 255,
    g = rgb[1] / 255,
    b = rgb[2] / 255,
    x,
    y,
    z;
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
  x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.0;
  z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
  x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
  y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
  z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;
  return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
}

function hexToRgb(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
  ];
}
