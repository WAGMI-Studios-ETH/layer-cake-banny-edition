# Tezos Rich Token Metadata Standard aka TZIP-021

This refers to the actual properties and fields in the JSON which presumably lives on NFT.Storage. Unfortunately, this is a working group which is subject to change, and will likely do so, so shit will break. 

[TZIP-21](https://tzip.tezosagora.org/proposal/tzip-21/#artifacturi-string-format-uri-reference)

The following is a complete proposed example of a complaint TZIP-021 JSON.
```typescript
const json_metadata = {
  "decimals": 0,
  "isBooleanAmount": true,
  "name": "Carnival Asada",
  "description": "Deceptively simple by reputation; don't underestimate this cunning taco. It's packing a secret weapon!",
  "minter": "tz1codeYURj5z49HKX9zmLHms2vJN2qDjrtt",
  "creators": ["CryptoTacos, Inc."],
  "date": "2020-11-13T00:00:00+00:00",
  "type": "Digital Taco",
  "tags": ["CryptoTaco", "taco", "collectibles"],
  "language": "en",
  "artifactUri": "https://ta.co/1832674.gltf",
  "displayUri": "https://ta.co/1832674.svg",
  "thumbnailUri": "https://ta.co/1832674.svg",
  "externalUri": "https://ta.co/",
  "formats": [
    {
      "uri": "https://ta.co/1832674.svg",
      "hash": "a56017a1317b1bc900acdaf600874c00e5c048d30894f452049db6dcef6e4f0d",
      "mimeType": "image/svg+xml"
    },
    {
      "uri": "https://ta.co/1832674.png",
      "hash": "8968db6bde43255876c464613a31fbd0416ca7d74be4c5ae86c1450418528302",
      "mimeType": "image/png",
      "dimensions": {
        "value": "512x512",
        "unit": "px"
      }
    },
    {
      "uri": "https://ta.co/1832674.gltf",
      "hash": "d4a93fc8d8991caa9b52c04c5ff7edf5c4bc29317a373e3a97f1398c697d6714",
      "mimeType": "model/gltf+json"
    }
  ],
  "attributes": [
    {
      "name": "filling",
      "value": "carne asada"
    },
    {
      "name": "shell",
      "value": "double corn tortilla"
    },
    {
      "name": "salsa",
      "value": "mango"
    },
    {
      "name": "garnish",
      "value": "pickled red onion"
    },
    {
      "name": "secret sauce",
      "value": "ghost pepper"
    },
    {
      "name": "rarity",
      "value": "epic"
    }
  ]
}

```

```typescript
const json_metadata = {
"attributes": [
  {
    "name": "Base",
    "value": "Starfish"
  },
  {
    "name": "Eyes",
    "value": "Big"
  },
  {
    "name": "Mouth",
    "value": "Surprised"
  },
  {
    "name": "Level",
    "value": "5",
    "type": "integer"
  },
  {
    "name": "Stamina",
    "value": "1.4",
    "type": "number"
  },
  {
    "trait_type": "Stamina Increase",
    "value": "10",
    "type": "percentage"
  }
]
};
```

# Token Metadata
This refers to the actual data in the smart contract i.e. token implementation - NOT the URI or JSON of metadata

Token metadata is intended for off-chain, user-facing contexts (e.g.  wallets,
explorers, marketplaces). An earlier (superseded) specification of TZIP-012 token metadata is
contained in the Legacy Interface section of the Legacy FA2 document.

## Token-Metadata Values (aka. TZIP-012)
Token-specific metadata is stored/presented as a Michelson value of type
(map string bytes).  A few of the keys are reserved and predefined by
TZIP-012:

"" (empty-string): should correspond to a TZIP-016 URI which points to a JSON
representation of the token metadata.

"name": should be a UTF-8 string giving a “display name” to the token.

"symbol": should be a UTF-8 string for the short identifier of the token
(e.g. XTZ, EUR, …).

"decimals": should be an integer (converted to a UTF-8 string in decimal)
which defines the position of the decimal point in token balances for display
purposes.

In the case of a TZIP-016 URI pointing to a JSON blob, the JSON preserves the
same 3 reserved non-empty fields:
{ "symbol": <string>, "name": <string>, "decimals": <number>, ... }

Providing a value for "decimals" is required for all token types. "name” and "symbol" are not required but it is highly recommended for most tokens to provide the values either in the map or the JSON found via the TZIP-016 URI.

Other standards such as TZIP-021 describe token metadata schemas which reserve additional keys for different token types for greater compatibility across indexers, wallets, and tooling.

### blending modes to layers

```typescript
const layerConfigurations = [
  {
    growEditionSizeTo: 5,
    layersOrder: [
      { name: "Background" },
      { name: "Eyeball" },
      { name: "Eye color", blend: MODE.colorBurn },
      { name: "Iris" },
      { name: "Shine" },
      { name: "Bottom lid", blend: MODE.overlay, opacity: 0.7 },
      { name: "Top lid", opacity: 0.7 },
    ],
  },
];
```
Add blending modes.
```typescript
const MODE = {
  sourceOver: "source-over",
  sourceIn: "source-in",
  sourceOut: "source-out",
  sourceAtop: "source-out",
  destinationOver: "destination-over",
  destinationIn: "destination-in",
  destinationOut: "destination-out",
  destinationAtop: "destination-atop",
  lighter: "lighter",
  copy: "copy",
  xor: "xor",
  multiply: "multiply",
  screen: "screen",
  overlay: "overlay",
  darken: "darken",
  lighten: "lighten",
  colorDodge: "color-dodge",
  colorBurn: "color-burn",
  hardLight: "hard-light",
  softLight: "soft-light",
  difference: "difference",
  exclusion: "exclusion",
  hue: "hue",
  saturation: "saturation",
  color: "color",
  luminosity: "luminosity",
};
```
