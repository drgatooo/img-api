# drgato's img-api

This is a simple API to generate images with text on them.

- All the parameters should be encoded before sending them to the API.

```js
const text = "Hello World";
const encoded = Buffer.from(text).toString("base64");
```

## Endpoints

### GET /v2/music-card

Generates a music card image.

#### Parameters

| Name     | Type     | Description             |
| -------- | -------- | ----------------------- |
| `title`  | `string` | The title of the song.  |
| `artist` | `string` | The artist of the song. |
| `cover`  | `string` | The cover of the song.  |
| `orientation`  | `"square"\|"portrait"\|"landscape"` | The orientation of the canvas. Default: landscape  |
| `listen-on`  | `string` | A watermark. Default: Meong Bot (i don't remember xd)  |

> IMPORTANT: All parameters should be encoded to buffer string (except orientation)
> 
> Use: `Buffer.from("random string").toString('base64')`

#### Example

```http
GET /v2/music-card?title=QU5EUsOTTUVEQQ==&artist=V09T&cover=aHR0cHM6Ly9pLnNjZG4uY28vaW1hZ2UvYWI2NzYxNmQwMDAwYjI3M2JjZTQ5ODdiNjc5MzhhMGEwMGNkZDg1Mw==&orientation=square
```
