import React, { useContext } from 'react';
import AlertContext from '../../context/alert/alertContext';

const Alerts = () => {
  const alertContext = useContext(AlertContext);

  const { alerts } = alertContext;

  return (
    alerts != null && (
      <div className={`alert alert-${alerts.type}`}>
        <i className='fas fa-info-circle' />
        {alerts.msg}
      </div>
    )
  );
};

export default Alerts;
