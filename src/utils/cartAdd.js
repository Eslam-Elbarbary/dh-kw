/** @returns {boolean} True when CartProvider opened the cart-type conflict modal. */
export const isCartAddConflict = (result) => Boolean(result?.conflict);

/** @returns {boolean} True when the product was added successfully. */
export const isCartAddSuccess = (result) => Boolean(result?.ok);
