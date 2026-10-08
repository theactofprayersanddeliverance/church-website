import React from 'react';
import { ServiceItem } from '../types';
import { DAYS, fmtTime } from '../utils/formatters';

interface ServiceCardProps {
  service: ServiceItem;
  index?: number;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, index = 0 }) => {
  return (
    <article
      className="card rv in"
      style={{ '--d': `${index * 0.08}s` } as React.CSSProperties}
    >
      <div className="when">
        <small>{DAYS[service.day]}</small>
        {fmtTime(service.time)}
      </div>
      <div>
        <h3>{service.name}</h3>
        <div className="where">{service.venue}</div>
      </div>
    </article>
  );
};
