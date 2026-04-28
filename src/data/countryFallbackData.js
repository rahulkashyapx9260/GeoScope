export const religionByCountryCode = {
  IND: 'Hinduism, Islam, Christianity, Sikhism, Buddhism, Jainism',
  USA: 'Christianity, Judaism, Islam, Buddhism, Hinduism',
  GBR: 'Christianity, Islam, Hinduism, Sikhism, Judaism',
  FRA: 'Christianity, Islam, Judaism, Buddhism',
  DEU: 'Christianity, Islam, Judaism, Buddhism',
  BRA: 'Christianity, Afro-Brazilian religions, Spiritism',
  JPN: 'Shinto, Buddhism, Christianity',
  CHN: 'Buddhism, Taoism, Folk religions, Islam, Christianity',
  RUS: 'Orthodox Christianity, Islam, Buddhism, Judaism',
}

export const famousPlacesByCountryCode = {
  IND: [
    {
      name: 'Taj Mahal',
      image:
        'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1000&q=80',
      description: 'A UNESCO World Heritage monument in Agra.',
    },
    {
      name: 'Jaipur City Palace',
      image:
        'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80',
      description: 'Historic palace complex in Rajasthan.',
    },
  ],
  USA: [
    {
      name: 'Grand Canyon',
      image:
        'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?auto=format&fit=crop&w=1000&q=80',
      description: 'Famous canyon landscape in Arizona.',
    },
    {
      name: 'Statue of Liberty',
      image:
        'https://images.unsplash.com/photo-1520975922203-bf07bfedd7e7?auto=format&fit=crop&w=1000&q=80',
      description: 'Iconic symbol of freedom in New York.',
    },
  ],
  FRA: [
    {
      name: 'Eiffel Tower',
      image:
        'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?auto=format&fit=crop&w=1000&q=80',
      description: 'Landmark of Paris and global symbol of France.',
    },
  ],
}

export const fallbackCitiesByCountryCode = {
  IND: ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai'],
  USA: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'],
  GBR: ['London', 'Birmingham', 'Manchester', 'Leeds', 'Glasgow'],
}
