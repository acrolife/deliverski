import React, { useEffect, useState, useRef } from 'react';
import { Form as FinalForm, FormSpy } from 'react-final-form';
import { Field } from 'react-final-form';
import * as validators from '../../../util/validators';
import { getDefaultTimeZoneOnBrowser, timestampToDate } from '../../../util/dates';

import arrayMutators from 'final-form-arrays';
import Portal from '@material-ui/core/Portal';
import { Button, FieldSelect } from '../../../components';
import Grid from '@mui/material/Grid';
import CustomTimePicker from './CustomTimePicker';
import Select from 'react-select';
import css from './WeeklySchedulerForm.module.css';
import { FieldArray } from 'react-final-form-arrays';

const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const hoursOptions = [
  // '00',
  // '01',
  // '02',
  // '03',
  // '04',
  // '05',
  // '06',
  // '07',
  // '08',
  // '09',
  // '10',
  // '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
];
const minutesOptions = ['00', '15', '30', '45'];
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const WeeklySchedulerForm = props => {
  return (
    <FieldArray name={'schedule'} key="schedule">
      {({ fields }) => {
        return (
          <div className={css.wrapper}>
            {fields.map((name, index) => {
              const weekdayIndexNumber = Number(name.charAt(name.length - 2));
              const weekdayLabel = weekdays[weekdayIndexNumber];
              return (
                <div className={css.fieldWrapper} key={name}>
                  <p className={css.dayLabel}>
                    <strong>{capitalizeFirstLetter(weekdayLabel)}:</strong>
                  </p>

                  <div className={css.inputsWrapper}>
                    <p className={css.separator1}>
                      <strong>From</strong>
                    </p>
                    <FieldSelect
                      className={css.selectField}
                      id={`${name}.startHour`}
                      name={`${name}.startHour`}
                    >
                      {hoursOptions.map(o => {
                        return (
                          <option value={o} key={o}>
                            {o}
                          </option>
                        );
                      })}
                    </FieldSelect>
                    <p className={css.separator2}>:</p>
                    <FieldSelect
                      className={css.selectField}
                      id={`${name}.startMinute`}
                      name={`${name}.startMinute`}
                    >
                      {minutesOptions.map(o => {
                        return (
                          <option value={o} key={o}>
                            {o}
                          </option>
                        );
                      })}
                    </FieldSelect>
                    <p className={css.separator1}>
                      <strong>till</strong>
                    </p>

                    <FieldSelect
                      className={css.selectField}
                      id={`${name}.endHour`}
                      name={`${name}.endHour`}
                    >
                      {hoursOptions.map(o => {
                        return (
                          <option value={o} key={o}>
                            {o}
                          </option>
                        );
                      })}
                    </FieldSelect>
                    <p className={css.separator2}>:</p>
                    <FieldSelect
                      className={css.selectField}
                      id={`${name}.endMinute`}
                      name={`${name}.endMinute`}
                    >
                      {minutesOptions.map(o => {
                        return (
                          <option value={o} key={o}>
                            {o}
                          </option>
                        );
                      })}
                    </FieldSelect>
                  </div>
                </div>
              );
            })}
          </div>
        );
      }}
    </FieldArray>
  );
};

export default WeeklySchedulerForm;
