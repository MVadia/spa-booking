import React from 'react';

const services = [
  {
    title: 'Jacuzzi',
    description: 'Relax in our state-of-the-art jacuzzi with hydrotherapy jets',
    icon: '💆‍♀️'
  },
  {
    title: 'Steam Room',
    description: 'Experience the benefits of steam therapy in our modern steam room',
    icon: '🧖‍♀️'
  },
  {
    title: 'Sauna',
    description: 'Traditional sauna for deep relaxation and detoxification',
    icon: '🔥'
  },
  {
    title: 'Ice Bath',
    description: 'Revitalize your body with our therapeutic ice bath experience',
    icon: '❄️'
  },
  {
    title: 'Showers',
    description: 'Luxury  showers with temperature control',
    icon: '🚿'
  }
];

function Services() {
  return (
    <section id="services" className="services-section">
      <h2>Our Services</h2>
      <div className="services-grid">
        {services.map((service, index) => (
          <div key={index} className="service-card">
            <div className="service-icon">{service.icon}</div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Services; 