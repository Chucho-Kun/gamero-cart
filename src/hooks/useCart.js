import { useState , useEffect , useMemo } from "react";
import { db } from "../data/db";

export const useCart = () => {

       const initialCart = () => {
        const localStorageCart = localStorage.getItem( 'cart' )
        return localStorageCart ? JSON.parse(localStorageCart) : []
      }
    
      const [ data ] = useState(db);
      const [ cart , setCart ] = useState(initialCart);
    
      const MAX_ITEMS = 10;
    
      useEffect(()=>{
        localStorage.setItem( 'cart' , JSON.stringify(cart));
      },[cart])
    
      function addToCart(item) {
    
          const itemExists = cart.findIndex(( guitar )=> guitar.id === item.id )
          if(itemExists >= 0){
            if(cart[itemExists].quantity >= MAX_ITEMS) return
            const updatedCart = [...cart]
            updatedCart[itemExists].quantity++
            setCart(updatedCart)
    
          }else{
            item.quantity = 1;
            setCart([...cart , item])
          }
      }
    
      function removeItem( id ){ setCart( (prevCart) =>  prevCart.filter( guitar => guitar.id !== id ) ) }
    
      function control( id , v ){
        const updateCart = cart.map( item => {
          if( item.id == id && (v === '+') ? item.quantity < MAX_ITEMS : item.quantity > 1 ){
            return{
              ...item,
              quantity: (v === '+') ? item.quantity + 1 : item.quantity - 1
            }
          }
          return item
        })
        setCart(updateCart)
      }
    
      function clearCart(){ setCart([]); }

          // State Derivado
    const isEmpty = useMemo( () => cart.length === 0 , [cart] )
    const cartTotal = useMemo( () => cart.reduce( ( total , item) => total + (item.quantity * item.price) , 0 ) , [cart] )

    return { 
        data, cart , addToCart , removeItem , control , clearCart , isEmpty , cartTotal
     }

}