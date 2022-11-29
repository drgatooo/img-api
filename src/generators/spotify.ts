import { createCanvas, loadImage } from "canvas";
import { getColorFromURL } from "color-thief-node";

let rgb2hex = (c: string) =>
  "#" +
  c
    .match(/\d+/g)
    ?.map((x) => (+x).toString(16).padStart(2, "0"))
    .join("");

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
  const songY = 200;
  const songNameX = 560;
  const songNameY = 270;
  const songFontMax = "100";
  const songFontMin = "70";
  const songArtistX = 560;
  let songArtistY = 380;
  const songArtistFontMax = "40";
  const songArtistFontMin = "30";
  const bottomTextX = 805;
  let bottomTextY = 542;
  const bottomTextFont = "20px";
  const text = "CANCIÓN";

  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");
  const image = await loadImage(data.imageURL);
  const palette = await getColorFromURL(data.imageURL);
  const avcolor = rgb2hex(`rgb(${palette.join(",")})`);

  const isBgLight = isLight(avcolor);

  context.fillStyle = avcolor;
  context.fillRect(0, 0, width, height);

  context.textBaseline = "top";

  let fontColor = isBgLight ? "#333333" : "#ffffff";
  context.fillStyle = fontColor;

  context.font = "bold 22px GothamBold";
  let ctext = text.split("").join(String.fromCharCode(8202));
  context.fillText(ctext, songX, songY);

  songArtistY +=
    textWrap(
      data.name,
      songFontMax,
      songFontMin,
      580,
      context,
      songNameX,
      songNameY,
      "bold ",
      "px GothamBold"
    )! - 5;

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
  var cbottomText = `ESCUCHA EN ${(listenOn || "MEONG BOT").toUpperCase()}`
    .split("")
    .join(String.fromCharCode(8202));
  context.fillText(cbottomText, bottomTextX, bottomTextY);

  context.drawImage(image, imageX, imageY, imageWidth, imageHeight);
  const buffer = canvas.toBuffer("image/png");
  const cardURL = buffer.toString("base64");
  const img = Buffer.from(cardURL, "base64");

  return img;
}

export const isLight = (color: string) => {
  let r: any, g: any, b: any, color_match: any, hsp: number;
  // Check the format of the color, HEX or RGB?
  if (color.match(/^rgb/)) {
    // If HEX --> store the red, green, blue values in separate letiables
    color_match = color.match(
      /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
    );

    r = color_match[1];
    g = color_match[2];
    b = color_match[3];
  } else {
    // If RGB --> Convert it to HEX: http://gist.github.com/983661
    color_match = +(
      // @ts-ignore
      ("0x" + color.slice(1).replace(color.length < 5 && /./g, "$&$&"))
    );

    r = color_match >> 16;
    g = (color_match >> 8) & 255;
    b = color_match & 255;
  }

  // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
  hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

  // Using the HSP value, determine whether the color is light or dark
  return hsp > 127.5;
};
