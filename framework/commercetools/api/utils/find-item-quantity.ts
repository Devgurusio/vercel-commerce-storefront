import type { CommercetoolsLineItems } from '@framework/types/cart'

export default function findItemQuantity(
  lineItems: CommercetoolsLineItems[],
  itemId: string
) {
  const item = lineItems.find((item) => item.id === itemId)
  return item ? item.quantity : 0
}
