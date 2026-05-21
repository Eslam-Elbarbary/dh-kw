import { Outlet } from 'react-router-dom';
import { CartProvider } from '../context/CartContext';

/** Cart + conflict modal must live inside the router so location and navigation stay in sync. */
export default function CartRootLayout() {
  return (
    <CartProvider>
      <Outlet />
    </CartProvider>
  );
}
