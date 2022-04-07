import React, { useEffect, useState, useRef } from 'react';
import { Form as FinalForm, FormSpy } from 'react-final-form';
import {Field} from 'react-final-form';
import * as validators from '../../../util/validators';
import arrayMutators from 'final-form-arrays';
import Portal from '@material-ui/core/Portal';
import { 
    Button, 
} from '../../../components';
import Grid from '@mui/material/Grid';
import CustomTimePicker from './CustomTimePicker';
import css from './WeeklySchedulerForm.module.css';


const DaySchedulePicker = (props) => {
    
  const { day, name } = props;


  const daySchedulePickerField = ({ input: { onChange, value }, label, ...rest }) =>{
          
    const [start, setStart] = useState(value.start ?? '07:00');
    const [end, setEnd] = useState(value.end ?? '23:00');

    const handleStart = (v) => {
      setStart(v)
      onChange({
        day,
        start: v,
        end
      })
    }

    const handleEnd = (v) => {
      setEnd(v)
      onChange({
        day,
        start,
        end: v
      })
    }
      return(
            <div>

              <p>{day}</p>

            <CustomTimePicker
              disabled={false}
              label="Start time"
              handleChangeCustomTimePicker={handleStart}
              time={start}
              isOpen={false}
              fullWidth={true}
              minAllowedHour={7}
              maxAllowedHour={23}
            />


          <CustomTimePicker
              disabled={false}
              label="Closing time"
              handleChangeCustomTimePicker={handleEnd}
              time={end}
              isOpen={false}
              fullWidth={true}
              minAllowedHour={7}
              maxAllowedHour={23}
            />

            </div>
          )}

  return(
    <div>
      <Field
        name={name}
        component={daySchedulePickerField}
      />
    </div>
  )
}


const WeeklySchedulerForm = (props) => {
  const portalRef = useRef(null);
    // const onSubmit = (values) => {
    //     console.log(values)
    //   }
    
    //   const onChange = (formValues) => {
    //     console.log(formValues.values)
    //   }
   const daysInWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];


 


   const weeklyScheduleField = ({ input: { onChange, value }, label, ...rest }) => {
     
    const defaultSchedule = value ?? [
      {
        day: 'monday',
        start: '07:00',
        end: '23:00'
      },
      {
        dat: 'tuesday',
        start: '07:00',
        end: '23:00'
      },
      {
        day: 'wednesday',
        start: '07:00',
        end: '23:00'
      },
      {
        day: 'thursday',
        start: '07:00',
        end: '23:00'
      },
      {
        day: 'friday',
        start: '07:00',
        end: '23:00'
      },
      {
        day: 'saturday',
        start: '07:00',
        end: '23:00'
      },
      {
        day: 'sunday',
        start: '07:00',
        end: '23:00'
      }
    ]

    const dummyOnSubmit = (values) => {
      console.log(values)
    }

    const combinedOnChange = (formValues) => {
      console.log(formValues.values)
    }


    return(
    <div>

        <FinalForm
            onSubmit={dummyOnSubmit}
            mutators={{ ...arrayMutators }}
            render={fieldRenderProps => {
              const { handleSubmit, invalid, pristine, submitting, formName, values } = fieldRenderProps;

              const required = validators.required('This field is required');
              const submitDisabled = invalid || pristine || submitting;
              return (
                <Portal container={portalRef.current}>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    handleSubmit(e);
                  }}
                >
                  <FormSpy onChange={combinedOnChange} />

                  {daysInWeek.map(d => {
                    return(
                      <DaySchedulePicker key={d} day={d} name={d}/>
                    )
                  })}
                  
                </form>
                </Portal>
              );
            }}
          />
    </div>
  )}


  return (
    <div> 
       <div ref={portalRef} />
        <Field
          name="weeklySchedule"
          // label="Adults"
          component={weeklyScheduleField}
        />
    </div>
  )
}

export default WeeklySchedulerForm


