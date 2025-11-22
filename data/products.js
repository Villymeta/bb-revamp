// data/products.js

const SIZES = ["S", "M", "L", "XL", "XXL"];

export const products = [
  {
    id: "DD Las Vegas Tee",
    name: "DD Las Vegas Tee",
    price: 40,
    image: "/merch/bob-LV.png",
    sizes: SIZES,
    status: "sold out",
    color: "Gold on Black",
    stockBySize: { S: 0, M: 0, L: 0, XL: 0, XXL: 0 },
  },
  {
    id: "B.O.B Black Tee",
    name: "B.O.B Black Tee",
    price: 30,
    image: "/merch/bob-black.png",
    sizes: SIZES,
    status: "new",
    color: "Black",
    stockBySize: { S: 4, M: 7, L: 8, XL: 4, XXL: 2 },
  },
  {
    id: "B.O.B White Tee",
    name: "B.O.B White Tee",
    price: 30,
    image: "/merch/bob-white.png",
    sizes: SIZES,
    status: "new",
    color: "White",
    stockBySize: { S: 4, M: 7, L: 8, XL: 4, XXL: 2 },
  },
  {
    id: "BOB Beanie",
    name: "BOB Beanie",
    price: 30,
    image: "/merch/beanie.png",
    status: "new",
    color: "Black",
    stockBySize: { OS: 30 }, // One size only
  },
  {
    id: "DD New York Tee",
    name: "DD New York Tee",
    price: 40,
    image: "/merch/bob-nyc.png",
    sizes: SIZES,
    status: "sold out",
    color: "White on Black",
    stockBySize: { S: 0, M: 0, L: 0, XL: 0, XXL: 0 },
  },
];