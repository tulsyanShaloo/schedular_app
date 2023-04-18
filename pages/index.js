import React from 'react'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import MyCalender from './calender'

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between p-24">
      <MyCalender />
    </main>
  )
}
