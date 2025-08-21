"use client";
import { useParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Key, useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ChevronDown, ChevronUp,} from "lucide-react";
import { FiTool } from "react-icons/fi";
import { MdLocalShipping } from "react-icons/md";
import { IoMdPricetag } from "react-icons/io";
import { IoBook } from "react-icons/io5";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

function ProductDetails() {
  const params = useParams()
  const { fetchProductByTitle, detailProduct } = useApp();
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(detailProduct?.images[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [count, setCount] = useState(1);
  const [hovered, setHovered] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setCount(value);
    } else {
      setCount(1);
    }
  };

  const id = params?.id as string | undefined;
  useEffect(() => {
    if (id) {
      fetchProductByTitle(id)
    }
    setTimeout(() => {
      setLoading(false)
    }, 1000);
    console.log("detailProduct ===============", detailProduct);
  }, [id]);

  const handleHover = (section: string | null) => {
    setHovered(section);
  };

  const handelModal = (modalname: boolean) => {
    setOpenModal(modalname)
  }

  if (!detailProduct) return <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
    <div className="w-12 h-12 border-4 border-white border-t-red-600 rounded-full animate-spin"></div>
  </div>;

  return (
    <main>
      <Header />
      <div className="container mx-auto px-4 py-2">
        <div className="min-h-screen">
          {/* Breadcrumb */}
          <nav className="text-[14px] text-gray-c mb-3 border border-gray-100 p-2 capitalize">
            <Link className="hover:underline cursor-pointer" href='/'>{detailProduct.category}</Link> /
            <span className=""> {detailProduct.brand}</span>
          </nav>
          {/* Product Title */}
          <div className="w-full py-1">
            <h1 className="text-[28px] font-semibold text-color font-myfont">{detailProduct.title}</h1>
            <p className="mt-2 text-[14px]">Item#: <span className="font-semibold">{detailProduct.sku}</span> <span className="pl-3"> Manufacturer/Brand: <span className="font-semibold">{detailProduct.brand}</span>
            </span></p>
          </div>
          <div className="max-w-full grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left Side - Product Images and basic info*/}
            <div className="">
              <img
                src={selectedImg}
                loading={'lazy'}
                alt="Product"
                className="w-full max-h-[500px] object-contain justify-center items-center"
              />

              {/* Thumbnail Gallery */}
              <div className="mt-4 grid grid-cols-8 gap-2">
                {detailProduct.images.map((img: string, index: Key) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImg(img)}
                    className={`border p-1 ${selectedImg === img ? "border-black" : "border-gray-300"
                      }`}
                  >
                    <img
                      src={img}
                      alt="thumbnail"
                      className="w-16 h-16 object-contain"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Side - Product Info */}
            <div>
              <div className="flex items-center space-x-2 justify-end">
                <h1 className="line-through text-[25px] font-semibold md:mr-[30px]">${detailProduct.price}</h1>
                <h1 className="text-3xl font-semibold text-gray-900">${detailProduct.price}</h1>
                <span className="text-color text-[14px]">each</span>
              </div>

              {/* Cost Breakdown Dropdown */}
              <div className="mt-3 flex justify-end">
                <div className="flex justify-end flex-col w-full border rounded-md bg-gray-c border-gray-light">
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex justify-between w-full px-3 py-2 text-[13px] font-bold text-color"
                  >
                    <span>Cost breakdown</span>
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>

                  {isOpen && (
                    <div className="border-t-1 text-sm border-gray-light p-1">
                      <p className="flex justify-between px-3 py-2 text-[12px] font-medium border-b-1 border-gray-light ">
                        <span>Regular</span>
                        <span>${detailProduct.price}</span>
                      </p>
                      <p className="flex justify-between px-3 py-2 text-[12px] font-medium border-b-1 border-gray-light ">
                        <span>Sale</span>
                        <span>${detailProduct.price}</span>
                      </p>
                      <p className="flex justify-between px-3 py-2 text-[12px] font-semibold">
                        <span>Save</span>
                        <span className="text-red-600">${detailProduct.price}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 flex items-center space-x-3 justify-end ">
                <div className="flex items-center">
                  <input
                    type="number"
                    min={1}
                    value={count}
                    onChange={handleChange}
                    className="w-14 border border-gray-light rounded-md text-center py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-500"
                  />
                </div>

                <button className="bg-red-600 text-[14px] text-white px-5 py-2 rounded-full font-semibold border hover:bg-white  hover:border-red-600 hover:text-red-600 transition-all ">
                  Add to Cart
                </button>
              </div>

              <div className="mt-4 text-sm">
                {detailProduct.stock >= 1 ? <p className="colorGreen font-bold text-[14px]">In Stock</p> :
                  <p className="colorGreen font-semibold text-[13px]">Out of Stock</p>
                }
                <p className="flex items-center mt-2 text-color text-[15px] font-medium">
                  <span className="bg-black rounded-3xl p-2 mr-1 flex items-center"> <FiTool className="text-white text-[14px]" /></span> Required
                  Pre-assembly available
                </p>
                <p className="flex items-center mt-2 text-color text-[15px] font-medium">
                  <span className="bg-blue-600 rounded-2xl p-2 mr-1"> <MdLocalShipping className="text-white text-[14px]" /> </span>
                  Special Delivery Required: Product usually ships within 3-5 business days
                </p>
                <p className="mt-2 text-color text-[15px] font-medium">Installation available</p>
                <p className="mt-1 text-color text-[15px] font-semibold">Alternate codes: 26904-00; 627442</p>
              </div>
              <div className="flex items-center my-2 relative">
                <button className="mr-2 bg-red-600 p-[5px] rounded-3xl transition-all easy-in-out "
                  onMouseEnter={() => handleHover('tag')}
                  onClick={() => handelModal(true)}
                  onMouseLeave={() => handleHover(null)}>
                  <IoMdPricetag className="text-white text-[19px]" />
                  {hovered === "tag" && <p className="absolute top-full mt-2 z-2 l-o transition-all easy-in-out bg-gray-800 px-2 py-1 text-white text-[14px]">Flyer item- only until october 01, 2025
                  </p>}

                </button>
                <button className="mr-2 bg-gray-800 p-[5px] rounded-3xl transition-all easy-in-out "
                  onMouseEnter={() => handleHover('book')}
                  onMouseLeave={() => handleHover(null)}>
                  <IoBook className="text-white text-[16px]" />
                  {hovered === "book" && <p className="absolute top-full mt-2 z-2 l-o  transition-all easy-in-out bg-gray-800 px-2 py-1 text-white text-[14px]">Sourcebook item
                  </p>}
                </button>
                <button className="mr-2 bg-blue-600 p-[5px] rounded-3xl transition-all easy-in-out "
                  onMouseEnter={() => handleHover('delivery')}
                  onMouseLeave={() => handleHover(null)}>
                  <MdLocalShipping className="text-white text-[16px]" />
                  {hovered === "delivery" && <p className="absolute top-full mt-2 z-2 l-o  transition-all easy-in-out bg-gray-800 px-2 py-1 text-white text-[14px]"> Special Delivery Item
                  </p>}
                </button>
                <button className="mr-2 bg-gray-800 p-[5px] rounded-3xl transition-all easy-in-out "
                  onMouseEnter={() => handleHover('tool')}
                  onMouseLeave={() => handleHover(null)}>
                  <FiTool className="text-white text-[16px]" />
                  {hovered === "tool" && <p className="absolute top-full mt-2 z-2 l-o transition-all easy-in-out bg-gray-800 px-2 py-1 text-white text-[14px]"> Assembly available
                  </p>}
                </button>

              </div>
            </div>
          </div>
          <div className="max-w-full mt-10">
            <ul className="relative flex items-center border-t-1 border-b-1 border-gray-light">
              <li className="pr-5 py-3">
                <a href="#description" aria-label="description" className="text-red-600 text-[20px] font-semibold font-myfont">Description</a>
              </li>
              <li className="pr-5 py-3">
                <a href="#specifications" aria-label="specifications" className="text-red-600 text-[20px] font-semibold font-myfont">Specifications</a>
              </li>
              <li className="pr-5 py-3">
                <a href="#review" aria-label="review" className="text-red-600 text-[20px] font-semibold font-myfont">Reviews</a>
              </li>
            </ul>
            <section id="description" className="pt-5">
              <h1 className="text-color text-[24px] font-semibold font-myfont border-b-1 border-gray-light pb-3">Description</h1>
              <div className="px-3 py-3">
                <p className="text-[14px] text-color font-myfont ">
                  Our bagasse plates, bowls and containers are made of 100% sugarcane fiber, a sustainable, renewable, and biodegradable material making it a great alternative to traditional paper or plastics. Sugarcane pulp is hygienic and green and is 100% biodegradable in 90-180 days while bringing quality to our take-out containers that are built stronger than paper or cardboard food boxes. Our bagasse compostables are made with BPI Certified material, which is cut resistant, strong enough to hold all kinds of food without bending or breaking.
                </p>
                <ul className="pt-2 md:pl-10 list-disc sm:pl-1">
                  <li className="">
                    <p className="text-[14px] text-color ">Hinge container square takeout container</p>
                  </li>
                  <li className="">
                    <p className="text-[14px] text-color ">200 Pack</p>
                  </li>
                  <li className="">
                    <p className="text-[14px] text-color ">{`Widht:${detailProduct.dimensions.width} * height:${detailProduct.dimensions.height}`}</p>
                  </li>
                  <li className="">
                    <p className="text-[14px] text-color ">Hinge container square takeout container</p>
                  </li>
                </ul>
              </div>
            </section>
            <div id="review" className="pt-5">

            </div>
          </div>
        </div>
      </div>

      {/* modal */}
      <Dialog open={openModal} onClose={setOpenModal} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/80 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-2xl data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="bg-gray-200 px-2 py-2 flex sm:flex-row sm:px-6 items-center justify-between">
                <h1 className="text-[18px] font-bold">Product Feature Legend</h1>
                <button
                  type="button"
                  data-autofocus
                  onClick={() => setOpenModal(false)}
                  className="text-[14px] font-semibold text-color"
                >
                  Close
                </button>
              </div>
              <div className="bg-white px-8 py-4 mb-2">
                <div className="flex w-full relative">
                  <button className="bg-blue-600 p-[5px] mt-[8px] rounded-2xl transition-all easy-in-out w-[26px] h-[26px] flex item-center justify-center relative"
                    onMouseEnter={() => handleHover('deliveryModal')}
                    onMouseLeave={() => handleHover(null)}>
                    <MdLocalShipping className="text-white text-[16px]" />
                    {hovered === "deliveryModal" && <p className="absolute top-5 mt-2 z-10 left-0 transition-all easy-in-out bg-gray-800 px-2 py-1 text-white text-[14px] w-[150px]"> Special Delivery Item
                    </p>}
                  </button>
                  <div className="pl-4">
                    <h2 className="text-[20px] font-semibold text-color">Special Delivery Item</h2>
                    <p className="text-[#9b9b9b] text-[14px] ">
                      Indicates that an item requires special delivery. Additional delivery charges may apply for this item.
                    </p>
                  </div>
                </div>
                <div className="flex w-full relative mt-3">
                  <button className="bg-red-600 p-[5px] mt-[8px] rounded-2xl transition-all easy-in-out w-[26px] h-[26px] flex item-center justify-center relative"
                    onMouseEnter={() => handleHover('tagModal')}
                    onMouseLeave={() => handleHover(null)}>
                    <IoMdPricetag className="text-white text-[16px]" />
                    {hovered === "tagModal" && <p className="absolute top-5 mt-2 z-10 left-0 transition-all easy-in-out bg-gray-800 px-2 py-1 text-white text-[14px] w-[150px]"> Special Delivery Item
                    </p>}
                  </button>
                  <div className="pl-4">
                    <h2 className="text-[20px] font-semibold text-color">Flyer Item</h2>
                    <p className="text-[#9b9b9b] text-[14px] ">
                      Indicates that an item is included in a promotional publication.
                    </p>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>

      {loading && <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="w-12 h-12 border-4 border-white border-t-red-600 rounded-full animate-spin"></div>
      </div>}
      <Footer />
    </main>
  );
}

export default ProductDetails