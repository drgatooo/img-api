import { createCanvas, loadImage, type Image } from "canvas";

let rgb2hex = (c: string) =>
  "#" +
  c
    .match(/\d+/g)
    ?.map((x) => (+x).toString(16).padStart(2, "0"))
    .join("");

function getAverageColor(img: Image): Promise<string> {
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

function textWrap(
  text: string,
  max: string,
  min: string,
  maxWidth: number,
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  fontPre: string,
  fontPost: string
) {
  let currentFontSize,
    firstLine = "",
    secondLine = "";

  for (
    currentFontSize = parseInt(max);
    currentFontSize >= parseInt(min);
    currentFontSize--
  ) {
    ctx.font = fontPre + currentFontSize + fontPost;
    let currentWidth = ctx.measureText(text).width;
    if (currentWidth < maxWidth) {
      break;
    }
  }

  if (currentFontSize >= parseInt(min)) {
    // we have found an appropriate font size for 1 line
    ctx.fillText(text, x, y);
    return 0;
  } else {
    // even the shortest font size is overflowing for 1 line

    for (
      currentFontSize = parseInt(max);
      currentFontSize >= parseInt(min);
      currentFontSize--
    ) {
      let tobreak = false;
      ctx.font = fontPre + currentFontSize + fontPost;

      let words = text.split(" ");
      firstLine = words[0]!;
      for (let _ = 1; _ < words.length; _++) {
        let word = words[_];
        let currentLineWidth = ctx.measureText(firstLine + " " + word).width;
        if (currentLineWidth < maxWidth) {
          firstLine += " " + word;
        } else {
          words = words.splice(_);
          const secondLine = words.join(" ");
          if (ctx.measureText(secondLine).width < maxWidth) {
            tobreak = true;
          }
          break;
        }
      }
      if (tobreak) {
        break;
      }
    }

    if (currentFontSize >= parseInt(min)) {
      // found an appropriate font size for 2 lines
      ctx.font = fontPre + currentFontSize + fontPost;
      let words = text.split(" ");
      firstLine = words[0]!;
      for (let _ = 1; _ < words.length; _++) {
        let word = words[_];
        let currentLineWidth = ctx.measureText(firstLine + " " + word).width;
        if (currentLineWidth < maxWidth) {
          firstLine += " " + word;
        } else {
          ctx.fillText(firstLine, x, y);
          secondLine = words.slice(_).join(" ");
          ctx.fillText(secondLine, x, y + currentFontSize);
          return currentFontSize;
        }
      }
    } else {
      // need to remove some words
      let words = text.split(" ");
      firstLine = words[0]!;
      ctx.font = fontPre + min + fontPost;
      for (let _ = 1; _ < words.length; _++) {
        let word = words[_];
        let currentLineWidth = ctx.measureText(firstLine + " " + word).width;
        if (currentLineWidth < maxWidth) {
          firstLine += " " + word;
        } else {
          words = words.splice(_);
          secondLine = words[0]!;
          for (let __ = 1; __ < words.length; __++) {
            let word = words[__];
            let currentLineWidth = ctx.measureText(
              secondLine + " " + word
            ).width;
            if (currentLineWidth < maxWidth) {
              secondLine += " " + word;
            } else {
              text = firstLine + " " + secondLine + "...";
              break;
            }
          }
          break;
        }
      }

      for (
        currentFontSize = parseInt(max);
        currentFontSize >= parseInt(min);
        currentFontSize--
      ) {
        let tobreak = false;
        ctx.font = fontPre + currentFontSize + fontPost;

        let words = text.split(" ");
        firstLine = words[0]!;
        for (let _ = 1; _ < words.length; _++) {
          let word = words[_];
          let currentLineWidth = ctx.measureText(firstLine + " " + word).width;
          if (currentLineWidth < maxWidth) {
            firstLine += " " + word;
          } else {
            words = words.splice(_);
            secondLine = words.join(" ");
            if (ctx.measureText(secondLine).width < maxWidth) {
              tobreak = true;
            }
            break;
          }
        }
        if (tobreak) {
          break;
        }
      }

      ctx.font = fontPre + currentFontSize + fontPost;
      words = text.split(" ");
      firstLine = words[0]!;
      for (let _ = 1; _ < words.length; _++) {
        let word = words[_];
        let currentLineWidth = ctx.measureText(firstLine + " " + word).width;
        if (currentLineWidth < maxWidth) {
          firstLine += " " + word;
        } else {
          ctx.fillText(firstLine, x, y);
          secondLine = words.slice(_).join(" ");
          ctx.fillText(secondLine, x, y + currentFontSize);
          return currentFontSize;
        }
      }
    }
  }
  return 0;
}

interface SongData {
  name: string;
  artist: string;
  imageURL: string;
}

export async function SpotifyCard(data: SongData, listenOn?: string) {
  const width = 1200;
  const height = 630;
  const imageX = 105;
  const imageY = 115;
  const imageWidth = 400;
  const imageHeight = 400;
  const songX = 560;
  const songY = 180;
  const songNameX = 560;
  const songNameY = 250;
  const songFontMax = "100";
  const songFontMin = "70";
  const songArtistX = 560;
  let songArtistY = 380;
  const songArtistFontMax = "40";
  const songArtistFontMin = "30";
  const bottomTextX = 845;
  let bottomTextY = 542;
  const bottomTextFont = "20px";
  const text = "SONG";

  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");
  const image = await loadImage(data.imageURL);
  const avcolor = await getAverageColor(image);

  context.fillStyle = avcolor;
  context.fillRect(0, 0, width, height);

  context.textBaseline = "top";

  let fontColor = getFontColor(avcolor, avcolor);
  context.fillStyle = fontColor;

  context.font = "bold 22px GothamBlack";
  var ctext = text.split("").join(String.fromCharCode(8202));
  context.fillText(ctext, songX, songY);

  songArtistY += textWrap(
    data.name,
    songFontMax,
    songFontMin,
    580,
    context,
    songNameX,
    songNameY,
    "bold ",
    "px GothamBold"
  )!;

  let downShift = textWrap(
    data.artist,
    songArtistFontMax,
    songArtistFontMin,
    500,
    context,
    songArtistX,
    songArtistY,
    "bold ",
    "px GothamBook"
  );
  bottomTextY += downShift!;

  context.font = `${bottomTextFont} GothamBold`;
  var cbottomText = `LISTEN ON ${(listenOn || "MEONG BOT").toUpperCase()}`
    .split("")
    .join(String.fromCharCode(8202));
  context.fillText(cbottomText, bottomTextX, bottomTextY);

  context.drawImage(image, imageX, imageY, imageWidth, imageHeight);
  const buffer = canvas.toBuffer("image/png");
  const cardURL = buffer.toString("base64");
  const img = Buffer.from(cardURL, "base64");

  return img;
}

function getFontColor(bgcolor: string, averagecolor: string) {
  // checking if white works
  let e = deltaE(hexToRgb(bgcolor), hexToRgb("FFFFFF"));
  if (e < 10) {
    // checking if average color works
    e = deltaE(hexToRgb(bgcolor), hexToRgb(averagecolor));
    if (e < 10) {
      return "#000000";
    } else {
      return averagecolor;
    }
  } else {
    return "#FFFFFF";
  }
}

function deltaE(
  rgbA: [number, number, number],
  rgbB: [number, number, number]
) {
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

function rgb2lab(rgb: [number, number, number]): [number, number, number] {
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

function hexToRgb(hex: string): [number, number, number] {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (_, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return [
    parseInt(result![1]!, 16),
    parseInt(result![2]!, 16),
    parseInt(result![3]!, 16),
  ];
}
