'use client'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import OfferSlider from '@/components/Home/OfferSlider'
import PopularCategories from '@/components/Home/PopularCategories'
import SliderSkeleton from '@/components/Skeleton/Sliderskeleton'
import { sliderApi } from '@/utils/api'
import { SliderData, setSlider } from '@/redux/reuducer/sliderSlice'

const HomeHeaderOnly = () => {
  const dispatch = useDispatch()
  const slider = useSelector(SliderData)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchSliderData = async () => {
      try {
        setIsLoading(true)
        const response = await sliderApi.getSlider();
        const data = response.data;
        dispatch(setSlider(data.data))
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false)
      }
    }
    fetchSliderData();
  }, [])

  return (
    <>
      {isLoading ? (<SliderSkeleton />) : (<OfferSlider sliderData={slider} />)}
      <PopularCategories />
    </>
  )
}

export default HomeHeaderOnly

