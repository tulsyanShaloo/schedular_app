import React, { useState, useEffect } from 'react'
import { format, differenceInMinutes, addMinutes, endOfDay } from 'date-fns'

const TIME_FORMAT = 'hh:mm a'

const MyModal = ({ event, onClose, visible, state, addEvent }) => {
  const [title, setTitle] = useState('')
  const [startTime, setStartTime] = useState(new Date())
  const [endTime, setEndTime] = useState(new Date())
  const [minDuration, setMinDuration] = useState(null)
  const [day, setDay] = useState('')
  const [error, setError] = useState('')
  const [endTimeOptions, setEndTimeOptions] = useState([])

  useEffect(() => {
    const { end, start } = event
    if (start) {
      setStartTime(new Date(start))
      const dayOfWeek = format(start, 'MMMM d, yyyy')
      setDay(dayOfWeek)
    }

    if (end) {
      setEndTime(new Date(end))

      const minuteDiff = differenceInMinutes(event.end, event.start)
      setMinDuration(minuteDiff)

      const endOfDayTime = endOfDay(start)

      const firstValue = addMinutes(start, 15)
      const endTimeOptions = []
      for (
        let tempTime = firstValue;
        tempTime <= endOfDayTime;
        tempTime = addMinutes(tempTime, 15)
      ) {
        endTimeOptions.push(tempTime)
      }
      setEndTimeOptions(endTimeOptions)
    }
  }, [event])

  const handleSelectChange = (event) => {
    const { value } = event.target
    setEndTime(new Date(value))
    const minuteDiff = differenceInMinutes(new Date(value), new Date(startTime))
    setMinDuration(minuteDiff)
  }

  const handleOnClose = (e) => {
    setError('')
    setTitle('')
    setStartTime(new Date())
    setEndTime(new Date())
    setMinDuration(null)
    setDay('')

    onClose()
  }

  const validateEvents = () => {
    setError('')
    if (!title.length) {
      setError('Title is required')
      return true
    }
    return false
  }

  const onAddEvent = () => {
    const endTimeDuration = addMinutes(new Date(event.start), minDuration)

    const newEvent = {
      title: title,
      start: new Date(event.start),
      end: new Date(endTimeDuration),
    }

    addEvent(newEvent)
    handleOnClose()
  }

  const handleClick = () => {
    const validateError = validateEvents()
    if (validateError) return

    onAddEvent()
  }

  if (!visible) return null

  return (
    <div
      id="container"
      className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center"
    >
      <div className="w-[600px] flex flex-col">
        <div className="bg-white p-2 rounded w-96 overflow-auto">
          <p className="text-center text-gray-700 mb-5">Add Event</p>

          <div className="flex flex-col">
            <input
              type="text"
              className="border border-gray-700 p-2 rounded mb-5"
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
            <p className="p-2">{day}</p>
            <div
              className="sm:flex sm:flex-row justify-between"
              style={{ width: '350px' }}
            >
              <input
                type="text"
                className="border border-gray-700 p-2 rounded mb-5 px-5 py-2 pl-2 sm:w-auto sm:text-sm w-full max-w-sm"
                placeholder="Start Time"
                value={format(startTime, TIME_FORMAT)}
                style={{ width: '150px' }}
              />

              <select
                value={endTime}
                onChange={handleSelectChange}
                className="border border-gray-700 p-2 rounded mb-5 px-5 py-2 sm:w-auto sm:text-sm w-full max-w-sm"
                style={{ width: '150px' }}
              >
                {endTimeOptions.map((option) => (
                  <option key={option} value={option}>
                    {format(option, TIME_FORMAT)}
                  </option>
                ))}
              </select>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={handleClick}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-700 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Add
              </button>
              <button
                type="button"
                onClick={handleOnClose}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-700 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Close
              </button>
            </div>
          </div>
          {error.length ? <p className="text-red-600">{error}</p> : null}
        </div>
      </div>
    </div>
  )
}

export default MyModal
