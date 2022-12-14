import React, { useState, useEffect } from 'react';
import { Timeit } from 'react-timeit';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import './CustomTimePicker.css';

function CustomTimePicker(props) {
  const {
    disabled,
    handleChangeCustomTimePicker,
    time,
    label,
    minAllowedHour,
    maxAllowedHour,
    fullWidth,
  } = props;
  const [isOpen, setIsOpen] = useState(props.isOpen ? true : false);

  let excludedHours = [];

  if (minAllowedHour) {
    for (let i = 0; i < minAllowedHour; i++) {
      excludedHours.push(i);
    }
  }

  if (maxAllowedHour) {
    for (let i = maxAllowedHour + 1; i <= 23; i++) {
      excludedHours.push(i);
    }
  }

  return (
    <div className="wrapper">
      <div
        className={
          disabled
            ? 'dummyTimeWrapperDisabled'
            : fullWidth
            ? 'dummyTimeWrapperFull'
            : 'dummyTimeWrapper'
        }
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={'dummyTimeValueModified'}>{!time ? label : time}</div>

        <div className="dummyTimeIcon">
          <AccessTimeIcon />
        </div>
      </div>

      {isOpen ? (
        <Timeit
          onChange={handleChangeCustomTimePicker}
          defualtValue={time ? time : '13:00'}
          minuteExclude={[
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            16,
            17,
            18,
            19,
            20,
            21,
            22,
            23,
            24,
            25,
            26,
            27,
            28,
            29,
            31,
            32,
            33,
            34,
            35,
            36,
            37,
            38,
            39,
            40,
            41,
            42,
            43,
            44,
            45,
            46,
            47,
            48,
            49,
            50,
            51,
            52,
            53,
            54,
            55,
            56,
            57,
            58,
            59,
          ]}
          hourExclude={excludedHours}
        />
      ) : null}
    </div>
  );
}

export default CustomTimePicker;
