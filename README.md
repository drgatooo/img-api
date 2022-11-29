# drgato's img-api

This is a simple API to generate images with text on them.

- All the parameters should be encoded before sending them to the API.

```js
const text = "Hello World";
const encoded = Buffer.from(text).toString("base64");
```

## Endpoints

### GET /music-card

Generates a music card image.

#### Parameters

| Name     | Type     | Description             |
| -------- | -------- | ----------------------- |
| `title`  | `string` | The title of the song.  |
| `artist` | `string` | The artist of the song. |
| `cover`  | `string` | The cover of the song.  |

#### Example

```http
GET /music-card?title=QU5EUsOTTUVEQQ==&artist=V09T&cover=aHR0cHM6Ly9pLnNjZG4uY28vaW1hZ2UvYWI2NzYxNmQwMDAwYjI3M2JjZTQ5ODdiNjc5MzhhMGEwMGNkZDg1Mw==
```
