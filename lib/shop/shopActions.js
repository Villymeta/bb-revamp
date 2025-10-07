export const calculateSubtotal = (bag) =>
    bag.reduce((acc, item) => acc + item.price * item.qty, 0);
  
  export const findItemIndex = (bag, item) =>
    bag.findIndex((i) => i.id === item.id && i.size === item.size);