'use client'

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { IoClose } from "react-icons/io5";
import { useProducts } from '@/context/ProductContext';
import Button from '../Button/Button';
import Loader from '../Loader/Loader';
import { useRouter } from "next/navigation";

const ProductCart: React.FC = () => {
  const router = useRouter();
  const { modalAction, isLoading, orders } = useProducts();
  const { addToCartModal } = modalAction;
  const handleCheckOut = () => {
    modalClose();
    router.push("/products/checkout");
  }
  const modalClose = () => {
    addToCartModal.close();
  }
  if (orders.length === 0) return null;

  return (
    <div>
      <Dialog open={addToCartModal.isOpen} onClose={modalClose} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-closed:opacity-0"
        />
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <DialogPanel
                transition
                className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
              >
                <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
                  <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                    <div className="flex items-start justify-between">
                      <DialogTitle className="text-lg font-medium text-[#7b4cf2]">Shopping cart</DialogTitle>
                      <div className="ml-3 flex h-7 items-center">
                        <Button
                          type="button"
                          variant="primary"
                          onClick={addToCartModal.close}
                          className="relative -m-2 p-2"
                          children={undefined}
                          icon={<IoClose />}
                        />
                      </div>
                    </div>

                    <div className="my-8">
                      <div className="flow-root">
                        <ul role="list" className="-my-6 divide-y divide-gray-200">
                          {orders.map((items) => (
                            <li key={items.id} className="flex py-6">
                              <div className="ml-4 flex flex-1 flex-col">
                                <div>
                                  <div className="flex justify-between text-base font-medium text-gray-900">
                                    <h3>
                                      <a href={items.productName}>{items.productName}</a>
                                    </h3>
                                  </div>
                                </div>
                                <div className="flex flex-1 items-center justify-between text-sm">
                                  <p className="text-gray-500 font-semibold">Qty {items.quantity}</p>
                                  <div className="flex">
                                    <Button
                                      children={"Remove"}
                                      type='button'
                                      variant="textOnly"
                                      icon={
                                        isLoading ? <Loader size='sm' isLoading={isLoading} /> : null
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}

                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default ProductCart;