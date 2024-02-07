// import { MenuItems, getMenuItemDetails } from '@/components/Menu/menuItems';
// import React, { ReactNode, useEffect, useState } from 'react';

// type ParsedCartItem = ((typeof MenuItems)[number] & {
//   amount: number;
// })[];

// type C = {
//   cart: ParsedCartItem;
//   addToCart: (itemId: string) => void;
//   removeFromCart: (itemId: string) => void;
//   total: number;
//   totalAmount: number;
// };

// const CartContext = React.createContext<C>({
//   cart: [],
//   addToCart: () => {},
//   removeFromCart: () => {},
//   total: 0,
//   totalAmount: 0,
// });

// type CartItem = {
//   id: string;
//   amount: number;
// };

// function CartContextProvider({ children }: { children: ReactNode }) {
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [loadded, setLoaded] = useState(false);

//   useEffect(() => {
//     try {
//       const cartData = JSON.parse(localStorage.getItem('cart') ?? '') ?? '';

//       setLoaded(true);

//       if (cartData) {
//         setCart(cartData);
//       }
//     } catch (e) {
//       //
//     }

//     setLoaded(true);
//   }, []);

//   useEffect(() => {
//     if (loadded) localStorage.setItem('cart', JSON.stringify(cart));
//   }, [cart, loadded]);

//   function addToCart(id: string) {
//     const inCart = cart.find((c) => c.id === id);
//     if (inCart) {
//       setCart([
//         ...cart.filter((c) => c.id !== id),
//         { ...inCart, amount: parseInt(inCart.amount.toString()) + 1 },
//       ]);
//     } else {
//       setCart([...cart, { id: id, amount: 1 }]);
//     }
//   }

//   function removeFromCart(id: string) {
//     const inCart = cart.find((c) => c.id === id);
//     if (inCart && parseInt(inCart.amount.toString()) > 1) {
//       setCart([
//         ...cart.filter((c) => c.id !== id),
//         { ...inCart, amount: parseInt(inCart.amount.toString()) - 1 },
//       ]);
//     } else {
//       setCart([...cart.filter((c) => c.id !== id)]);
//     }
//   }

//   const parsedCart = (
//     cart
//       .map((i) => ({
//         amount: i.amount,
//         ...getMenuItemDetails(i.id),
//       }))
//       .filter((e) => !!e.id) as ParsedCartItem
//   ).sort(({ title: title1 }, { title: title2 }) =>
//     title1 > title2 ? 1 : title2 > title1 ? -1 : 0
//   );

//   return (
//     <CartContext.Provider
//       value={{
//         cart: parsedCart,
//         addToCart,
//         removeFromCart,
//         totalAmount: parsedCart.reduce((acc, cur) => acc + cur.amount, 0),
//         total: parsedCart.reduce((acc, cur) => acc + cur.price * cur.amount, 0),
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }

// export { CartContextProvider, CartContext };
