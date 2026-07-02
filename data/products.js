// data/products.js

const SIZES = ["S", "M", "L", "XL", "XXL"];

const products = [
  {
    id: "bob-keychain",
    name: "BOB Keychain",
    price: 10,
    image: "/merch/bobkeychain.png",
    sizes: ["OS"],
    status: "new",
    color: "Black/Gold",
    stock_by_size: { OS: 50 },
    shopifyHandle: "",
    shopifyVariantIds: {
      OS: "",
    },
  },
  {
    id: "bob-beanie",
    name: "BOB Beanie",
    price: 30,
    image: "/merch/beanie.png",
    sizes: ["OS"],
    status: "new",
    color: "Black",
    stock_by_size: { OS: 30 },
    shopifyHandle: "",
    shopifyVariantIds: {
      OS: "",
    },
  },
  {
    id: "bob-black-tee",
    name: "B.O.B Black Tee",
    price: 30,
    image: "/merch/bob-black.png",
    sizes: SIZES,
    status: "sold out",
    color: "Black",
    stock_by_size: { S: 4, M: 7, L: 8, XL: 4, XXL: 2 },
    shopifyHandle: "",
    shopifyVariantIds: {
      S: "",
      M: "",
      L: "",
      XL: "",
      XXL: "",
    },
  },
  {
    id: "bob-white-tee",
    name: "B.O.B White Tee",
    price: 30,
    image: "/merch/bob-white.png",
    sizes: SIZES,
    status: "sold out",
    color: "White",
    stock_by_size: { S: 4, M: 7, L: 8, XL: 4, XXL: 2 },
    shopifyHandle: "",
    shopifyVariantIds: {
      S: "",
      M: "",
      L: "",
      XL: "",
      XXL: "",
    },
  },

  {
    id: "dd-las-vegas-tee",
    name: "DD Las Vegas Tee",
    price: 40,
    image: "/merch/bob-LV.png",
    sizes: SIZES,
    status: "sold out",
    color: "Gold on Black",
    stock_by_size: { S: 0, M: 0, L: 0, XL: 0, XXL: 0 },
    shopifyHandle: "",
    shopifyVariantIds: {
      S: "",
      M: "",
      L: "",
      XL: "",
      XXL: "",
    },
  },
  {
    id: "dd-new-york-tee",
    name: "DD New York Tee",
    price: 40,
    image: "/merch/bob-nyc.png",
    sizes: SIZES,
    status: "sold out",
    color: "White on Black",
    stock_by_size: { S: 0, M: 0, L: 0, XL: 0, XXL: 0 },
    shopifyHandle: "",
    shopifyVariantIds: {
      S: "",
      M: "",
      L: "",
      XL: "",
      XXL: "",
    },
  },

 
];

export default products;