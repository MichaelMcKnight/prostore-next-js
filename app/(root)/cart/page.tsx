import CartTable from "@/components/shared/cart/cart-table";
import { getMyCart } from "@/lib/actions/cart-actions";

export const metadata = {
  title: "Shopping Cart",
};

const CartPage = async () => {
  const cart = await getMyCart();
  return <CartTable cart={cart} />;
};

export default CartPage;
