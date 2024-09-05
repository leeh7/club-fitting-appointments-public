import { Form } from 'react-bootstrap'
import DatePickerComponent from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useAppStore } from '../store/store'

function DatePicker() {
  const { selectedDate, setSelectedDate } = useAppStore()

  return (
    <div>
      <h2>Select a Date</h2>
      <Form.Group>
        <DatePickerComponent
          selected={selectedDate}
          onChange={(date: Date | null) => setSelectedDate(date)}
          minDate={new Date()}
          dateFormat="MMMM d, yyyy"
          className="form-control"
        />
      </Form.Group>
    </div>
  )
}

export default DatePicker
