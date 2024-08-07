import { IListQuantityRemain, IProduct } from '@/types'

import { addProductToCart } from '@/store/slices/cart.slice'
import { clsxm } from '@/utils'
import { useAppDispatch, useAppSelector } from '@/store'
import { useState } from 'react'
import { message } from 'antd'

interface ProductInfoProps {
  productInfo: IProduct
}

export const ProductInfo = ({ productInfo }: ProductInfoProps) => {
  const [quantiry, setQuantiry] = useState(1)
    const { cart } = useAppSelector((state) => state.cart)


  const [sizeSelected, setSizeSelected] = useState<IListQuantityRemain | null>(productInfo.listQuantityRemain[0])
  // console.log("productInfo",sizeSelected.quantity)
  const dispatch = useAppDispatch()
  // giảm số lượng sản phẩm
  const decreaseQuantity = () => {
    if (quantiry > 1) {
      setQuantiry(quantiry - 1)
    }
  }

  // tăng số lượng sản phẩm
  const increaseQuantity = () => {
    if (sizeSelected === null) {
      message.error('Bạn chưa chọn size sản phẩm!')
      return
    }
    if (quantiry >= sizeSelected.quantity) {
      message.error('Số lượng sản phẩm không đủ!')
      return
    }
    setQuantiry(quantiry + 1)
  }

  // add to cart
  const handleAddToCart = () => {
    if (!sizeSelected) {
      message.error('Bạn chưa chọn size sản phẩm!')
      return
    }

    // Tìm sản phẩm trong giỏ hàng có _id tương tự với sản phẩm đang xét
    const cartItem = cart.find(item => item._id === productInfo._id)

    if (cartItem) {
      // Nếu sản phẩm đã có trong giỏ hàng, kiểm tra xem số lượng đã chọn có vượt quá số lượng hiện có hay không
      if (cartItem.nameSize === sizeSelected.nameSize) {        
        if (quantiry + cartItem.quantity > sizeSelected.quantity) {
        message.error('Số lượng sản phẩm không đủ!')
        return
      }
      }

    } else {
      // Nếu sản phẩm chưa có trong giỏ hàng, kiểm tra xem số lượng đã chọn có vượt quá số lượng hiện có hay không
      if (quantiry > sizeSelected.quantity) {
        message.error('Số lượng sản phẩm không đủ!')
        return
      }
    }

    const data = {
      _id: productInfo._id,
      nameProduct: productInfo.name,
      nameSize: sizeSelected.nameSize,
      quantity: quantiry,
      nameColor: sizeSelected.nameColor,
      price: productInfo.price,
      image: productInfo.image[0],
      maxQuantity: productInfo.quantity
    }
    dispatch(addProductToCart(data))
    message.success('Thêm sản phẩm vào giỏ hàng thành công!')
  }

  return (
    <div className='flex flex-col gap-5 select-none'>
      <h2 className='flex items-center gap-5 text-4xl font-semibold'>
        <span>{productInfo.name}</span>
      </h2>
      <p className='items-center gap-4 text-xl font-semibold flext'>
        <span>{productInfo.price.toLocaleString()}₫</span>
        {productInfo?.hot_sale && (
          <span className='m-2 text-sm font-medium text-center rounded-full '>
            {'Sale '}
            {Math.round(((productInfo?.hot_sale - productInfo.price) / productInfo?.hot_sale) * 100)} %
          </span>
        )}
      </p>
      <p className='text-base text-gray-600'>{productInfo.description}</p>
      <p className='text-sm'>Hãy là người đầu tiên đưa ra đánh giá.</p>
      <p className='text-lg font-medium'>
        <span className='font-normal'>Size:</span>{' '}
        {productInfo.listQuantityRemain
  .slice() // Create a shallow copy to avoid mutating the original array
  .sort((a, b) => a.nameSize.localeCompare(b.nameSize)) // Sort by nameSize in ascending order
  .map((size, index) => (
    <button
      key={index}
      disabled={size.quantity == 0}
      className={clsxm('px-2 py-1 mx-1 border border-gray-300 rounded-md cursor-pointer', {
        'bg-primeColor text-white': size === sizeSelected,
        'opacity-[0.6] cursor-not-allowed': size.quantity == 0
      })}
      onClick={() => setSizeSelected(size)}
    >
      {size.nameSize}
    </button>
  ))}


      </p>
      <p className=''>Số lượng: {sizeSelected?.quantity}</p>
      <div className='flex items-center border-2 border-gray-300 rounded-md py-3 px-5 w-full max-w-[150px] justify-around'>
        <button className='' onClick={decreaseQuantity}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-6 h-6'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M5 12h14' />
          </svg>
        </button>

        <div className=''>{quantiry}</div>

        <button className='' onClick={increaseQuantity}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-6 h-6'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
          </svg>
        </button>
      </div>
      <button
        className='w-full py-4 text-lg text-white duration-300 bg-primeColor hover:bg-black font-titleFont'
        onClick={handleAddToCart}
      >
        Thêm Sản Phẩm
      </button>
      <p className='text-sm font-normal'>
        <span className='text-base font-medium'> Loại: </span>Bộ sưu tập mùa xuân, Dạo phố, Nữ Tags: đặc sắc
        Mã hàng: Không áp dụng
      </p>
    </div>
  )
}
