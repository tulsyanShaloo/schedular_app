import React, { useState, useEffect } from 'react'
import {
  format,
  differenceInMinutes,
  addMinutes,
  endOfDay,
  isEqual,
} from 'date-fns'

const TIME_FORMAT = 'hh:mm a'

const MyModal = ({ event, eventLists, onClose, visible, addEvent }) => {
  const [title, setTitle] = useState('')
  const [startTime, setStartTime] = useState(new Date())
  const [endTime, setEndTime] = useState(new Date())
  const [day, setDay] = useState('')
  const [myEventLists, setEventLists] = useState([])
  const [suggestedStartTime, setSuggestedStartTime] = useState(new Date())
  const [newEndTime, setNewEndTime] = useState(new Date())
  const [newTitle, setNewTitle] = useState('')
  const [endTimeOptions, setEndTimeOptions] = useState([])
  const [minDuration, setMinDuration] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {console.log(event)
    const { end, start, title } = event
    if (start) {
      setStartTime(new Date(start))
      const dayOfWeek = format(start, 'MMMM d, yyyy')
      setDay(dayOfWeek)
    }

    if (end) {
      setEndTime(new Date(end))
      const minuteDiff = differenceInMinutes(event.end, event.start)
      setMinDuration(minuteDiff)
    }

    if (title) setTitle(title)

    let newStartTime = end ? new Date(end) : new Date()
    if (eventLists.length) {
      setEventLists(eventLists)
      eventLists.forEach((event) => {
        if (isEqual(new Date(event.start), new Date(newStartTime)))
          newStartTime = new Date(event.end)
      })

      setSuggestedStartTime(new Date(newStartTime))

      const endOfDayTime = endOfDay(newStartTime)
      setNewEndTime(addMinutes(newStartTime, minDuration))

      const firstValue = addMinutes(newStartTime, 15)
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
  }, [event, eventLists])

  const handleSelectChange = (event) => {
    const { value } = event.target
    setNewEndTime(new Date(value))
    const minuteDiff = differenceInMinutes(
      new Date(value),
      new Date(suggestedStartTime)
    )
    setMinDuration(minuteDiff)
  }

  const validateEvents = () => {
    setError('')
    if (!newTitle.length) {
      setError('Title is required')
      return true
    }
    return false
  }

  const handleClick = () => {
    const validateError = validateEvents()
    if (validateError) return

    onAddEvent()
  }

  const onAddEvent = () => {
    const endTimeDuration = addMinutes(
      new Date(suggestedStartTime),
      minDuration
    )

    const newEvent = {
      title: newTitle,
      start: new Date(suggestedStartTime),
      end: new Date(endTimeDuration),
    }

    addEvent(newEvent)
    handleOnClose()
  }

  const handleOnClose = (e) => {
    setTitle('')
    setStartTime(new Date())
    setEndTime(new Date())
    setDay('')
    setSuggestedStartTime(new Date())
    setNewEndTime(new Date())
    setNewTitle('')
    setMinDuration(null)
    onClose()
  }

  if (!visible) return null

  return (
    <div
      id="container"
      className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center"
    >
      <div className="w-[600px] flex flex-col">
        <div className="bg-white rounded w-96 overflow-auto p-5">
          <p className="text-gray-800 font-medium text-xl leading-4 mb-2 tracking-wide">
            {title}
          </p>
          <p className="p-1 text-base">{` ${day} : ${format(
            startTime,
            TIME_FORMAT
          )} - ${format(endTime, TIME_FORMAT)}`}</p>
          <p className="p-1 text-base text-gray-500">
            This slot is already booked. Below is new available slot to make an
            appointment
          </p>

          <div className="flex flex-col">
            <div
              className="sm:flex sm:flex-row justify-between"
              style={{ width: '350px' }}
            >
              <input
                type="text"
                className="border border-gray-700 p-2 rounded mb-5 px-5 py-2 pl-2 sm:w-auto sm:text-sm w-full max-w-sm"
                placeholder="Start Time"
                value={format(suggestedStartTime, TIME_FORMAT)}
                style={{ width: '150px' }}
              />

              <select
                value={newEndTime}
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
            <input
              type="text"
              className="border border-gray-700 p-2 rounded mb-5"
              placeholder="Title"
              onChange={(e) => setNewTitle(e.target.value)}
              value={newTitle}
            />
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
