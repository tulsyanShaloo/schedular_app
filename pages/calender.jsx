import React, { useState, useContext, useEffect } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import enUS from 'date-fns/locale/en-US'
import Modal from '../components/modal'
import MyModal from '../components/inputModal'

import { AppContext } from './AppContext'

const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

export default function MyCalender() {
  const [isInputModalOpen, setIsInputModalOpen] = useState(false)
  const [events, setEvents] = useState()
  const [myEvent, setEvent] = useState({})
  const [isSelectedEventModalOpen, setSelectedEventModal] = useState(false)
  const [mySelectedEvent, setSelectedEvent] = useState({})

  const { state, addEvent } = useContext(AppContext)

  useEffect(() => {
    const { events } = state
    const parseEvents = events.map((event) => {
      return {
        title: event.title,
        start: new Date(event.start),
        end: new Date(event.end),
      }
    })
    setEvents(parseEvents)
  }, [state])

  const handleEventSelectedSlot = (event) => {
    setSelectedEvent(event)
    setSelectedEventModal(true)
  }

  const handleSelectedSlot = ({ start, end, slots }) => {
    setEvent({ start, end, slots })
    setIsInputModalOpen(true)
  }

  const handleOnModalClose = () => {
    setIsInputModalOpen(false)
  }

  const handleSelectedEventModalClose = () => {
    setSelectedEventModal(false)
  }

  return (
    //remove relative from here add to the calling element of modal
    <main className="flex flex-col items-center justify-between p-24">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 700, width: 900 }}
        onSelectEvent={handleEventSelectedSlot}
        defaultView="week"
        views={['month', 'week', 'day']}
        onSelectSlot={handleSelectedSlot}
        selectable
      />

      <Modal
        visible={isSelectedEventModalOpen}
        event={mySelectedEvent}
        onClose={handleSelectedEventModalClose}
        eventLists={state.events}
        addEvent={addEvent}
      />
      <MyModal
        event={myEvent}
        onClose={handleOnModalClose}
        visible={isInputModalOpen}
        state={state}
        addEvent={addEvent}
      />
    </main>
  )
}
